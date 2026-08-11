import { createGlobalStyle } from "styled-components";

// 색상값은 임의 지정이 아니라 실제 디자인 이미지에서 픽셀 샘플링으로 추출한 값입니다.
// 새 화면을 만들 때 이 파일의 토큰만 참조하고, 컴포넌트 안에 hex 값을 새로 넣지 마세요.
export const theme = {
  colors: {
    primary: "#705BEF", // 로그인 버튼 / 스플래시 그라디언트 시작색
    primaryHover: "#5A46D9", // 파생값(직접 샘플링한 hover 상태 없음) — 실제 hover 디자인 오면 교체
    primaryLight: "#F1EFFD", // 안내 카드 · 배너 배경
    gradientStart: "#705BEF",
    gradientEnd: "#B262E1", // 스플래시 하단 색

    success: "#00A356", // "받음" 등 완료 상태
    successBg: "#ECFBF3", // 처방 등록 완료 강조 배경
    danger: "#FF5B5B", // 에러 상태 — 아직 에러 디자인 이미지 없어 추정값, 확정 이미지 오면 교체
    warning: "#FF4040", // 비행 구간 "주의" 강조 텍스트

    // 처방전 촬영/결과 화면(3.3)에서 추출
    placeholderBg: "#D9D9D9", // 카메라 프레임 자리표시자
    primarySoft: "#D5CEFB", // 셔터 버튼 글로우
    categoryOrange: { bg: "#FDF1E0", text: "#D19C00" }, // 항생제 태그
    categoryBlue: { bg: "#EAF1FC", text: "#5C85D2" }, // 지혈·부기 태그
    warnBg: "#FFFCF3", // 필요시 약 카드 배경

    text: "#000000", // 제목
    textBody: "#202020", // 본문
    textLight: "#686868", // 설명 · 힌트
    white: "#FFFFFF",

    border: "#D9D9D9",
    surfaceMuted: "#F3F3F3", // 도움말 박스 등
  },
  radius: {
    card: "16px",
    button: "16px",
    badge: "10px",
  },
  font: {
    base: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
  },
};

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    background: #efeff3;
    font-family: ${({ theme }) => theme.font.base};
    color: ${({ theme }) => theme.colors.textBody};
  }

  button {
    font-family: inherit;
  }
`;