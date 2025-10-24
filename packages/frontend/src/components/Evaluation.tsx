import React from "react";
import styled from "styled-components";
import { Toolbar } from "./evaluation/Toolbar";
import type { Language } from "../types";
import { useLanguage, type LanguageTermRecord } from "../hooks/useLanguage";

interface EvaluationProps<L extends Language> {
  rawTerm: string | null;
  language: L;
}

export const Evaluation = <L extends Language>({
  rawTerm,
  language,
}: EvaluationProps<L>) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { evaluate1, isValue, parse, print } = useLanguage(language);
  const content = React.useMemo<
    | { status: "success"; term: LanguageTermRecord[L] }
    | { status: "error"; message: string }
    | { status: "idle" }
  >(() => {
    try {
      if (rawTerm) {
        const term = parse(rawTerm);
        return { status: "success", term };
      } else {
        return { status: "idle" };
      }
    } catch (e) {
      if (e instanceof Error) {
        return { status: "error", message: `${e.message}\n${e.stack}` };
      }
      return { status: "error", message: "unknown" };
    }
  }, [parse, rawTerm]);

  // Cache every step of the evaluation.
  const steps = React.useMemo(() => {
    if (content.status !== "success") {
      return null;
    }
    const { term } = content;
    const steps = [term];
    let tempTerm = term;
    try {
      while (!isValue(term)) {
        tempTerm = evaluate1(tempTerm);
        steps.push(tempTerm);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* empty */
    }

    return steps;
  }, [content]);

  return (
    <Container>
      <Toolbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        totalSteps={steps?.length}
      />
      {content.status === "success" && print(steps![currentStep])}
      {content.status === "error" && content.message}
      {content.status === "idle" && "Press evaluate to get started"}
    </Container>
  );
};

const Container = styled.div`
  flex: 1 0 0;
  border: 1px solid var(--chakra-colors-border);
  border-radius: var(--chakra-radii-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
