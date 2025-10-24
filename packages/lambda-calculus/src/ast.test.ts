import { describe, expect, it } from "vitest";
import { parseLC, print } from "./ast";

describe("ast tests", () => {
  it.each([
    ["lambda x. x", "lambda. 0"],
    ["lambda x. lambda y. x (y x)", "lambda. lambda. 1 (0 1)"],
    ["lambda s. lambda z. z", "lambda. lambda. 0"],
    ["lambda s. lambda z. s (s z)", "lambda. lambda. 1 (1 0)"],
    [
      "lambda m. lambda n. lambda s. lambda z. m s (n z s)",
      "lambda. lambda. lambda. lambda. 3 1 (2 0 1)",
    ],
    ["x y z", "0 1 2"],
    ["lambda x. lambda x. x", "lambda. lambda. 0"],
    ["lambda x. (lambda y. y) x", "lambda. (lambda. 0) 0"],
  ])("should parse a simple term", (termString, namelessRepr) => {
    const ast = parseLC(termString);
    expect(print(ast)).toEqual(namelessRepr);
  });
});
