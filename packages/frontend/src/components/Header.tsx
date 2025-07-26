import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import styled from "styled-components";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <Container>
      <h1>Interpreter</h1>
      <RightContainer>
        <select>
          <option value="arith">arith</option>
        </select>
        <button>
          <FontAwesomeIcon icon={faCircleQuestion} color="white" />
        </button>
      </RightContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 32px;
`;

const RightContainer = styled.div`
  display: flex;
  gap: 12px;
`;
