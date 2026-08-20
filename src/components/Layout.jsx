import styled from 'styled-components';

const Layout = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Layout;

const Wrapper = styled.div`
  max-width: 480px;
  width: 100%;  
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 20px 63px 20px;  
  box-sizing: border-box;         /* padding 포함해서 width 346px 고정 */
`;

// Layout(Wrapper) 안에서 콘텐츠 영역을 잡아주는 보조 컴포넌트.
export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  text-align: left;
`;

export const Spacer = styled.div`
  flex: 1;
  min-height: 24px;
`;