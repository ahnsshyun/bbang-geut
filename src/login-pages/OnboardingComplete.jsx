import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { PromptBox, NoticeBox } from "../components/Box";
import Button from "../components/Button";

import { getSurgeryInfo } from "../api/onboarding";

const SERVICE_NAME = "나란히";

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
  const [procedureLabel, setProcedureLabel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // /onboarding/complete 응답(POST 결과) — OnboardingPersonal에서 저장해둔 값
  const result = readJSON("naranhi_onboarding_result");

  useEffect(() => {
    let cancelled = false;

    // TODO: 라벨 텍스트("시술")로 찾는 임시 방식. /onboarding/complete 응답에
    // procedure 같은 필드가 직접 오면 이 호출은 제거 가능.
    getSurgeryInfo()
      .then((data) => {
        if (cancelled) return;
        const procedureRow = data.rows.find((r) => r.label === "시술");
        setProcedureLabel(procedureRow ? procedureRow.value : null);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStart = () => {
    navigate("/home");
  };

  // 온보딩 완료 API를 안 거치고 이 화면에 바로 들어온 경우(새로고침, 직접 접근 등)
  if (!result) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            title="케어 루틴 정보를 찾을 수 없어요"
            desc="이전 단계부터 다시 진행해 주세요"
          />
          <Spacer />
          <Button type="button" onClick={() => navigate("/onboarding/personal")}>
            이전 단계로
          </Button>
        </Content>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme title="정보를 불러오고 있어요" />
        </Content>
      </Layout>
    );
  }

  const { summary } = result;

  // TODO: medication_period가 null로 오는 케이스가 있음(예시 응답 기준) —
  // 처방 미등록 상태였을 때로 추정되나 백엔드와 조건 확인 필요.
  const SUMMARY_ROWS = [
    { label: "자가 케어 루틴", value: `${summary.routine_count}종` },
    { label: "가능 / 주의 / 금지 항목", value: `${summary.rule_count}개` },
    { label: "금기 해제", value: `${summary.unlock_event_count}건` },
    { label: "내원 예약", value: `${summary.visit_count}건` },
    {
      label: "처방약 복약 기간",
      value: summary.medication_period !== null ? `${summary.medication_period}일` : "-",
    },
    { label: "귀국일", value: formatDot(summary.return_date) },
  ];

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

        <PromptBox title={procedureLabel ?? ""}>
          {SUMMARY_ROWS.map((row) => (
            <SummaryRow key={row.label}>
              <SummaryLabel>{row.label}</SummaryLabel>
              <SummaryValue>{row.value}</SummaryValue>
            </SummaryRow>
          ))}
        </PromptBox>

        <Spacer />
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