import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";

const SERVICE_NAME = "나란히";
const PROCEDURE_LABEL = "코성형 (융비술)";

// TODO(백엔드 연동 시 제거): 병원 프로토콜 + 개인 변수로 실제 계산해야 하는 값들.
// 지금은 명세서 3.4 예시 케이스 숫자를 그대로 사용한 목업입니다.
const ROUTINE_COUNT = 7;
const RULE_COUNT = 10;
const UNLOCK_VISIT_COUNT = 12;

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDot(dateLike) {
  const date = new Date(dateLike);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

const OnboardingComplete = () => {
  const navigate = useNavigate();

  const personal = readJSON("naranhi_personal");
  const prescriptionSummary = readJSON("naranhi_prescription_summary");

  const returnDateLabel = personal?.returnDate
    ? formatDot(personal.returnDate)
    : "-";

  // "총 6일" → 복약 기간 표기는 시작일(D+0) 기준 마지막 날까지의 일수(총일수-1)
  const medicationDays = prescriptionSummary
    ? Math.max(parseInt(prescriptionSummary.totalDays, 10) - 1, 0)
    : null;

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <Layout>
      <Content>
        <StatusBadge>완료</StatusBadge>

        <Title>
          120일간의 케어 루틴이
          <br />
          만들어졌어요
        </Title>

        <Desc>
          {PROCEDURE_LABEL} 기준으로 {SERVICE_NAME}가 미리 만들어 둔 회복
          프로토콜에, 방금 확인한 개인 변수를 적용했어요
        </Desc>

        <SummaryCard>
          <SummaryHeader>
            {PROCEDURE_LABEL} · 수술일 기준 D+0 → D+120
          </SummaryHeader>

          <SummaryRow>
            <span>자가 케어 루틴</span>
            <b>{ROUTINE_COUNT}종</b>
          </SummaryRow>
          <SummaryRow>
            <span>가능 / 주의 / 금지 항목</span>
            <b>{RULE_COUNT}개</b>
          </SummaryRow>
          <SummaryRow>
            <span>금기 해제 / 내원 예약</span>
            <b>{UNLOCK_VISIT_COUNT}건</b>
          </SummaryRow>
          <SummaryRow>
            <span>처방약 복약 기간</span>
            <b>{medicationDays !== null ? `${medicationDays}일` : "-"}</b>
          </SummaryRow>
          <SummaryRow>
            <span>귀국일</span>
            <b>{returnDateLabel}</b>
          </SummaryRow>
        </SummaryCard>

        <FootNote>
          각 항목에는 병원 안내문 원문이 그대로 붙어 있습니다. {SERVICE_NAME}
          은 원문을 바꾸지 않습니다.
        </FootNote>

        <Spacer />

        <StartButton type="button" onClick={handleStart}>
          오늘의 회복 시작하기
        </StartButton>
      </Content>
    </Layout>
  );
};

export default OnboardingComplete;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  text-align: left;
`;

const StatusBadge = styled.p`
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

const SummaryCard = styled.div`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.primaryLight};
`;

const SummaryHeader = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primaryHover};
  margin: 0 0 16px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;

  span {
    color: ${({ theme }) => theme.colors.textBody};
  }

  b {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 800;
  }
`;

const FootNote = styled.p`
  margin-top: 20px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 11px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 24px;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  cursor: pointer;
`;