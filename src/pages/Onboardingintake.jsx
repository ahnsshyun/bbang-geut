import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";

// TODO(백엔드 연동 시 제거): 병원 → 앱 자동 전송 자료 목업
// 실제 구현 시 로그인 성공 응답에 포함되거나 별도 자료 조회 API로 대체
const HOSPITAL_NAME = "서울 N성형외과의원";
const SERVICE_NAME = "나란히";

const RECEIVED_ITEMS = [
  { icon: "🧾", label: "수술기록 (PDF)" },
  { icon: "📄", label: "수술 후 주의사항 안내문" },
  { icon: "🗓️", label: "내원 예약 일정" },
];

function readPrescriptionSummary() {
  try {
    const raw = localStorage.getItem("naranhi_prescription_summary");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const OnboardingIntake = () => {
  const navigate = useNavigate();

  // 처방전 직접 등록 여부 · 요약 정보. PrescriptionCapture 화면에서 저장 완료 시 채워짐.
  // TODO(백엔드 연동 시 제거): 전역 상태/서버 세션이 없어 localStorage로 화면 간 값을 임시 전달
  const [isPrescriptionRegistered] = useState(
    () => localStorage.getItem("naranhi_prescription_registered") === "true"
  );
  const [summary] = useState(readPrescriptionSummary);

  const handleCapturePrescription = () => {
    navigate("/onboarding/prescription");
  };

  const handleNext = () => {
    if (!isPrescriptionRegistered) return;
    navigate("/onboarding/check");
  };

  const summaryLine = summary
    ? `${summary.firstDrugName} 외 ${summary.regularCount - 1}종 · 하루 ${summary.dailyFreq} · 총 ${summary.totalDays} 분${
        summary.prnCount ? ` · 필요시 ${summary.prnCount}종` : ""
      }`
    : "";

  // 정기 복용 시작일(D+0)~마지막 날(D+총일수-1) — PrescriptionCapture 저장값 기준으로 계산
  const totalDaysNumber = summary ? parseInt(summary.totalDays, 10) : null;
  const lastDayLabel =
    totalDaysNumber && totalDaysNumber > 0 ? `D+0 ~ D+${totalDaysNumber - 1}` : "";

  return (
    <Layout>
      <Content>
        <StepBadge>STEP 1/3 · 자료 수신</StepBadge>

        <Title>
          {HOSPITAL_NAME}에서
          <br />
          회복 자료를 받았습니다.
        </Title>

        <Desc>
          아래 정보는 서버에 저장되지 않고 이 기기 안에만 보관되며 병원에
          보낼 때만 전송됩니다.
        </Desc>

        <Card>
          {RECEIVED_ITEMS.map((item) => (
            <Row key={item.label}>
              <RowLeft>
                <Icon>{item.icon}</Icon>
                <RowLabel>{item.label}</RowLabel>
              </RowLeft>
              <StatusReceived>받음</StatusReceived>
            </Row>
          ))}

          <Row $highlight={isPrescriptionRegistered}>
            <RowLeft>
              <Icon>➕</Icon>
              <RowTextGroup>
                <RowLabel>
                  {isPrescriptionRegistered ? "처방정보" : "환자보관용 처방전"}
                </RowLabel>
                {isPrescriptionRegistered ? (
                  <RowSubLabelSuccess>{summaryLine}</RowSubLabelSuccess>
                ) : (
                  <RowSubLabel>
                    병원에서 전송되지 않아 직접 등록이 필요해요
                  </RowSubLabel>
                )}
              </RowTextGroup>
            </RowLeft>
            {isPrescriptionRegistered ? (
              <StatusReceived>등록됨</StatusReceived>
            ) : (
              <StatusAction>직접 등록</StatusAction>
            )}
          </Row>
        </Card>

        {isPrescriptionRegistered ? (
          <LockNoticeCard>
            🔒수술 기록에는 애프터 케어 지시가 들어있지 않습니다. {SERVICE_NAME}
            는 수술기록에서 <b>시술 종류와 개인 변수</b>(보형물 · 봉합 · 마취)만
            읽고, 실제 D+N 지시는 병원 안내문과 <b>처방 · 예약</b>에서
            가져옵니다.
          </LockNoticeCard>
        ) : (
          <PromptCard>
            <PromptTitle>처방전만 직접 등록하면 돼요</PromptTitle>
            <PromptDesc>
              제출용 처방전은 앱으로 보낼 수가 없어요. 받으신{" "}
              <b>환자보관용 처방전</b>을 촬영하면 다음 4가지 정보만 읽어 복약
              가이드로 만들어 드려요.
            </PromptDesc>
            <PromptHighlight>
              수집 정보: 약물명 · 1회 투여량 · 1일 투여 횟수 · 복용 기간
            </PromptHighlight>

            <CaptureButton type="button" onClick={handleCapturePrescription}>
              📷 처방전 촬영하기
            </CaptureButton>
          </PromptCard>
        )}

        <Spacer />

        {isPrescriptionRegistered && (
          <Toast>
            처방 정보가 등록되었어요 · 홈 화면에 하루 3회 복약 체크가{" "}
            {lastDayLabel}로 만들어져요
          </Toast>
        )}

        <NextButton
          type="button"
          disabled={!isPrescriptionRegistered}
          onClick={handleNext}
        >
          {isPrescriptionRegistered ? "케어 루틴 만들기" : "처방 정보를 먼저 등록해 주세요"}
        </NextButton>
      </Content>
    </Layout>
  );
};

export default OnboardingIntake;

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

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.successBg : "transparent"};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.span`
  font-size: 16px;
`;

const RowTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RowLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const RowSubLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const RowSubLabelSuccess = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.success};
`;

const StatusReceived = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
  flex-shrink: 0;
`;

const StatusAction = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const PromptCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.primaryLight};
`;

const PromptTitle = styled.p`
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primaryHover};
  margin: 0 0 10px;
`;

const PromptDesc = styled.p`
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const PromptHighlight = styled.p`
  font-size: 12px;
  font-weight: 700;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.primaryHover};
  margin: 0 0 16px;
`;

const CaptureButton = styled.button`
  width: 100%;
  padding: 14px 0;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 14px;
  cursor: pointer;
`;

const LockNoticeCard = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textBody};
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 24px;
`;

const Toast = styled.div`
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: #000000;
  color: #ffffff;
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const NextButton = styled.button`
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