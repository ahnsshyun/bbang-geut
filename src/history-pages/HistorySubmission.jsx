import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import HomeTheme from "../components/Theme/HomeTheme";
import HistoryTheme from "../components/Theme/HistoryTheme";
import { ShadowBox, NoticeBox, ToastBox } from "../components/Box/Box";
import MainButton, { SubButton } from "../components/Button";
import { HospitalAlertBox, StatCardRow, SymptomChangeList, RoutineDonutRow } from "../components/Box/HistoryBox";
import apiClient from "../api/client";
import { Spacer } from "../components/Layout";
import { getStoredPatient } from "../api/auth";
import { getHome } from "../api/home";
import { useLang } from "../hooks/useLang";

function formatDot(dateStr) {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

const HistorySubmission = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const { t } = useLang();
  const [report, setReport] = useState(null);
  const [returnInfo, setReturnInfo] = useState(null); // { dDay, dateLabel }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setIsLoading(true);
      setError(null);
      try {
        const patient = getStoredPatient();
        const lang = patient?.lang || "ko";

        const [reportRes, homeRes] = await Promise.all([
          reportId
            ? apiClient.get(`/api/v1/reports/${reportId}`)
            : apiClient.post("/api/v1/reports", { kind: "submission", lang }),
          getHome({ lang }),
        ]);

        if (cancelled) return;
        setReport(reportRes.data);
        setReturnInfo({
          dDay: homeRes.summary?.return_dn ?? 0,
          dateLabel: homeRes.summary?.return_date ? formatDot(homeRes.summary.return_date) : "",
        });
      } catch (err) {
        if (!cancelled) {
          const code = err.response?.data?.error?.code;
          if (code === "NOT_FOUND") {
            setError(t("reportNotFound"));
          } else {
            setError(err.response?.data?.error?.message || t("reportLoadFail2"));
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  const handleSavePDF = () => {
    // TODO: 백엔드 연동 — PDF 생성/저장 (별도 엔드포인트 필요 여부 확인)
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const returnDDay = returnInfo?.dDay ?? 0;
  const returnDateLabel = returnInfo?.dateLabel ?? "";

  if (isLoading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <HistoryTheme returnDDay={returnDDay} dateLabel={returnDateLabel}>
          <LoadingText>{t("loadingReport")}</LoadingText>
        </HistoryTheme>
      </HomeTheme>
    );
  }

  if (error || !report) {
    return (
      <HomeTheme bannerTitle="나란히">
        <HistoryTheme returnDDay={returnDDay} dateLabel={returnDateLabel}>
          <LoadingText>{error || t("reportUnavailable")}</LoadingText>
        </HistoryTheme>
      </HomeTheme>
    );
  }

  const { meta, body } = report;

  const stats = [
    { key: "checkin", icon: "🤚", label: t("statKeyCheckin"), value: `${meta.checkin_count}${t("checkinUnit")}`, tone: "green" },
    { key: "photo", icon: "📈", label: t("statKeyPhoto"), value: `${meta.photo_count}${t("photoUnit")}`, tone: "purple" },
    {
      key: "routine",
      icon: "🔄",
      label: t("statKeyRoutine"),
      value: `${Math.round(meta.window_completion_rate * 100)}%`,
      tone: "orange",
    },
  ];

  const symptomItems = (body.symptom_flow || []).map((s) => ({
    key: s.key,
    label: s.name,
    trend: s.delta_pct > 0 ? "up" : s.delta_pct < 0 ? "down" : "same",
    desc: s.text,
  }));

  const routineDays = (body.routines || []).map((r) => ({
    key: r.key,
    dLabel: r.name,
    dateLabel: `D+${r.day_from} ~ D+${r.day_to}`,
    percent: Math.round(r.rate * 100),
  }));

  const confirmItems = (body.events || []).map((e) => e.text);
  const nextText = body.next_week?.[0]?.text;

  return (
    <HomeTheme bannerTitle="나란히">
      <HistoryTheme returnDDay={returnDDay} dateLabel={returnDateLabel}>
        <ShadowBox>
          <Section>
            <SummaryTitle>{report.title} {t("forMedicalUse")}</SummaryTitle>

            <SummaryList>
              <SummaryItem>
                <b>{t("surgeryName")}</b> : {meta.procedure}
              </SummaryItem>
              <SummaryItem>
                <b>{t("surgeryClinic")}</b> : {meta.clinic}
              </SummaryItem>
              <SummaryItem>
                <b>{t("recordPeriod")}</b> : D+{report.day_from} ~ D+{report.day_to}
              </SummaryItem>
              <SummaryItem>
                <b>{t("recordContent")}</b> : {t("statKeyCheckin")} {meta.checkin_count}/{meta.checkin_total}{t("checkinUnit")} · {t("statKeyPhoto")}{" "}
                {meta.photo_count}{t("photoUnit")} · {t("completionRate")} {Math.round(meta.completion_rate * 100)}%
              </SummaryItem>
            </SummaryList>
          </Section>

          <Section>
            <RecentHeaderRow>
              <RecentTitle>{t("weeklyReport")}</RecentTitle>
              <RecentDateRange>
                D+{report.day_from} ~ D+{report.day_to}
              </RecentDateRange>
              <AiBadge>{t("aiAutoSummary")}</AiBadge>
            </RecentHeaderRow>

            <RecentSummaryBox>
              <RecentSummaryText>{t("symptomCareOrganized")}</RecentSummaryText>
            </RecentSummaryBox>

            <StatCardRow stats={stats} />
            <SymptomChangeList items={symptomItems} />
            <RoutineDonutRow days={routineDays} />

            <NoticeBox>
              ※ {t("submissionDisclaimer1")}
              <br />※ {t("submissionDisclaimer2")}
              <br />※ {t("submissionDisclaimer3")}
              <br />※ {t("submissionDisclaimer4")}
            </NoticeBox>

            <Spacer/>

            <HospitalAlertBox>
            {t("consultRequestNoticeBold1")}{t("consultRequestNoticeAnd")} <b>{t("consultRequestNoticeBold2")}</b>{t("consultRequestNoticeSuffix")}
            <br />
            {t("consultRequestNoticeLine2")}
            </HospitalAlertBox>
          </Section>

        </ShadowBox>

        <SubButton type="button" onClick={handleSavePDF}>
          {t("saveReportPdf")}
        </SubButton>
        {showToast && <ToastBox>{t("pdfSavedToast2")}</ToastBox>}

        <MainButton
          type="button"
          onClick={() =>
            navigate("/hospital", {
              state: { attachedReport: { id: report.id, title: report.title } },
            })
          }
        >
          {t("sendToHospital")}
        </MainButton>
        <NoticeText>{t("consultAttachNotice")}</NoticeText>
      </HistoryTheme>
    </HomeTheme>
  );
};

export default HistorySubmission;

/* ---------- styles ---------- */

const LoadingText = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  text-align: center;
  padding: 60px 0;
`;

const SummaryTitle = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 0 0 16px;
`;

const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
`;

const SummaryItem = styled.p`
  ${font("regbody")}
  font-size: 13px;
  line-height: 1.6;
  color: #111111;
  margin: 0;

  b {
    ${font("boldbody")}
    font-size: 13px;
  }
`;

/* ---------- ai요약 ---------- */
const Section = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${COLORS.border};
  &:first-child {
    padding-top: 0;
  }
`;

const RecentHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const RecentTitle = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 0;
`;

const RecentDateRange = styled.span`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  flex: 1;
`;

const AiBadge = styled.span`
  ${font("boldbody")}
  font-size: 11px;
  color: ${COLORS.main};
  background: ${COLORS.background_lightpurple};
  padding: 5px 10px;
  border-radius: 20px;
  white-space: nowrap;
`;

const RecentSummaryBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  background: ${COLORS.background_lightpurple};
  border: 1px solid ${COLORS.sub};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
`;

const RecentSummaryText = styled.span`
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.main};
`;

const NoticeText = styled.p`
  ${font("regbody")}
  font-size: 11px;
  line-height: 1.6;
  color: ${COLORS.text_gray};
  margin: 0;
`;