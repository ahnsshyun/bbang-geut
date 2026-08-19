import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import Button from "../components/Button";
import { InfoBox } from "../components/Box/Box";
import { useLang } from "../hooks/useLang";

import Calendar from "../components/Calendar";
import { getOnboardingQuestions, getSurgeryInfo, completeOnboarding } from "../api/onboarding";
import { ErrorBox } from "../components/Box/Box";

// TODO: colors.js에 danger/warning/success 색상이 없어 임시 매핑했습니다.
const ZONE_COLORS = {
  danger: COLORS.error,
  warning: COLORS.yellow,
  success: COLORS.text_green,
};

function diffDaysFromSurgery(date, surgeryDate) {
  const ms = date.setHours(0, 0, 0, 0) - new Date(surgeryDate).setHours(0, 0, 0, 0);
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

function formatISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const OnboardingPersonal = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  // TODO: 실제 "비행 규칙" 구간 기준(명세서 3.4 귀국 예정일 항목)이 API로 안 내려와서
  // 프론트에서 임시로 추정한 경계값입니다. 서버가 계산해서 내려주는 게 이상적이에요.
  function getFlightZone(dn) {
    if (dn === null) return null;
    if (dn <= 6) return { label: t("zoneDanger"), token: "danger" };
    if (dn <= 13) return { label: t("zoneWarning"), token: "warning" };
    return { label: t("zoneSuccess"), token: "success" };
  }

  const [questions, setQuestions] = useState(null);
  const [returnDateRange, setReturnDateRange] = useState(null);
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState({});
  const [returnDate, setReturnDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([getOnboardingQuestions(), getSurgeryInfo()])
      .then(([questionsRes, surgeryRes]) => {
        if (cancelled) return;
        setQuestions(questionsRes.questions);
        setReturnDateRange(questionsRes.return_date);

        // TODO: 라벨 텍스트("수술일")로 찾는 임시 방식. 서버가 surgery_date를
        // questions 응답에 직접 내려주면 이 부분 제거하고 그 필드 쓰면 됨.
        // 주의: t("surgeryDateLabel")이 아니라, 서버가 실제로 내려주는 한국어 라벨과
        // 정확히 일치해야 이 로직이 작동합니다. lang=ja로 받으면 label도 일본어라
        // 이 find가 실패할 수 있으니, 서버가 surgeryDate 전용 필드를 내려주는 게 안전합니다.
        const surgeryRow = surgeryRes.rows.find((r) => r.key === "surgery_date");
        setSurgeryDate(surgeryRow ? new Date(surgeryRow.value) : null);
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

  const returnDN = useMemo(
    () => (returnDate && surgeryDate ? diffDaysFromSurgery(new Date(returnDate), surgeryDate) : null),
    [returnDate, surgeryDate]
  );

  const flightZone = getFlightZone(returnDN);

  const isComplete =
    !!questions &&
    questions.every((q) => answers[q.key] !== undefined) &&
    returnDate !== null;

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectDate = (date) => {
    setReturnDate(date);
    setIsCalendarOpen(false);
  };

  const handleCreateRoutine = async () => {
    if (!isComplete) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const result = await completeOnboarding({
        answers,
        returnDate: formatISODate(new Date(returnDate)),
      });

      localStorage.setItem("naranhi_onboarding_result", JSON.stringify(result));

      navigate("/onboarding/complete");
    } catch (err) {
      setSubmitError(err.response?.data?.detail || t("createRoutineFail"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme step={t("step3")} title={t("loadingQuestions")} />
        </Content>
      </Layout>
    );
  }

  if (error || !questions || !returnDateRange || !surgeryDate) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step={t("step3")}
            title={t("infoLoadFail")}
            desc={t("checkNetwork")}
          />
          <Spacer />
          <Button type="button" onClick={() => window.location.reload()}>
            {t("retry")}
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content>
        <LoginTheme
          step={t("step3")}
          title={t("personalTitle")}
          desc={t("personalDesc")}
        />
        <Spacer />

        {questions.map((q) => (
          <InfoBox key={q.key} style={{ padding: "16px", marginBottom: "20px" }}>
            <QuestionTitle>{q.question}</QuestionTitle>
            <QuestionHint>{q.hint}</QuestionHint>
            {q.answer_type === "bool" ? (
              <ToggleRow>
                <ToggleButton
                  type="button"
                  $active={answers[q.key] === true}
                  onClick={() => handleAnswer(q.key, true)}
                >
                  {t("yes")}
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={answers[q.key] === false}
                  onClick={() => handleAnswer(q.key, false)}
                >
                  {t("no")}
                </ToggleButton>
              </ToggleRow>
            ) : (
              <QuestionHint>{t("unsupportedAnswerType").replace("{type}", q.answer_type)}</QuestionHint>
            )}
          </InfoBox>
        ))}

        <InfoBox style={{ padding: "16px", position: "relative", overflow: "visible" }}>
          <QuestionTitle>{t("returnDateTitle")}</QuestionTitle>
          <QuestionHint>{t("returnDateHint")}</QuestionHint>

          <DateRow>
            <DateField
              type="button"
              onClick={() => setIsCalendarOpen((prev) => !prev)}
            >
              <span>{returnDate ? formatSlash(new Date(returnDate)) : t("dateFieldPlaceholder")}</span>
              <span role="img" aria-label={t("calendarAria")}>
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
                minDate={new Date(returnDateRange.min)}
                maxDate={new Date(returnDateRange.max)}
                markedDate={surgeryDate}
                markedLabel={t("surgeryDateLabel")}
              />
            </CalendarPopover>
          )}

          {returnDate && flightZone && (
            <DateHint>
              <b>{t("surgeryDateLabel")} {formatDot(surgeryDate)} </b>{t("baseOn")}{" "}
              {t("returnFlightPrefix")}{" "}
              <ZoneLabel $token={flightZone.token}>{flightZone.label}</ZoneLabel>{" "}
              {t("flightZoneSuffix")}
            </DateHint>
          )}
        </InfoBox>

        <Spacer />

        {submitError && <ErrorBox>{submitError}</ErrorBox>}

        <Button
          type="button"
          disabled={!isComplete || isSubmitting}
          onClick={handleCreateRoutine}
        >
          {isSubmitting ? t("creating") : t("createRoutine")}
        </Button>
      </Content>
    </Layout>
  );
};

export default OnboardingPersonal;

/* ---------- styles ---------- */

const QuestionTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111; 
  margin: 0 0 6px;
`;

const QuestionHint = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  margin: 0 0 16px;
`;

const ToggleRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 8px 0;
  ${font("semibody")}
  border-radius: 11px;
  border: 1.5px solid ${({ $active }) => ($active ? COLORS.main : "#e5e5ea")};
  background: ${({ $active }) => ($active ? COLORS.background_lightpurple : "#ffffff")};
  color: ${({ $active }) => ($active ? COLORS.main : COLORS.text_gray)};
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
  ${font("semibody")}
  border-radius: 11px;
  border: 1px solid ${COLORS.border};
  background: #ffffff;
  cursor: pointer;
  text-align: left;
`;

const DnBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  ${font("boldbody")}
  color: ${COLORS.main};
  background: ${COLORS.background_lightpurple};
  border-radius: 11px;
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
  border-radius: 11px;
  box-shadow: 0 12px 32px rgba(80, 130, 180, 0.2);
`;

const DateHint = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  margin: 14px 0 0;
`;

const ZoneLabel = styled.span`
  ${font("regbody")}
  color: ${({ $token }) => ZONE_COLORS[$token]};
`;