import { evaluate1, isValue, parse, print, type Term } from "arith";
import {
  evaluate1LC,
  parseLC,
  printLC,
  type LCTerm,
  isValueLC,
} from "lambda-calculus";
import type { Language } from "../types";
import React from "react";

interface BaseLanguageTools<T> {
  parse: (input: string) => T;
  evaluate1: (term: T) => T;
  print: (term: T) => string;
  isValue: (term: T) => boolean;
}

export interface LanguageTermRecord {
  arith: Term;
  lambdaCalculus: LCTerm;
}

type LanguageToolsV2<L extends Language> = { language: L } & BaseLanguageTools<
  LanguageTermRecord[L]
>;

type LanguageTools =
  | ({
      language: "arith";
    } & BaseLanguageTools<Term>)
  | ({
      language: "lambdaCalculus";
    } & BaseLanguageTools<LCTerm>);

const LANGUAGE_TOOLS: LanguageTools[] = [
  {
    language: "arith",
    parse,
    evaluate1,
    print,
    isValue,
  },
  {
    language: "lambdaCalculus",
    parse: parseLC,
    evaluate1: evaluate1LC,
    print: printLC,
    isValue: isValueLC,
  },
];

export const useLanguage = <L extends Language>(language: L) => {
  return React.useMemo(
    () =>
      LANGUAGE_TOOLS.find(
        (tools) => tools.language === language
      )! as unknown as LanguageToolsV2<L>,
    [language]
  );
};
