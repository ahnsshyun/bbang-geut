import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import HomeTheme from "../components/Theme/HomeTheme";
import HistoryTheme from "../components/Theme/HistoryTheme";
import { ShadowBox, NoticeBox, ToastBox } from "../components/Box/Box";
import { SubButton } from "../components/Button";
import apiClient from "../api/client";
import { getStoredPatient } from "../api/auth";
import { getHome } from "../api/home";
import { useLang, getCurrentLang } from "../hooks/useLang";

function formatDot(dateStr) {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

const HomeCountry = () => {
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
        const lang = "ja"; 

        const [reportRes, homeRes] = await Promise.all([
          apiClient.post("/api/v1/reports", { kind: "repatriation", lang }),
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
          setError(err.response?.data?.error?.message || t("reportLoadFail"));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSavePDF = () => {
    // TODO: 백엔드 연동 — PDF 생성/저장
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const returnDDay = returnInfo?.dDay ?? 0;
  const returnDateLabel = returnInfo?.dateLabel ?? "";

  if (isLoading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <HistoryTheme returnDDay={returnDDay} dateLabel={returnDateLabel}>
          <LoadingText>{t("loadingRecord")}</LoadingText>
        </HistoryTheme>
      </HomeTheme>
    );
  }

  if (error || !report) {
    return (
      <HomeTheme bannerTitle="나란히">
        <HistoryTheme returnDDay={returnDDay} dateLabel={returnDateLabel}>
          <LoadingText>{error || t("reportLoadFail")}</LoadingText>
        </HistoryTheme>
      </HomeTheme>
    );
  }

  const { body } = report;

  return (
    <HomeTheme bannerTitle="나란히">
      <HistoryTheme returnDDay={returnDDay} dateLabel={returnDateLabel}>
        <ShadowBox>
          <SummaryTitle>{report.title}</SummaryTitle>

          <SummaryList>
            {(body.overview || []).map((line, i) => (
              <SummaryItem key={i}>{line.text}</SummaryItem>
            ))}
          </SummaryList>

          {report.disclaimers?.length > 0 && (
            <NoticeText>
              {report.disclaimers.map((text, i) => (
                <React.Fragment key={i}>
                  ※ {text}
                  {i < report.disclaimers.length - 1 && <br />}
                </React.Fragment>
              ))}
            </NoticeText>
          )}
        </ShadowBox>

        <NoticeBox>
          {t("pdfSaveNotice")}
        </NoticeBox>

        <SubButton type="button" onClick={handleSavePDF}>
          {t("savePdfButton")}
        </SubButton>
        {showToast && <ToastBox>{t("pdfSavedToast")}</ToastBox>}
      </HistoryTheme>
    </HomeTheme>
  );
};

export default HomeCountry;

/* ---------- styles ---------- */

const LoadingText = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  text-align: center;
  padding: 60px 0;
`;

const SummaryTitle = styled.p`
  ${font("body")}
  color: #111111;
  margin: 0 0 20px;
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

const NoticeText = styled.p`
  ${font("regbody")}
  line-height: 1.6;
  color: ${COLORS.text_gray};
  margin: 30px 0px 0px 0px;
`;