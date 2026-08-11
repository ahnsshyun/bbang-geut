import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";
import Calendar from "../components/Calendar";

// TODO(백엔드 연동 시 제거): 예시 케이스 기준 고정 수술일
// 실제 구현 시 수술기록 파싱값(OnboardingCheck에서 확인한 값)을 그대로 이어받아야 함
const SURGERY_DATE = new Date(2026, 7, 3); // 2026-08-03

// TODO: 실제 "비행 규칙" 구간 기준(명세서 3.4 귀국 예정일 항목)이 확정되면 아래 경계값 교체
// 지금은 디자인 예시(D+11 → 주의)에 맞춘 추정값입니다.
function getFlightZone(dn) {
  if (dn === null) return null;
  if (dn <= 6) return { label: "금지", token: "danger" };
  if (dn <= 13) return { label: "주의", token: "warning" };
  return { label: "가능", token: "success" };
}

function diffDaysFromSurgery(date) {
  const ms = date.setHours(0, 0, 0, 0) - new Date(SURGERY_DATE).setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatDot(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function formatSlash(date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const y = date.getFullYear();
  return `${m} / ${d} / ${y}`;
}

const OnboardingPersonal = () => {
  const navigate = useNavigate();

  const [hasPacking, setHasPacking] = useState(null); // true | false | null
  const [hasAlarReduction, setHasAlarReduction] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const returnDN = useMemo(
    () => (returnDate ? diffDaysFromSurgery(new Date(returnDate)) : null),
    [returnDate]
  );

  const flightZone = getFlightZone(returnDN);

  const isComplete =
    hasPacking !== null && hasAlarReduction !== null && returnDate !== null;

  const handleSelectDate = (date) => {
    setReturnDate(date);
    setIsCalendarOpen(false);
  };

  const handleCreateRoutine = () => {
    if (!isComplete) return;

    // TODO: 백엔드 API 연동
    // - 개인 변수 저장 API 호출로 교체
    // - 아래 localStorage는 백엔드/전역 상태 없이 다음 화면(완료)으로 값 전달용 임시 처리
    localStorage.setItem(
      "naranhi_personal",
      JSON.stringify({
        hasPacking,
        hasAlarReduction,
        returnDate: returnDate.toISOString(),
        returnDN,
      })
    );

    navigate("/onboarding/complete");
  };

  return (
    <Layout>
      <Content>
        <StepBadge>STEP 3/3 · 개인 변수</StepBadge>
        <Title>3가지만 확인할게요</Title>
        <Desc>
          병원 안내문에 '~인 경우'로 표기된 항목들이에요. 문서만으로는 알 수
          없어 직접 여쭤봐요.
        </Desc>

        <QuestionCard>
          <QuestionTitle>코 안에 흰 솜(패킹)이 들어 있나요?</QuestionTitle>
          <QuestionHint>있다면 제거 일정이 루틴에 포함됩니다.</QuestionHint>
          <ToggleRow>
            <ToggleButton
              type="button"
              $active={hasPacking === true}
              onClick={() => setHasPacking(true)}
            >
              예
            </ToggleButton>
            <ToggleButton
              type="button"
              $active={hasPacking === false}
              onClick={() => setHasPacking(false)}
            >
              아니오
            </ToggleButton>
          </ToggleRow>
        </QuestionCard>

        <QuestionCard>
          <QuestionTitle>콧볼 축소를 함께 하셨나요?</QuestionTitle>
          <QuestionHint>있다면 제거 일정이 루틴에 포함됩니다.</QuestionHint>
          <ToggleRow>
            <ToggleButton
              type="button"
              $active={hasAlarReduction === true}
              onClick={() => setHasAlarReduction(true)}
            >
              예
            </ToggleButton>
            <ToggleButton
              type="button"
              $active={hasAlarReduction === false}
              onClick={() => setHasAlarReduction(false)}
            >
              아니오
            </ToggleButton>
          </ToggleRow>
        </QuestionCard>

        <QuestionCard style={{ position: "relative" }}>
          <QuestionTitle>귀국 예정일을 입력해주세요</QuestionTitle>
          <QuestionHint>
            항공권에 적힌 날짜 그대로 넣어주세요. 이 날짜로 비행 안전성, 귀국
            후 루틴 전환 시점, 남은 일수 (D-N)를 계산합니다.
          </QuestionHint>

          <DateRow>
            <DateField
              type="button"
              onClick={() => setIsCalendarOpen((prev) => !prev)}
            >
              <span>{returnDate ? formatSlash(new Date(returnDate)) : "MM / DD / YYYY"}</span>
              <span role="img" aria-label="달력">
                📆
              </span>
            </DateField>
            {returnDN !== null && <DnBadge>D + {returnDN}</DnBadge>}
          </DateRow>

          {isCalendarOpen && (
            <CalendarPopover>
              <Calendar
                selectedDate={returnDate}
                onSelect={handleSelectDate}
                minDate={SURGERY_DATE}
              />
            </CalendarPopover>
          )}

          {returnDate && flightZone && (
            <DateHint>
              수술일 {formatDot(SURGERY_DATE)} 기준{" "}
              <b>{formatDot(new Date(returnDate))}</b> · D+{returnDN} 귀국으로
              저장됩니다. 귀국일이 비행{" "}
              <ZoneLabel $token={flightZone.token}>{flightZone.label}</ZoneLabel>{" "}
              구간에 들어갑니다.
            </DateHint>
          )}
        </QuestionCard>

        <Spacer />

        <CreateButton
          type="button"
          disabled={!isComplete}
          onClick={handleCreateRoutine}
        >
          케어 루틴 만들기
        </CreateButton>
      </Content>
    </Layout>
  );
};

export default OnboardingPersonal;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  text-align: left;
`;

const StepBadge = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 10px 0 24px;
`;

const QuestionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: 20px;
  margin-bottom: 20px;
`;

const QuestionTitle = styled.p`
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 6px;
`;

const QuestionHint = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 0 16px;
`;

const ToggleRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 14px 0;
  font-size: 14px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.button};
  border: 1.5px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primaryLight : "#ffffff"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primaryHover : theme.colors.text};
  cursor: pointer;
`;

const DateRow = styled.div`
  display: flex;
  gap: 10px;
`;

const DateField = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 14px;
  border-radius: ${({ theme }) => theme.radius.button};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #ffffff;
  cursor: pointer;
  text-align: left;
`;

const DnBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.radius.button};
  white-space: nowrap;
`;

const CalendarPopover = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 20;
  margin-top: 8px;
  background: #ffffff;
  border-radius: ${({ theme }) => theme.radius.card};
  box-shadow: 0 12px 32px rgba(80, 130, 180, 0.2);
`;

const DateHint = styled.p`
  font-size: 11px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 14px 0 0;
`;

const ZoneLabel = styled.span`
  font-weight: 700;
  color: ${({ theme, $token }) => theme.colors[$token]};
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 12px;
`;

const CreateButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textLight};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  cursor: not-allowed;

  &:not(:disabled) {
    color: #ffffff;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;