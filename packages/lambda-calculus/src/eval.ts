import { LCTerm } from "./ast";

export const isValue = (term: LCTerm) => {
  return term.type === "abstraction";
};

export const shift = (term: LCTerm, d: number, cutoff: number = 0): LCTerm => {
  switch (term.type) {
    case "variable":
      return {
        type: "variable",
        variableName: term.variableName,
        variable: term.variable >= cutoff ? term.variable + d : term.variable,
      };
    case "abstraction":
      return {
        type: "abstraction",
        variableName: term.variableName,
        body: shift(term.body, d, cutoff + 1),
      };
    case "application":
      return {
        type: "application",
        function: shift(term.function, d, cutoff),
        argument: shift(term.argument, d, cutoff),
      };
  }
};

// Replaces all instances of specified free variable with the argument.
// Any bound variables within the term should stay constant, and
// the bound variable can be determined by incrementing the cutoff every time
// we visit an abstraction.
export const replace = (
  term: LCTerm,
  variable: number,
  argument: LCTerm
): LCTerm => {
  switch (term.type) {
    case "variable":
      if (term.variable === variable) {
        return shift(argument, variable);
      } else {
        return term;
      }
    case "abstraction":
      return {
        type: "abstraction",
        variableName: term.variableName,
        body: replace(term.body, variable + 1, argument),
      };
    case "application":
      return {
        type: "application",
        function: replace(term.function, variable, argument),
        argument: replace(term.argument, variable, argument),
      };
  }
};

export const evaluate1 = (term: LCTerm): LCTerm => {
  if (term.type === "application" && term.function.type !== "abstraction") {
    return {
      type: "application",
      function: evaluate1(term.function),
      argument: term.argument,
    };
  }
  if (term.type === "application" && term.function.type === "abstraction") {
    return shift(replace(term.function.body, 0, shift(term.argument, 1)), -1);
  }
  throw new Error("No rule applies");
};
