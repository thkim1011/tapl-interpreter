import { CharStreams, CommonTokenStream } from "antlr4ts";
import { LambdaCalculusLexer } from "./generated/LambdaCalculusLexer";
import {
  AbstractionContext,
  AppBaseCaseContext,
  AppLeftRecursionContext,
  ApplicationContext,
  AtomContext,
  LambdaCalculusParser,
  ProgContext,
  TermContext,
  VariableContext,
} from "./generated/LambdaCalculusParser";
import { LambdaCalculusVisitor } from "./generated/LambdaCalculusVisitor";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { RuleNode } from "antlr4ts/tree/RuleNode";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { ErrorNode } from "antlr4ts/tree/ErrorNode";

// We use de Brujin indices to refer to variables.
export type LCTerm =
  | {
      type: "application";
      function: LCTerm;
      argument: LCTerm;
    }
  | {
      type: "abstraction";
      body: LCTerm;
    }
  | {
      type: "variable";
      variable: number;
    };

type LCTermInternal =
  | {
      type: "application";
      function: LCTermInternal;
      argument: LCTermInternal;
    }
  | {
      type: "abstraction";
      variableName: string;
      body: LCTermInternal;
    }
  | {
      type: "variable";
      variableName: string;
      variable: number;
    };

export const parseLC = (input: string): LCTerm => {
  const inputStream = CharStreams.fromString(input);
  const lexer = new LambdaCalculusLexer(inputStream);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new LambdaCalculusParser(tokenStream);
  const tree = parser.prog();

  const visitor = new ASTVisitor();
  const auxiliary = visitor.visit(tree);
  return convertToIndices(auxiliary);
};

// The ASTVisitor must return three things:
// 1. The simplified term.
// 2. A naming context of free variables.
// 3. A naming context of bound variables.
// As an auxiliary helper, we'll also return a stack of bound variables
// in the current context.

class ASTVisitor implements LambdaCalculusVisitor<LCTermInternal> {
  visit(tree: ParseTree): LCTermInternal {
    return tree.accept(this);
  }
  visitTerm(ctx: TermContext): LCTermInternal {
    return (
      ctx.abstraction()?.accept(this) ??
      ctx.application()?.accept(this) ??
      ctx.atom()?.accept(this)!
    );
  }
  visitChildren(node: RuleNode): LCTermInternal {
    throw new Error("Not implemented");
  }
  visitTerminal(node: TerminalNode): LCTermInternal {
    throw new Error("Not implemented");
  }
  visitErrorNode(node: ErrorNode): LCTermInternal {
    throw new Error("Not implemented");
  }
  visitProg(ctx: ProgContext): LCTermInternal {
    return ctx.term().accept(this);
  }
  visitAbstraction(ctx: AbstractionContext): LCTermInternal {
    const variableName = ctx.ID().text;
    const body = ctx.term().accept(this);
    return { type: "abstraction", variableName, body };
  }
  visitApplication(ctx: ApplicationContext): LCTermInternal {
    return ctx.accept(this);
  }
  visitAppLeftRecursion(ctx: AppLeftRecursionContext): LCTermInternal {
    return {
      type: "application",
      function: ctx.application().accept(this),
      argument: ctx.atom().accept(this),
    };
  }
  visitAppBaseCase(ctx: AppBaseCaseContext): LCTermInternal {
    return {
      type: "application",
      function: ctx.atom(0).accept(this),
      argument: ctx.atom(1).accept(this),
    };
  }
  visitAtom(ctx: AtomContext): LCTermInternal {
    return ctx.variable()?.accept(this) ?? ctx.term()?.accept(this)!;
  }
  visitVariable(ctx: VariableContext): LCTermInternal {
    const variableName = ctx.ID().text;
    return { type: "variable", variableName, variable: 0 };
  }
}

// Converts variable names to de Brujin indices and returns a naming
// context for free variables.
const convertToIndices = (termInternal: LCTermInternal): LCTerm => {
  const stack = [termInternal];
  const boundVariables = [];
  const freeVariables = [];
  while (stack.length) {
    const term = stack.pop()!;
    switch (term.type) {
      case "abstraction":
        boundVariables.push(term.variableName);
        stack.push(term.body);
        break;
      case "application":
        stack.push(term.argument, term.function);
        break;
      case "variable":
        const { variableName } = term;
        const index =
          boundVariables.length -
          1 -
          boundVariables.findIndex((n) => n === variableName);
        if (index === boundVariables.length) {
          term.variable = index + freeVariables.length;
          freeVariables.push(variableName);
        } else {
          term.variable = index;
        }
        break;
    }
  }
  return termInternal;
};

export const print = (
  term: LCTerm,
  isLeftApp = false,
  isRightApp = false
): string => {
  switch (term.type) {
    case "variable":
      return `${term.variable}`;
    case "abstraction":
      const abs = `lambda. ${print(term.body)}`;
      return isLeftApp ? `(${abs})` : abs;
    case "application":
      const app = `${print(term.function, true, false)} ${print(term.argument, false, true)}`;
      return isRightApp ? `(${app})` : app;
  }
};
