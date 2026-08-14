import styled, { keyframes } from 'styled-components';
import COLORS from '../styles/colors';
import FONTS, { font } from '../styles/fonts';

/* ============================================================
   Button — 메인 액션 버튼 (채워진 보라 배경)
============================================================ */
const MainButton = ({ children, onClick, disabled, type = 'button' }) => {
  return (
    <MainButtonEl type={type} onClick={onClick} disabled={disabled}>
      {children}
    </MainButtonEl>
  );
};

export default MainButton;

const MainButtonEl = styled.button`
  width: 100%;
  box-sizing: border-box;
  height: 50px;

  ${font("boldbody")}
  color: #ffffff;

  background: ${(props) => (props.disabled ? '#D9D9D9' : COLORS.main)};
  border: none;
  border-radius: 11px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  margin: 10px 10px 0px 0px;
`;

/* ============================================================
   SubButton — 보조 액션 버튼 (흰 배경 + 보라 테두리)
============================================================ */
export const SubButton = ({ children, onClick, type = 'button' }) => {
  return (
    <SubButtonEl type={type} onClick={onClick}>
      {children}
    </SubButtonEl>
  );
};

const SubButtonEl = styled.button`
  width: 100%;
  box-sizing: border-box;
  height: 50px;

  ${font("semibody")}
  background: #ffffff;
  color: ${COLORS.main};
  border: 1px solid ${COLORS.main};
  border-radius: 11px;
  cursor: pointer;
  margin: 10px 10px 0px 0px;
`;

/* ============================================================
   ShutterButton — 원형 촬영 버튼 (glow 애니메이션 포함)
============================================================ */
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0 8px ${COLORS.point}55; }
  50% { box-shadow: 0 0 0 12px ${COLORS.point}88; }
`;

export const ShutterButton = ({ onClick, ariaLabel = '촬영' }) => {
  return <ShutterButtonEl type="button" onClick={onClick} aria-label={ariaLabel} />;
};

const ShutterButtonEl = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: ${COLORS.main};
  cursor: pointer;
  animation: ${glow} 1.8s ease-in-out infinite;
`;