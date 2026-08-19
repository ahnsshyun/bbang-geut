import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { PromptBox, NoticeBox } from "../components/Box/Box";
import Button from "../components/Button";
import { useLang } from "../hooks/useLang";

import { getSurgeryInfo } from "../api/onboarding";
import { getStoredPatient } from "../api/auth";

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
  const { t } = useLang();
  const [procedureLabel, setProcedureLabel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const result = readJSON("naranhi_onboarding_result");

  useEffect(() => {
    let cancelled = false;

    // TODO: 라벨 텍스트("시술")로 찾는 임시 방식. /onboarding/complete 응답에
    // procedure 같은 필드가 직접 오면 이 호출은 제거 가능.
    const patient = getStoredPatient();
    const lang = patient?.lang || "ko";

    getSurgeryInfo({ lang })
      .then((data) => {
        if (cancelled) return;
        const procedureRow = data.rows.find((r) => r.key === "procedure_type");
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

  if (!result) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            title={t("routineNotFound")}
            desc={t("retryFromStart")}
          />
          <Spacer />
          <Button type="button" onClick={() => navigate("/onboarding/personal")}>
            {t("prevStep")}
          </Button>
        </Content>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme title={t("loadingInfo")} />
        </Content>
      </Layout>
    );
  }

  const { summary } = result;

  // TODO: medication_period가 null로 오는 케이스가 있음(예시 응답 기준) —
  // 처방 미등록 상태였을 때로 추정되나 백엔드와 조건 확인 필요.
  const SUMMARY_ROWS = [
    { label: t("summaryRoutineCount"), value: `${summary.routine_count}${t("summaryUnit")}` },
    { label: t("summaryRuleCount"), value: `${summary.rule_count}${t("summaryCountUnit")}` },
    { label: t("summaryUnlockEvent"), value: `${summary.unlock_event_count}${t("summaryCaseUnit")}` },
    { label: t("summaryVisitCount"), value: `${summary.visit_count}${t("summaryCaseUnit")}` },
    {
      label: t("summaryMedicationPeriod"),
      value: summary.medication_period !== null ? `${summary.medication_period}${t("summaryDayUnit")}` : "-",
    },
    { label: t("summaryReturnDate"), value: formatDot(summary.return_date) },
  ];

  return (
    <Layout>
      <Content>
        <LoginTheme
          title={
            <>
              {t("completeTitleLine1")}
              <br />
              {t("completeTitleLine2")}
            </>
          }
          desc={`${SERVICE_NAME}${t("completeDesc")}`}
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
          {t("afterCareNotice")}
        </NoticeBox>

        <Spacer />
        <Button type="button" onClick={handleStart}>
          {SERVICE_NAME} {t("startRoutine")}
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