import React, { useEffect, useState } from "react";
import HomeTheme from "../components/HomeTheme";
import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { Spacer } from "../components/Layout";
import { AppointmentList, ChatConsultation } from "../components/HospitalBox";

import { useMe } from "../hooks/useMe";
import { getClinic, getAppointments } from "../api/clinic";
import { getConsultMessages, postConsultMessage, markConsultRead } from "../api/consult";

const APPOINTMENT_ICON = { visit: "🏥", remote: "🖥️" };
const APPOINTMENT_BADGE_LABEL = { scheduled: "예정", done: "완료", missed: "미방문" };

function formatDotDate(isoDatetime) {
  const datePart = isoDatetime.slice(0, 10); // "2026-08-05T18:24:00+09:00" → "2026-08-05"
  return datePart.replaceAll("-", ".");
}

function formatAppointmentDateTime(isoDatetime) {
  const datePart = isoDatetime.slice(0, 10).replaceAll("-", ".");
  const timePart = isoDatetime.slice(11, 16); // "HH:mm"
  return `${datePart} ${timePart}`;
}

const Hospital = () => {
  const { me, loading: meLoading, error: meError } = useMe();

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

    Promise.all([getClinic(), getAppointments(), getConsultMessages()])
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
    getConsultMessages()
      .then((data) => setMessages(data.messages))
      .catch(() => {});
  };

  const handleSend = async () => {
    const body = inputValue.trim();
    if (!body || isSending) return;

    setIsSending(true);
    try {
      await postConsultMessage({ body });
      setInputValue("");
      // POST 응답의 messages 배열이 "새 메시지만"인지 "전체 스레드"인지 명세가 애매해서,
      // 안전하게 목록을 다시 불러와서 갱신합니다.
      refetchMessages();
    } catch (err) {
      alert(err.response?.data?.error?.message || "메시지 전송에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading || meLoading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>불러오는 중이에요...</p>
      </HomeTheme>
    );
  }

  if (error || meError || !clinic || !me) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>정보를 불러오지 못했어요. 네트워크 상태를 확인해 주세요.</p>
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
          {clinic.surgeon} · 국제진료팀 {clinic.tel}
        </HospitalMeta>
      </Banner>

      <Spacer />
      <SectionTitle>예약</SectionTitle>
      <AppointmentList items={appointmentItems} />

      <Spacer />
      <SectionTitle>원격 상담</SectionTitle>
      <ChatConsultation
        doctorName={clinic.surgeon}
        doctorMeta={`국제 진료팀 · 답변 ${clinic.reply_hours}`}
        messages={chatMessages}
        attachments={[]}
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