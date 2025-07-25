import { describe, expect, it } from "vitest";
import { evaluate } from "./eval";
import { parse } from "./ast";

describe("Eval Tests", () => {
  // Placeholder for evaluation tests
  // You would implement tests similar to the AST tests, but for the evaluation logic.
  // For example:
  it("should evaluate zero to 0", () => {
    const input = "zero";
    const result = evaluate(parse(input));
    expect(result).toEqual({ type: "zero" });
  });

  it("should evaluate succ zero to succ zero", () => {
    const input = "succ zero";
    const result = evaluate(parse(input));
    expect(result).toEqual({ type: "succ", term: { type: "zero" } });
  });

  it("should evaluate pred zero to zero", () => {
    const input = "pred zero";
    const result = evaluate(parse(input));
    expect(result).toEqual({ type: "zero" });
  });

  it("should evaluate iszero zero to true", () => {
    const input = "iszero zero";
    const result = evaluate(parse(input));
    expect(result).toEqual({ type: "true" });
  });

  it("should evaluate iszero succ zero to false", () => {
    const input = "iszero succ zero";
    const result = evaluate(parse(input));
    expect(result).toEqual({ type: "false" });
  });

  it("should evaluate nested expressions", () => {
    const input = "succ iszero zero";
    const result = evaluate(parse(input));
    expect(result).toEqual({ type: "succ", term: { type: "true" } });
  });

  it("should evaluate if true then succ zero else zero to succ zero", () => {
    const input = "if true then succ zero else zero";
    const result = evaluate(parse(input));
    expect(result).toEqual({ type: "succ", term: { type: "zero" } });
  });
});
