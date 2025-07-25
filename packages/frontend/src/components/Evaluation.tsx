import React from "react";
import styled from "styled-components";
import { parse, type Term } from "arith";
import { StepByStep } from "./StepByStep";

interface EvaluationProps {
  rawTerm: string | null;
}

export const Evaluation: React.FC<EvaluationProps> = ({ rawTerm }) => {
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

  return (
    <Container className="border-1 border-gray-400">
      {content.status === "success" && <StepByStep term={content.term} />}
      {content.status === "error" && content.message}
      {content.status === "idle" && "Press evaluate to get started"}
    </Container>
  );
};

const Container = styled.div`
  flex: 1 0 0;
`;
