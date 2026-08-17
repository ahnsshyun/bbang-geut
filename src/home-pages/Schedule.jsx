import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Calendar from "../components/Calendar";
import HomeTheme from "../components/HomeTheme";
import { Spacer } from "../components/Layout";
import { RoutineSection, TimelineSection } from "../components/HomeBox";
import { CloseButton } from "../components/Button";

import { getSchedule, getScheduleDay } from "../api/schedule";
import { getHome } from "../api/home";

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
  let returnDate = null;
  let completeDate = null;
  // TODO: "remote"(원격 진찰)를 Calendar가 별도로 표시할 방법이 아직 없어서
  // 우선 hospitalVisitDates(내원과 동일한 보라 점)에 합쳐 넣었습니다.
  // 디자인상 구분이 필요하면 Calendar 컴포넌트에 remoteDates prop을 추가해야 해요.
  markers.forEach((m) => {
    const date = parseISODate(m.date);
    if (m.type === "visit" || m.type === "remote") hospitalVisitDates.push(date);
    else if (m.type === "return") returnDate = date;
    else if (m.type === "complete") completeDate = date;
  });
  return { hospitalVisitDates, returnDate, completeDate };
}

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const [schedule, setSchedule] = useState(null);
  const [surgeryDate, setSurgeryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dayDetail, setDayDetail] = useState(null);
  const [dayDetailLoading, setDayDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getSchedule(), getHome()])
      .then(([scheduleRes, homeRes]) => {
        if (cancelled) return;
        setSchedule(scheduleRes);
        // TODO: /schedule 응답엔 수술일이 직접 없어서 /home의 date - day로 역산.
        // 백엔드가 /schedule에 surgery_date를 직접 내려주면 이 호출(getHome)은 제거 가능.
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

    getScheduleDay({ date: formatISODate(date) })
      .then((data) => setDayDetail(data))
      .catch(() => setDayDetail(null))
      .finally(() => setDayDetailLoading(false));
  };

  if (loading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>불러오는 중이에요...</p>
      </HomeTheme>
    );
  }

  if (error || !schedule || !surgeryDate) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>일정을 불러오지 못했어요. 네트워크 상태를 확인해 주세요.</p>
      </HomeTheme>
    );
  }

  const { hospitalVisitDates, returnDate, completeDate } = splitMarkersByType(schedule.markers);

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
        <Title>전체 일정</Title>
        <CloseButton type="button" onClick={() => navigate("/home")} aria-label="닫기">
          ✕
        </CloseButton>
      </Header>

      <Description>
        날짜를 누르면, 가능 / 주의 / 금지 항목의 변화를 볼 수 있어요.
      </Description>

      <Calendar
        minDate={surgeryDate}
        markedDate={surgeryDate}
        hospitalVisitDates={hospitalVisitDates}
        returnDate={returnDate}
        completeDate={completeDate}
        selectedDate={selectedDate}
        onSelect={handleSelectDate}
      />

      <LegendRow>
        <LegendItem>
          <LegendDot />
          <span>수술일</span>
        </LegendItem>
        <LegendItem>
          <span>✈️</span>
          <span>귀국 예정일</span>
        </LegendItem>
        <LegendItem>
          <span>🏆</span>
          <span>완주일</span>
        </LegendItem>
      </LegendRow>

      {selectedDate && (
        <SelectedInfo>
          {dayDetailLoading ? (
            "불러오는 중이에요..."
          ) : dayDetail ? (
            <>
              <b>D+{dayDetail.day} · {dayDetail.stage}</b>
              <br />
              가능 {dayDetail.rules.ok?.count ?? 0} · 주의 {dayDetail.rules.care?.count ?? 0} · 금지{" "}
              {dayDetail.rules.no?.count ?? 0}
            </>
          ) : (
            "이 날짜의 정보를 불러오지 못했어요."
          )}
        </SelectedInfo>
      )}

      <Spacer />

      <RoutineSection title="앞으로의 변화">
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

const SelectedInfo = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: ${COLORS.background_lightpurple};
  ${font("regbody")}
  color: ${COLORS.main};
`;