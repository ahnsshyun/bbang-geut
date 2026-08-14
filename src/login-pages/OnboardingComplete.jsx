import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { PromptBox, NoticeBox } from "../components/Box";
import Button from "../components/Button";

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

  const SUMMARY_ROWS = [
    { label: "자가 케어 루틴", value: `${ROUTINE_COUNT}종` },
    { label: "가능 / 주의 / 금지 항목", value: `${RULE_COUNT}개` },
    { label: "금기 해제 / 내원 예약", value: `${UNLOCK_VISIT_COUNT}건` },
    { label: "처방약 복약 기간", value: medicationDays !== null ? `${medicationDays}일` : "-" },
    { label: "귀국일", value: returnDateLabel },
  ];

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <Layout>
      <Content>
        <LoginTheme
          title={
            <>
              120일간의 케어 루틴이
              <br />
              만들어졌어요
            </>
          }
          desc={`${SERVICE_NAME}의 회복 프로토콜에, 개인 변수를 적용했어요`}
        />

        <PromptBox title={`${PROCEDURE_LABEL}`}>
          {SUMMARY_ROWS.map((row) => (
            <SummaryRow key={row.label}>
              <SummaryLabel>{row.label}</SummaryLabel>
              <SummaryValue>{row.value}</SummaryValue>
            </SummaryRow>
          ))}
        </PromptBox>

        <Spacer/>

          <NoticeBox>
            애프터 케어 루틴은 각 항목에 병원 안내문 원문을 제공합니다.
          </NoticeBox>
        

        <Spacer />

        <Button type="button" onClick={handleStart}>
          {SERVICE_NAME} 회복 루틴 시작하기
        </Button>
      </Content>
    </Layout>
  );
};

export default OnboardingComplete;

/* ---------- styles ---------- */

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SummaryLabel = styled.span`
  ${font("semibody")}
  color: ${COLORS.text_gray};
`;

export const SummaryValue = styled.span`
  ${font("semibody")}
  color: ${COLORS.main};
`;