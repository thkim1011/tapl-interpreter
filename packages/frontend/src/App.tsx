import styled from "styled-components";
import { Header } from "./components/Header";
import { Editor } from "./components/Editor";
import { Evaluation } from "./components/Evaluation";
import { useMonaco } from "./hooks/useMonaco";
import React from "react";
import { Provider } from "./components/ui/provider";
import type { Language } from "./types";

const SAMPLE_PROGRAMS: Record<Language, string> = {
  arith: "if iszero zero then true else false",
  lambdaCalculus: "",
};

function App() {
  const monaco = useMonaco();

  const [rawTerm, setRawTerm] = React.useState<string | null>(null);
  const [language, setLanguage] = React.useState<Language>("arith");

  React.useEffect(() => {
    monaco.setValue(SAMPLE_PROGRAMS[language]);
  }, [language, monaco]);

  return (
    <Provider>
      <Container>
        <Header language={language} setLanguage={setLanguage} />
        <ContentContainer>
          <Editor monaco={monaco} onEvaluate={setRawTerm} />
          <Evaluation rawTerm={rawTerm} />
        </ContentContainer>
      </Container>
    </Provider>
  );
}

const ContentContainer = styled.div`
  padding: 16px 32px 16px 32px;
  display: flex;
  gap: 16px;
  flex-grow: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export default App;
