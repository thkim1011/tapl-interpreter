import React from "react";
import styled from "styled-components";
import { evaluate1, isValue, parse, print, type Term } from "arith";
import { Toolbar } from "./evaluation/Toolbar";

interface EvaluationProps {
  rawTerm: string | null;
}

export const Evaluation: React.FC<EvaluationProps> = ({ rawTerm }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const content = React.useMemo<
    | { status: "success"; term: Term }
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
        return { status: "error", message: e.message };
      }
      return { status: "error", message: "unknown" };
    }
  }, [rawTerm]);

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
