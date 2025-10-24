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
  lambdaCalculus:
    "(lambda t. lambda f. t) (lambda s. lambda z. s z) (lambda s. lambda z. z)",
};

function App() {
  const monaco = useMonaco();

  const [rawTerms, setRawTerms] = React.useState<Record<Language, string>>({
    lambdaCalculus: "",
    arith: "",
  });
  const [language, setLanguage] = React.useState<Language>("arith");

  React.useEffect(() => {
    monaco.setValue(rawTerms[language] || SAMPLE_PROGRAMS[language]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, monaco.setValue]);

  return (
    <Provider>
      <Container>
        <Header language={language} setLanguage={setLanguage} />
        <ContentContainer>
          <Editor
            monaco={monaco}
            onEvaluate={(content: string) =>
              setRawTerms((prev) => ({ ...prev, [language]: content }))
            }
          />
          <Evaluation
            rawTerm={rawTerms[language]}
            language={language}
            key={language}
          />
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
