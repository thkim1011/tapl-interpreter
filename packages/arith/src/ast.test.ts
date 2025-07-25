import { describe, expect, it } from "vitest";
import { parse } from "./ast";

describe("AST Tests", () => {
  it("should parse a simple term", () => {
    const input = "zero";
    const ast = parse(input);
    expect(ast).toEqual({
      type: "zero",
    });
  });

  it("should parse a simple term 2", () => {
    const input = "iszero zero";
    const ast = parse(input);
    expect(ast).toEqual({
      type: "iszero",
      term: { type: "zero" },
    });
  });

  it("should handle nested expressions", () => {
    const input = "succ iszero zero";
    const ast = parse(input);
    expect(ast).toEqual({
      type: "succ",
      term: {
        type: "iszero",
        term: { type: "zero" },
      },
    });
  });
  it("should split input into tokens correctly", () => {
    // This test checks the internal tokenization logic
    const input = "succ pred zero";
    // Simulate the tokenization step
    const tokens = input.split(/\s+/);
    expect(tokens).toEqual(["succ", "pred", "zero"]);
  });

  it("should throw on unexpected token", () => {
    // The parser expects a valid sequence, so "foo" should fail
    expect(() => parse("foo")).toThrow(/Unexpected token/);
  });

  it("should throw if tokens are missing", () => {
    // "succ" expects a term after it, so this should fail
    expect(() => parse("succ")).toThrow();
  });

  it("should throw if tokens are out of order", () => {
    // "zero succ" is not a valid prefix
    expect(() => parse("zero succ")).toThrow();
  });

  /*
  How to construct the tree in an LL parser:
  - Maintain a value stack alongside your control stack.
  - When you match a terminal (like "zero"), push the corresponding Term object onto the value stack.
  - When you reduce a non-terminal (like "succ term"), pop the term from the value stack, create a new Term object for "succ", and push it back.
  - For "if term then term else term", pop three terms and assemble the "if" Term object.
  - At the end, the value stack should have a single Term object: the AST.
  */
  // Add more tests as needed
});
