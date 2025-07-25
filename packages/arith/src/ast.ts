export type Term =
  | {
      type: "true" | "false" | "zero";
    }
  | {
      type: "succ" | "pred" | "iszero";
      term: Term;
    }
  | {
      type: "if";
      term1: Term;
      term2: Term;
      term3: Term;
    };

export const parse = (input: string): Term => {
  const tokens = input.trim().split(/\s+/);
  const stack: (Term["type"] | "term" | "else" | "then")[] = ["term"];
  const tree: Term["type"][] = [];

  while (stack.length) {
    const top = stack.pop();
    if (top === "term") {
      switch (tokens[0]) {
        case "true":
        case "false":
        case "zero":
          stack.push(tokens[0]);
          tree.push(tokens[0]);
          break;
        case "succ":
        case "pred":
        case "iszero":
          stack.push("term", tokens[0]);
          tree.push(tokens[0]);
          break;
        case "if":
          stack.push("term", "else", "term", "then", "term", "if");
          tree.push("if");
          break;
        default:
          throw new Error(`Unexpected token: ${tokens[0]}`);
      }
    } else {
      if (top !== tokens[0]) {
        throw new Error(`Unexpected token: ${tokens[0]}, expected: ${top}`);
      } else {
        tokens.shift(); // Remove the matched token
      }
    }
  }
  if (tokens.length > 0) {
    throw new Error(`Unexpected tokens remaining: ${tokens.join(", ")}`);
  }
  const nextTerm = (): Term => {
    const peek = tree[0];
    switch (peek) {
      case "true":
      case "false":
      case "zero":
        tree.shift(); // Remove the matched type
        return { type: peek };
      case "succ":
      case "pred":
      case "iszero":
        tree.shift(); // Remove the matched type
        return { type: peek, term: nextTerm() };
      case "if":
        tree.shift(); // Remove the matched type
        const term1 = nextTerm();
        const term2 = nextTerm();
        const term3 = nextTerm();
        return {
          type: "if",
          term1,
          term2,
          term3,
        };
      default:
        throw new Error(`Unexpected term type: ${tree[0]}`);
    }
  };
  return nextTerm();
};

export const print = (term: Term): string => {
  switch (term.type) {
    case "true":
    case "false":
    case "zero":
      return term.type;
    case "succ":
      return `succ ${print(term.term)}`;
    case "pred":
      return `pred ${print(term.term)}`;
    case "iszero":
      return `iszero ${print(term.term)}`;
    case "if":
      return `if ${print(term.term1)} then ${print(term.term2)} else ${print(term.term3)}`;
  }
};
