import styled from 'styled-components';

const Layout = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Layout;

const Wrapper = styled.div`
  width: 346px;
  min-height: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 14px 63px 14px;  /* 상 64, 우 28, 하 63, 좌 28 */
  margin: 0 auto;
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