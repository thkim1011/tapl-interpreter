import styled from "styled-components";
import { Button } from "../design-system/Button";
import type { Monaco } from "../hooks/useMonaco";

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
      <div
        ref={monaco.setMonacoEl}
        style={{ width: "100%", height: "100%" }}
      ></div>
      <ButtonContainer>
        <Button emphasis="high" onClick={handleEvaluate}>
          Evaluate
        </Button>
      </ButtonContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1 0 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;
