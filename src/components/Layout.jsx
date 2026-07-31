import styled from 'styled-components';

const Layout = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Layout;

const Wrapper = styled.div`
  width: 360px;
  min-height: 640px;        /* 페이지마다 내용 길이 달라도 높이 고정*/
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 28px;
  border: none;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(80, 130, 180, 0.14);
  padding: 44px 36px 36px;
  margin: 0 auto;            /* 화면 중앙 정렬 */

`;