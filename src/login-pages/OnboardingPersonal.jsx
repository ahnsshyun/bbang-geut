import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import Button from "../components/Button";
import { InfoBox } from "../components/Box";

import Calendar from "../components/Calendar";
import { getOnboardingQuestions, getSurgeryInfo, completeOnboarding } from "../api/onboarding";
import { ErrorBox } from "../components/Box";

// TODO: 실제 "비행 규칙" 구간 기준(명세서 3.4 귀국 예정일 항목)이 API로 안 내려와서
// 프론트에서 임시로 추정한 경계값입니다. 서버가 계산해서 내려주는 게 이상적이에요.
function getFlightZone(dn) {
  if (dn === null) return null;
  if (dn <= 6) return { label: "금지", token: "danger" };
  if (dn <= 13) return { label: "주의", token: "warning" };
  return { label: "가능", token: "success" };
}

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

  const [questions, setQuestions] = useState(null);
  const [returnDateRange, setReturnDateRange] = useState(null); // { min, max, default }
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState({}); // { [questionKey]: true | false | undefined }
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
        const surgeryRow = surgeryRes.rows.find((r) => r.label === "수술일");
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

      // TODO: 전역 상태/서버 세션이 없어 다음 화면(완료)으로 값 전달용으로 localStorage 사용
      localStorage.setItem("naranhi_onboarding_result", JSON.stringify(result));

      navigate("/onboarding/complete");
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail ||
          "케어 루틴을 만드는 중 문제가 발생했어요. 다시 시도해 주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme step="STEP 3/3 · 개인 변수" title="질문을 불러오고 있어요" />
        </Content>
      </Layout>
    );
  }

  if (error || !questions || !returnDateRange || !surgeryDate) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step="STEP 3/3 · 개인 변수"
            title="정보를 불러오지 못했어요"
            desc="네트워크 상태를 확인하고 다시 시도해 주세요"
          />
          <Spacer />
          <Button type="button" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content>
        <LoginTheme
          step="STEP 3/3 · 개인 변수"
          title="3가지만 확인할게요"
          desc="병원 문서만으로는 알 수 없어 직접 여쭤봐요."
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
                  예
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={answers[q.key] === false}
                  onClick={() => handleAnswer(q.key, false)}
                >
                  아니오
                </ToggleButton>
              </ToggleRow>
            ) : (
              // TODO: answer_type이 bool 외 다른 값으로 오는 경우 UI 미정의 상태
              <QuestionHint>이 질문 형식({q.answer_type})은 아직 지원하지 않아요.</QuestionHint>
            )}
          </InfoBox>
        ))}

        <InfoBox style={{ padding: "16px", position: "relative", overflow: "visible" }}>
          <QuestionTitle>귀국 예정일을 입력해주세요</QuestionTitle>
          <QuestionHint>
            항공권에 적힌 날짜 그대로 넣어주세요. 이 날짜를 회복 루틴에 반영합니다.
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
                minDate={new Date(returnDateRange.min)}
                maxDate={new Date(returnDateRange.max)}
                markedDate={surgeryDate}
                markedLabel="수술일"
              />
            </CalendarPopover>
          )}

          {returnDate && flightZone && (
            <DateHint>
              <b>수술일 {formatDot(surgeryDate)} </b>기준{" "}
              귀국일이 비행{" "}
              <ZoneLabel $token={flightZone.token}>{flightZone.label}</ZoneLabel>{" "}
              구간에 들어갑니다.
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
          {isSubmitting ? "만드는 중..." : "케어 루틴 만들기"}
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