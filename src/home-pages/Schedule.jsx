import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Calendar from "../components/Calendar";
import HomeTheme from "../components/Theme/HomeTheme";
import { Spacer } from "../components/Layout";
import { RoutineSection, TimelineSection } from "../components/Box/HomeBox";
import { CloseButton } from "../components/Button";
import { ScheduleDayModal } from "../components/Modal/ScheduleModal";

import { getSchedule, getScheduleDay } from "../api/schedule";
import { getHome } from "../api/home";
import { getStoredPatient } from "../api/auth";
import { useLang, getCurrentLang } from "../hooks/useLang";

function parseISODate(str) {
  // "2026-08-08" → Date (로컬 타임존 자정)
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// API의 marker type("visit"/"return"/"remote"/"complete") → Calendar가 요구하는 개별 날짜 배열로 변환
function splitMarkersByType(markers) {
  const hospitalVisitDates = [];
  const remoteDates = [];
  let returnDate = null;
  let completeDate = null;
  markers.forEach((m) => {
    const date = parseISODate(m.date);
      if (m.type === "visit") hospitalVisitDates.push(date);
      else if (m.type === "remote") remoteDates.push(date);
    else if (m.type === "return") returnDate = date;
    else if (m.type === "complete") completeDate = date;
  });
  return { hospitalVisitDates, remoteDates, returnDate, completeDate };
}

const Schedule = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [selectedDate, setSelectedDate] = useState(null);

  const [schedule, setSchedule] = useState(null);
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dayDetail, setDayDetail] = useState(null);
  const [dayDetailLoading, setDayDetailLoading] = useState(false);

useEffect(() => {
  let cancelled = false;

  const lang = getCurrentLang();

  Promise.all([getSchedule({ lang }), getHome()])
    .then(([scheduleRes, homeRes]) => {
      if (cancelled) return;
      setSchedule(scheduleRes);
      const d = new Date(homeRes.date);
      d.setDate(d.getDate() - homeRes.day);
      setSurgeryDate(d);
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

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setDayDetail(null);
    setDayDetailLoading(true);

  const patient = getStoredPatient();
  getScheduleDay({ date: formatISODate(date), lang: patient?.lang || "ko" })
      .then((data) => setDayDetail(data))
      .catch(() => setDayDetail(null))
      .finally(() => setDayDetailLoading(false));
  };

  if (loading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>{t("loading")}</p>
      </HomeTheme>
    );
  }

  if (error || !schedule || !surgeryDate) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>{t("loadError")}</p>
      </HomeTheme>
    );
  }

  const { hospitalVisitDates, remoteDates, returnDate, completeDate } = splitMarkersByType(schedule.markers);

// 서버 markers에 complete 마커가 안 오는 경우가 있어 수술일 기준 D+120으로 직접 계산
const calculatedCompleteDate = completeDate ?? (() => {
  const d = new Date(surgeryDate);
  d.setDate(d.getDate() + 120);
  return d;
})();

  const timelineItems = schedule.upcoming.map((item, index) => ({
    key: `${item.type}-${item.day}-${index}`,
    date: item.date.slice(2).replace(/-/g, "."), // "2026-08-08" → "26.08.08"
    dDay: `D+${item.day}`,
    label: item.label,
    status: item.type,
    badgeLabel: item.badge, // 서버가 이미 번역해서 준 뱃지 문구 그대로 사용
  }));

  return (
    <HomeTheme bannerTitle="나란히">
      <Header>
        <Title>{t("scheduleTitle")}</Title>
        <CloseButton type="button" onClick={() => navigate("/home")} aria-label="닫기">
          ✕
        </CloseButton>
      </Header>

      <Description>
        {t("scheduleDesc")}
      </Description>

      <Calendar
        minDate={surgeryDate}
        markedDate={surgeryDate}
        hospitalVisitDates={hospitalVisitDates}
        returnDate={returnDate}
        completeDate={calculatedCompleteDate}
        remoteDates={remoteDates}
        selectedDate={selectedDate}
        onSelect={handleSelectDate}
      />

      <LegendRow>
        <LegendItem>
          <LegendDot />
          <span>{t("legendSurgery")}</span>
        </LegendItem>

        <LegendItem>
          <span>✈️</span>
          <span>{t("legendReturn")}</span>
        </LegendItem>

        <LegendItem>
          <span>🏆</span>
          <span>{t("legendComplete")}</span>
        </LegendItem>

        <LegendItem>
          <VisitDot />
          <span>{t("legendVisit")}</span>
        </LegendItem>

        <LegendItem>
          <RemoteDot />
          <span>{t("legendRemote")}</span>
        </LegendItem>

      </LegendRow>

      {selectedDate && !dayDetailLoading && dayDetail && (
        <ScheduleDayModal
          dDayLabel={`D+${dayDetail.day}`}
          dateLabel={formatISODate(selectedDate).replace(/-/g, ".")}
          stageLabel={dayDetail.stage}
    routines={(dayDetail.tasks ?? []).map((task) =>
      task.times_per_day > 1 ? `${task.name} · ${task.times_per_day}${t("times")}` : task.name
    )}
          statusGroups={{
            ok: (dayDetail.rules.ok?.items ?? []).map((i) => i.name),
            care: (dayDetail.rules.care?.items ?? []).map((i) => i.name),
            no: (dayDetail.rules.no?.items ?? []).map((i) => i.name),
          }}
          onClose={() => setSelectedDate(null)}
        />
      )}

      <Spacer />

      <RoutineSection title={t("scheduleUpcoming")}>
        <TimelineSection items={timelineItems} />
      </RoutineSection>
    </HomeTheme>
  );
};

export default Schedule;

/* ---------- styles ---------- */

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  ${font("semibody")}
  font-size: 16px;
  color: #111111;
  margin: 0;
`;

const Description = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  line-height: 1.6;
  margin: 0 0 20px;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 16px;
  flex-wrap: wrap;
  row-gap: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${font("regbody")}
  color: ${COLORS.text_gray};
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${COLORS.main};
  border: 2px solid ${COLORS.sub};
`;

const VisitDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #FFB800;
  border: 2px solid #FFE9AD;
`;

const RemoteDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff6ae6;
  border: 2px solid #fcb2ff;
`;