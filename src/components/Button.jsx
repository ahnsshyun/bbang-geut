import styled from 'styled-components';

const Button = ({ children, onClick, disabled }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button`
  font-weight: 700;
  font-size: 15px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.button};
  border: none;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: 0 6px 16px rgba(111, 184, 234, 0.35);
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;