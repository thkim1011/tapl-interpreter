import { describe, expect, it } from "vitest";
import { parseLC } from "./ast";
import { evaluate1, replace, shift } from "./eval";

describe("eval tests", () => {
  it("shift increments free variables by specified amount", () => {
    const term = parseLC("lambda x. y (lambda z. x)");
    const shiftedTerm = shift(term, 1, 0);
    if (shiftedTerm.type !== "abstraction") {
      expect.fail();
    }
    if (shiftedTerm.body.type !== "application") {
      expect.fail();
    }

    if (shiftedTerm.body.function.type !== "variable") {
      expect.fail();
    }
    expect(shiftedTerm.body.function.variable).toBe(2);
    const argument = shiftedTerm.body.argument;
    if (argument.type !== "abstraction") {
      expect.fail();
    }
    if (argument.body.type !== "variable") {
      expect.fail();
    }
    expect(argument.body.variable).toBe(1);
  });

  it("replace replaces specified variables correctly", () => {
    const term = replace(parseLC("lambda y. x"), 0, parseLC("y"));
    // Expect "lambda. 1"
    if (term.type !== "abstraction") {
      expect.fail();
    }
    if (term.body.type !== "variable") {
      expect.fail();
    }
    expect(term.body.variable).toBe(1);
  });

  it("one-step evaluation works properly", () => {
    const term = evaluate1(parseLC("(lambda x. x) y"));
    if (term.type !== "variable") {
      expect.fail();
    }
    expect(term.variable).toBe(0);
    expect(term.variableName).toBe("y");
  });
});
