import styled from "styled-components";
import { Header } from "./components/Header";
import { Editor } from "./components/Editor";
import { Evaluation } from "./components/Evaluation";
import { useMonaco } from "./hooks/useMonaco";
import React from "react";

function App() {
  const monaco = useMonaco();

  const [rawTerm, setRawTerm] = React.useState<string | null>(null);

  return (
    <Container>
      <Header />
      <ContentContainer>
        <Editor monaco={monaco} onEvaluate={setRawTerm} />
        <Evaluation rawTerm={rawTerm} />
      </ContentContainer>
    </Container>
  );
}

const ContentContainer = styled.div`
  padding: 32px;
  display: flex;
  gap: 32px;
  flex-grow: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export default App;
