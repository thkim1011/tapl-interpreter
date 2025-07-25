import { Term } from "./ast";

const isNumericValue = (t: Term) => {
  if (t.type === "zero") return true;
  if (t.type === "succ") return isNumericValue(t.term);
  return false;
};

export const isValue = (t: Term) => {
  if (t.type === "true" || t.type === "false") return true;
  if (isNumericValue(t)) return true;
  return false;
};

export const evaluate1 = (term: Term): Term => {
  if (term.type === "if") {
    const { term1, term2, term3 } = term;
    if (term1.type === "true") {
      return term2;
    } else if (term1.type === "false") {
      return term3;
    }
    return { type: "if", term1: evaluate1(term1), term2, term3 };
  } else if (term.type === "succ") {
    return { type: "succ", term: evaluate1(term.term) };
  } else if (term.type === "pred") {
    if (term.term.type === "zero") {
      return { type: "zero" };
    } else if (term.term.type === "succ" && isNumericValue(term.term.term)) {
      return term.term.term;
    } else {
      return { type: "pred", term: evaluate1(term.term) };
    }
  } else if (term.type === "iszero") {
    if (term.term.type === "zero") {
      return { type: "true" };
    } else if (term.term.type === "succ" && isNumericValue(term.term.term)) {
      return { type: "false" };
    } else {
      return { type: "iszero", term: evaluate1(term.term) };
    }
  } else {
    throw new Error("No rule applies");
  }
};

export const evaluate = (term: Term): Term => {
  try {
    while (!isValue(term))
      // Keep evaluating until we reach a value
      term = evaluate1(term);
  } catch (error) {}
  return term;
};
