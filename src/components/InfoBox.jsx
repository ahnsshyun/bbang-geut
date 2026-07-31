import styled from 'styled-components';

const Box = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.button};
  box-shadow: 0 1px 4px rgba(80, 130, 180, 0.06);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    color: ${({ theme }) => theme.colors.textLight};
  }

  b {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
  }
`;

export { Box, Row };
