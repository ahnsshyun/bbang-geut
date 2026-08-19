import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeTheme from "../components/Theme/HomeTheme";
import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { Spacer } from "../components/Layout";
import { AppointmentList, ChatConsultation } from "../components/Box/HospitalBox";
import { useLang } from "../hooks/useLang";
import { getStoredPatient } from "../api/auth";

import { useMe } from "../hooks/useMe";
import { getClinic, getAppointments } from "../api/clinic";
import { getConsultMessages, postConsultMessage, markConsultRead } from "../api/consult";

function formatDotDate(isoDatetime) {
  const datePart = isoDatetime.slice(0, 10);
  return datePart.replaceAll("-", ".");
}

function formatAppointmentDateTime(isoDatetime) {
  const datePart = isoDatetime.slice(0, 10).replaceAll("-", ".");
  const timePart = isoDatetime.slice(11, 16);
  return `${datePart} ${timePart}`;
}

const Hospital = () => {
  const location = useLocation();
  const { t } = useLang();
  const [attachedReport, setAttachedReport] = useState(location.state?.attachedReport ?? null);
  const { me, loading: meLoading, error: meError } = useMe();

  const APPOINTMENT_ICON = { visit: "🏥", remote: "🖥️" };
  const APPOINTMENT_BADGE_LABEL = { scheduled: t("scheduled"), done: t("done"), missed: t("missed") };

  const [clinic, setClinic] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translateMode, setTranslateMode] = useState("translated");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const patient = getStoredPatient();
    const lang = patient?.lang || "ko";

    Promise.all([getClinic({ lang }), getAppointments({ lang }), getConsultMessages({ lang })])
      .then(([clinicRes, appointmentsRes, messagesRes]) => {
        if (cancelled) return;
        setClinic(clinicRes);
        setAppointments(appointmentsRes.items);
        setMessages(messagesRes.messages);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // 상담 화면 진입 시점에 읽음 처리 (미읽음 배지 해제). 실패해도 화면 이용엔 지장 없어서 조용히 무시.
    markConsultRead().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const refetchMessages = () => {
    const patient = getStoredPatient();
    const lang = patient?.lang || "ko";
    getConsultMessages({ lang })
      .then((data) => setMessages(data.messages))
      .catch(() => {});
  };

  const handleSend = async () => {
    const body = attachedReport
      ? `${t("reportSentPrefix")} ${attachedReport.title} ${t("reportSentSuffix")}`
      : inputValue.trim();
    if (!body || isSending) return;

    setIsSending(true);
    try {
      await postConsultMessage({ body });
      setInputValue("");
      setAttachedReport(null);
      refetchMessages();
    } catch (err) {
      alert(err.response?.data?.error?.message || t("sendMessageFail"));
    } finally {
      setIsSending(false);
    }
  };

  if (loading || meLoading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>{t("loadingHospital")}</p>
      </HomeTheme>
    );
  }

  if (error || meError || !clinic || !me) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>{t("hospitalLoadFail")}</p>
      </HomeTheme>
    );
  }

  const appointmentItems = appointments.map((a) => ({
    key: a.id,
    icon: APPOINTMENT_ICON[a.kind] ?? "🏥",
    title: a.title,
    dDayLabel: `D+${a.day}`,
    dateLabel: formatAppointmentDateTime(a.scheduled_at),
    badgeLabel: APPOINTMENT_BADGE_LABEL[a.status] ?? a.status,
    status: a.status,
    onClick: () => {},
  }));

  const chatMessages = messages.map((msg) => {
    const isDoctor = msg.sender_type === "staff";
    const showTranslated = translateMode === "translated" && msg.body_translated;
    return {
      key: msg.id,
      from: isDoctor ? "doctor" : "me",
      authorLabel: isDoctor ? clinic.surgeon : me.patient.name,
      dateLabel: `${formatDotDate(msg.created_at)} · D+${msg.day}`,
      text: showTranslated ? msg.body_translated : msg.body_original,
      translateHint: msg.tag,
    };
  });

  return (
    <HomeTheme bannerTitle="나란히">
      <Banner>
        <HospitalName>{clinic.name}</HospitalName>
        <HospitalMeta>
          {clinic.surgeon} · {t("internationalTeam")} {clinic.tel}
        </HospitalMeta>
      </Banner>

      <Spacer />
      <SectionTitle>{t("appointmentsTitle")}</SectionTitle>
      <AppointmentList items={appointmentItems} />

      <Spacer />
      <SectionTitle>{t("remoteConsultTitle")}</SectionTitle>
      <ChatConsultation
        doctorName={clinic.surgeon}
        doctorMeta={`${t("internationalTeamReply")} ${clinic.reply_hours}`}
        messages={chatMessages}
        attachments={attachedReport ? [{ key: attachedReport.id, label: attachedReport.title }] : []}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        autoTranslate={autoTranslate}
        onToggleAutoTranslate={() => setAutoTranslate((v) => !v)}
        translateMode={translateMode}
        onChangeTranslateMode={setTranslateMode}
        scopeNoticeText={`ⓘ ${clinic.scope_notice}`}
      />
    </HomeTheme>
  );
};

export default Hospital;

const Banner = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 22px;
  border-radius: 11px;
  background: linear-gradient(135deg, #2E2A5C, #6E5BEF);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HospitalName = styled.p`
  ${font("boldbody")}
  font-size: 17px;
  color: #ffffff;
  margin: 0 0 8px;
`;

const HospitalMeta = styled.p`
  ${font("semibody")}
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
`;

const SectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 16px;
  color: #111111;
  margin: 0 0 12px;
`;