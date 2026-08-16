import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";

const StepBadge = styled.p`
  ${font("semibody")}
  color: ${COLORS.main};
  margin: 0 0 8px;
`;

const Title = styled.h1`
  ${font("title")}
  color: #111111; 
  margin: 0;
`;

const Desc = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  margin: 10px 0 24px;
  white-space: pre-line;  // ← 이게 있어야 \n이 실제 줄바꿈으로 보임
`;

// step이 없으면 뱃지 생략(로그인 화면), desc가 없으면 설명 생략
const LoginTheme = ({ step, title, desc }) => (
  <>
    {step && <StepBadge>{step}</StepBadge>}
    <Title>{title}</Title>
    {desc && <Desc>{desc}</Desc>}
  </>
);

export default LoginTheme;