import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import LoginTheme from "./LoginTheme";
import { CloseButton } from "./Button";

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ProgressTrack = styled.div`
  display: flex;
  gap: 4px;
  margin: 20px 0;
`;

const ProgressSegment = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 2px;
  background: ${({ $filled }) => ($filled ? COLORS.main : COLORS.background_lightpurple)};
`;

/**
 * props:
 * - title: 헤더 제목 (예: "D+4 · 오늘 체크인")
 * - date: 날짜 (예: "2026.08.07")
 * - onClose: 닫기 버튼 클릭 핸들러
 * - totalSteps: 전체 진행 단계 수 (예: 2)
 * - currentStep: 현재까지 채워진 단계 수 (1부터 시작, 예: 1이면 1칸만 채워짐)
 */
const CheckinTheme = ({ title, date, onClose, totalSteps = 1, currentStep = 1 }) => {
  return (
    <>
      <HeaderRow>
        <div>
          <LoginTheme step={date} title={title}/>
        </div>
        <CloseButton type="button" onClick={onClose} aria-label="닫기">
          ✕
        </CloseButton>
      </HeaderRow>

      <ProgressTrack>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <ProgressSegment key={i} $filled={i < currentStep} />
        ))}
      </ProgressTrack>
    </>
  );
};

export default CheckinTheme;