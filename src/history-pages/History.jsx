import React, { useState } from "react";
import HomeTheme from "../components/HomeTheme";
import HistoryTheme from "../components/HistoryTheme";
import Calendar from "../components/Calendar";
import { PhotoTimelineBox, SymptomFlowBox, NoCheckinState } from "../components/HistoryBox";
import { isSameDay } from "../utils/dateUtils";
import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { ShadowBox } from "../components/Box";
import { HistoryDayModal } from "../components/HistoryModal";

const SURGERY_DATE = new Date(2026, 7, 3);

const CHECKIN_DATES = [
  new Date(2026, 7, 3),
  new Date(2026, 7, 4),
  new Date(2026, 7, 5),
  new Date(2026, 7, 6),
];

// TODO: 실제로는 날짜별 저장된 데이터에서 가져와야 함
const CHECKIN_DETAIL_DATA = {
  "2026-08-03": {
    photos: [{ label: "정면" }, { label: "좌" }, { label: "우" }],
    symptoms: [
      { key: "swelling", label: "부기", level: 3 },
      { key: "pain", label: "통증", level: 3 },
      { key: "bruising", label: "멍", level: 3 },
    ],
    careTags: [
      "절개부 소독 · 2회",
      "냉찜질 · 2회",
      "상체 45° 수면 · 1회",
      "코 안 세척 · 3회",
      "처방약 복용 · 3회",
      "짧은 보행 · 3회",
    ],
  },
};

const TIMELINE_PHOTOS = [{ label: "D+0" }, { label: "D+1" }, { label: "D+2" }, { label: "D+3" }];
const TIMELINE_PROGRESS = 40;
const TIMELINE_SYMPTOMS = [
  {
    key: "swelling",
    label: "부기",
    days: [
      { label: "D+0", level: 1 },
      { label: "D+1", level: 3 },
      { label: "D+2", level: 3 },
      { label: "D+3", level: 3 },
    ],
  },
  {
    key: "pain",
    label: "통증",
    days: [
      { label: "D+0", level: 2 },
      { label: "D+1", level: 2 },
      { label: "D+2", level: 2 },
      { label: "D+3", level: 1 },
    ],
  },
  {
    key: "bruising",
    label: "멍",
    days: [
      { label: "D+0", level: 1 },
      { label: "D+1", level: 3 },
      { label: "D+2", level: 3 },
      { label: "D+3", level: 3 },
    ],
  },
];

function formatKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDot(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function diffDaysFromSurgery(date) {
  const ms = new Date(date).setHours(0, 0, 0, 0) - new Date(SURGERY_DATE).setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

const History = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalDate, setModalDate] = useState(null);

  const isCheckinDate = (date) => CHECKIN_DATES.some((d) => isSameDay(d, date));
  const selectedKey = selectedDate ? formatKey(selectedDate) : null;
  const detail = selectedKey ? CHECKIN_DETAIL_DATA[selectedKey] : null;

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setModalDate(date);
  };

  const modalDetail = modalDate ? CHECKIN_DETAIL_DATA[formatKey(modalDate)] : null;


  return (
    <HomeTheme bannerTitle="나란히">
      <HistoryTheme returnDDay={17} dateLabel="2026.08.20">
        <Calendar
          selectedDate={selectedDate}
          onSelect={handleSelectDate}
          checkinDates={CHECKIN_DATES}
          minDate={SURGERY_DATE}
          markedDate={SURGERY_DATE}
        />
        <LegendRow>
          <LegendDot />
          <LegendText>체크인 기록이 있는 날</LegendText>
        </LegendRow>

        <ShadowBox>
          <PhotoTimelineBox photos={TIMELINE_PHOTOS} progressPercent={TIMELINE_PROGRESS} />
        </ShadowBox>

        <ShadowBox>
          <SymptomFlowBox symptoms={TIMELINE_SYMPTOMS} />
        </ShadowBox>

      </HistoryTheme>

      {modalDate && (
        <HistoryDayModal
          dDayLabel={`D+${diffDaysFromSurgery(modalDate)}`}
          dateLabel={formatDot(modalDate)}
          detail={modalDetail}
          onClose={() => setModalDate(null)}
        />
      )}

    </HomeTheme>
  );
};

export default History;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid ${COLORS.info};
  background: ${COLORS.text_green};
`;

const LegendText = styled.span`
  ${font("regbody")}
  color: ${COLORS.text_gray};
`;