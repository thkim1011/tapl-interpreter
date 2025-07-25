import styled, { css } from "styled-components";
import type { Emphasis } from "./types";

interface ButtonProps {
  children: React.ReactNode;
  emphasis: Emphasis;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  emphasis,
  onClick,
  disabled,
}) => {
  return (
    <StyledButton $emphasis={emphasis} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ $emphasis: Emphasis }>`
  ${(p) =>
    p.$emphasis === "high"
      ? css`
          background-color: var(--color-sky-400);
          padding: 6px;
          border-radius: 12px;

          &:hover {
            background-color: var(--color-sky-500);
          }
        `
      : css``}
`;
