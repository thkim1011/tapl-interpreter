import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";
import styled from "styled-components";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <Container className="border-b-1 border-b-gray-500">
      <h1 className="text-3xl">Interpreter</h1>
      <RightContainer>
        <select>
          <option value="arith">arith</option>
        </select>
        <button className="bg-sky-500 hover:bg-sky-700 rounded-full">
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
