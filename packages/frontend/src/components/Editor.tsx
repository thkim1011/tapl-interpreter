import styled from "styled-components";
import type { Monaco } from "../hooks/useMonaco";
import { Button } from "@chakra-ui/react";

interface EditorProps {
  monaco: Monaco;
  onEvaluate: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ monaco, onEvaluate }) => {
  const handleEvaluate = () => {
    onEvaluate(monaco.getEditorContent());
  };
  return (
    <Container>
      <ButtonContainer>
        <Button size="sm" onClick={handleEvaluate}>
          Evaluate
        </Button>
      </ButtonContainer>
      <div
        ref={monaco.setMonacoEl}
        style={{ width: "100%", height: "100%" }}
      ></div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1 1 0;
  min-width: 0;
  border: 1px solid var(--chakra-colors-border);
  border-radius: var(--chakra-radii-md);
  padding: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
`;
