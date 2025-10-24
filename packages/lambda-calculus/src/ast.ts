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
      variableName: string;
      body: LCTerm;
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
  return populateIndices(auxiliary);
};

// The ASTVisitor must return three things:
// 1. The simplified term.
// 2. A naming context of free variables.
// 3. A naming context of bound variables.
// As an auxiliary helper, we'll also return a stack of bound variables
// in the current context.

class ASTVisitor implements LambdaCalculusVisitor<LCTerm> {
  visit(tree: ParseTree): LCTerm {
    return tree.accept(this);
  }
  visitTerm(ctx: TermContext): LCTerm {
    return (
      ctx.abstraction()?.accept(this) ??
      ctx.application()?.accept(this) ??
      ctx.atom()?.accept(this)!
    );
  }
  visitChildren(node: RuleNode): LCTerm {
    throw new Error("Not implemented");
  }
  visitTerminal(node: TerminalNode): LCTerm {
    throw new Error("Not implemented");
  }
  visitErrorNode(node: ErrorNode): LCTerm {
    throw new Error("Not implemented");
  }
  visitProg(ctx: ProgContext): LCTerm {
    return ctx.term().accept(this);
  }
  visitAbstraction(ctx: AbstractionContext): LCTerm {
    const variableName = ctx.ID().text;
    const body = ctx.term().accept(this);
    return { type: "abstraction", variableName, body };
  }
  visitApplication(ctx: ApplicationContext): LCTerm {
    return ctx.accept(this);
  }
  visitAppLeftRecursion(ctx: AppLeftRecursionContext): LCTerm {
    return {
      type: "application",
      function: ctx.application().accept(this),
      argument: ctx.atom().accept(this),
    };
  }
  visitAppBaseCase(ctx: AppBaseCaseContext): LCTerm {
    return {
      type: "application",
      function: ctx.atom(0).accept(this),
      argument: ctx.atom(1).accept(this),
    };
  }
  visitAtom(ctx: AtomContext): LCTerm {
    return ctx.variable()?.accept(this) ?? ctx.term()?.accept(this)!;
  }
  visitVariable(ctx: VariableContext): LCTerm {
    const variableName = ctx.ID().text;
    return { type: "variable", variableName, variable: 0 };
  }
}

// Converts variable names to de Brujin indices and returns a naming
// context for free variables. Would prefer to not have side-effects
// but I am bad at programming.
const populateIndices = (termInternal: LCTerm): LCTerm => {
  // Track the current node we're traversing in addition to the list
  // of bound variables in the context.
  const stack: [LCTerm, string[]][] = [[termInternal, []]];
  const freeVariables: string[] = [];
  while (stack.length) {
    const [term, boundVariables] = stack.pop()!;
    switch (term.type) {
      case "abstraction":
        stack.push([term.body, [term.variableName, ...boundVariables]]);
        break;
      case "application":
        stack.push(
          [term.argument, boundVariables],
          [term.function, boundVariables]
        );
        break;
      case "variable":
        const { variableName } = term;
        const boundIndex = boundVariables.findIndex((n) => n === variableName);
        const freeIndex = freeVariables.findIndex((n) => n === variableName);
        if (boundIndex !== -1) {
          term.variable = boundIndex;
        } else if (freeIndex !== -1) {
          term.variable = boundVariables.length + freeIndex;
        } else {
          term.variable = boundVariables.length + freeVariables.length;
          freeVariables.unshift(variableName);
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
