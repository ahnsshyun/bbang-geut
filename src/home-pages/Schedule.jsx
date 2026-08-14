import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Calendar from "../components/Calendar";
import HomeTheme from "../components/HomeTheme";
import { Spacer } from "../components/Layout";
import { RoutineSection, TimelineSection } from "../components/HomeBox";
import { CloseButton } from "../components/Button";

// TODO(백엔드 연동 시 제거): 예시 고정값
const SURGERY_DATE = new Date(2026, 7, 5); // 2026-08-05
const HOSPITAL_VISIT_DATES = [new Date(2026, 7, 5), new Date(2026, 7, 8), new Date(2026, 7, 10)];
const RETURN_DATE = new Date(2026, 7, 20); // 2026-08-20 (D+17 예시)
const COMPLETE_DATE = new Date(2026, 10, 26); 

const TIMELINE_ITEMS = [
  { key: "1", date: "26.08.10", dDay: "D+5", label: "부목 제거", status: "visit" },
  { key: "2", date: "26.08.12", dDay: "D+7", label: "실밥 제거", status: "visit" },
  { key: "3", date: "26.08.13", dDay: "D+8", label: "세안", status: "ok" },
  { key: "4", date: "26.08.19", dDay: "D+14", label: "색조화장", status: "caution" },
  { key: "5", date: "26.08.26", dDay: "D+21", label: "비행", status: "danger" },
  { key: "6", date: "26.08.28", dDay: "D+30", label: "경과 진찰", status: "visit" },
  { key: "7", date: "26.09.23", dDay: "D+56", label: "코 마사지 · 코팩", status: "ok" },
  { key: "8", date: "26.09.27", dDay: "D+60", label: "안경 착용", status: "ok" },
  { key: "9", date: "26.10.27", dDay: "D+90", label: "사우나 · 온천", status: "ok" },
  { key: "10", date: "26.11.26", dDay: "D+120", label: "케어 프로그램 완주", status: "complete" },
];

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

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
        minDate={SURGERY_DATE}
        markedDate={SURGERY_DATE}
        hospitalVisitDates={HOSPITAL_VISIT_DATES}
        returnDate={RETURN_DATE}
        completeDate={COMPLETE_DATE}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
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
          <span>왼주일</span>
        </LegendItem>
      </LegendRow>

      <Spacer />

      <RoutineSection title="앞으로의 변화">
        <TimelineSection items={TIMELINE_ITEMS} />
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
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${COLORS.main};
`;

const SelectedInfo = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: ${COLORS.background_lightpurple};
  ${font("regbody")}
  color: ${COLORS.main};
`;