import { IconButton } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

interface ToolbarProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps?: number;
}
export const Toolbar: React.FC<ToolbarProps> = ({
  currentStep,
  setCurrentStep,
  totalSteps,
}) => {
  return (
    <Container>
      <IconButton
        onClick={() => setCurrentStep((i) => i - 1)}
        disabled={!totalSteps || currentStep === 0}
        variant="surface"
        size="sm"
      >
        <FontAwesomeIcon size="sm" icon={faAngleLeft} />
      </IconButton>
      <IconButton
        onClick={() => setCurrentStep((i) => i + 1)}
        disabled={!totalSteps || currentStep === totalSteps - 1}
        variant="surface"
        size="sm"
      >
        <FontAwesomeIcon size="sm" icon={faAngleRight} />
      </IconButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;
