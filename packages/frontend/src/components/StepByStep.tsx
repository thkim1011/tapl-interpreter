import { evaluate1, isValue, type Term, print } from "arith";
import React from "react";
import styled from "styled-components";
import { Button } from "../design-system/Button";

interface StepByStepProps {
  term: Term;
}

export const StepByStep: React.FC<StepByStepProps> = ({ term }) => {
  // Cache every step of the evaluation.
  const steps = React.useMemo(() => {
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
  }, [term]);

  const [currentStep, setCurrentStep] = React.useState(steps.length - 1);

  return (
    <div>
      <Toolbar>
        <Button
          emphasis="medium"
          onClick={() => setCurrentStep((i) => i - 1)}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          emphasis="medium"
          onClick={() => setCurrentStep((i) => i + 1)}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </Toolbar>
      {print(steps[currentStep])}
    </div>
  );
};

const Toolbar = styled.div`
  display: flex;
  border-bottom: 1px solid var(--gray-400);
`;
