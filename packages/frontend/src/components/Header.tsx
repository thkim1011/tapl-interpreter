import {
  createListCollection,
  Heading,
  IconButton,
  Portal,
  Select,
} from "@chakra-ui/react";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import styled from "styled-components";

const LANGUAGES = createListCollection({
  items: [
    { label: "Arithmetic Expressions", value: "arith" as Language },
    { label: "Lambda Calculus", value: "lambdaCalculus" as Language },
  ],
});

type Language = "arith" | "lambdaCalculus";

interface HeaderProps {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<"arith" | "lambdaCalculus">>;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  return (
    <Container>
      <Heading size="4xl">Interpreter</Heading>
      <RightContainer>
        <Select.Root<{ value: Language; label: string }>
          collection={LANGUAGES}
          width="250px"
          value={[language]}
          onValueChange={(e) => setLanguage(e.items[0].value)}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select framework" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {LANGUAGES.items.map((lang) => (
                  <Select.Item item={lang} key={lang.value}>
                    {lang.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <IconButton size="sm" variant="surface">
          <FontAwesomeIcon icon={faCircleQuestion} />
        </IconButton>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 32px;
  border: 1px solid var(--chakra-colors-border);
`;

const RightContainer = styled.div`
  display: flex;
  gap: 12px;
`;
