import styled from 'styled-components';

const Title = ({ children }) => {
  return <StyledTitle>{children}</StyledTitle>;
};

export default Title;

const StyledTitle = styled.div`
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 28px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.family};
  line-height: normal;
`;