import React, { useState } from "react";
import HomeTheme from "../components/HomeTheme";
import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { useNavigate } from "react-router-dom";
import { Spacer } from "../components/Layout";
import { AppointmentList } from "../components/HospitalBox";
import { ChatConsultation } from "../components/HospitalBox";

const APPOINTMENTS = [
  {
    key: "splint",
    icon: "🏥",
    title: "부목 제거",
    dDayLabel: "D+5",
    dateLabel: "2026.08.08 14:00",
    badgeLabel: "예정",
    onClick: () => {},
  },
  {
    key: "followup",
    icon: "🖥️",
    title: "경과 진찰 (원격)",
    dDayLabel: "D+30 · 귀국 후",
    dateLabel: "2026.09.22",
    badgeLabel: "예정",
    onClick: () => {},
  },
];

const MESSAGES = [
  {
    key: "1",
    from: "me",
    authorLabel: "사토 유이",
    dateLabel: "2026.08.04 · D+1",
    text: "코끝이 D+1보다 딱딱해진 것 같은데, 정상인가요?",
  },
  {
    key: "2",
    from: "doctor",
    authorLabel: "김서준 원장",
    dateLabel: "2026.08.04 · D+1",
    text: "첨부된 기록과 사진을 확인했습니다. 수술후 초기 부기로 인해 코끝이 딱딱하게 느껴질 수 있습니다. D+5 고정물 제거 시 직접 확인하겠습니다. 소독은 이대로 계속 진행해주세요.",
    translateHint: "🌐 한국어 → 日本語",
  },
  {
    key: "3",
    from: "me",
    authorLabel: "사토 유이",
    dateLabel: "2026.08.06 · D+3",
    text: "부기가 어제보다 조금 강해지고, 코끝이 뻐근함도 있습니다. 이대로 지켜봐도 괜찮을까요?",
  },
];

const ATTACHMENTS = [
  { key: "record", label: "🟢 회복 경과 기록 D+0 ~ D+4", onView: () => {} },
  { key: "photos", label: "🟢 오늘 사진 3컷 (정면·좌·우)", onView: () => {} },
  { key: "meds", label: "🟢 복약 이행 기록 D+0 ~ D+4", onView: () => {} },
];

const Hospital = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [autoTranslate, setAutoTranslate] = useState(true);

  return (
    <HomeTheme bannerTitle="나란히">
      <Banner>
        <HospitalName>서울 N성형외과의원</HospitalName>
        <HospitalMeta>안서현 원장 · 국제진료팀 +81-2-000-0000</HospitalMeta>

      </Banner>

      <Spacer/>
      <SectionTitle>예약</SectionTitle>
      <AppointmentList items={APPOINTMENTS} />

      <Spacer/>
      <SectionTitle>원격 상담</SectionTitle>
      <ChatConsultation
        doctorName="김서준 원장"
        doctorMeta="국제 진료팀 · 답변 KST 10:00 - 19:00"
        messages={MESSAGES}
        attachments={ATTACHMENTS}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={() => {}}
        autoTranslate={autoTranslate}
        onToggleAutoTranslate={() => setAutoTranslate((v) => !v)}
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
