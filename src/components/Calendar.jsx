import { useState } from "react";
import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { getMonthMatrix, isSameDay } from "../utils/dateUtils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * props:
 * - selectedDate: 선택된 Date | null
 * - onSelect: (date: Date) => void
 * - minDate: 이 날짜보다 이전은 선택 불가 (보통 시술일)
 * - markedDate: 점(dot)을 찍을 날짜 (보통 수술일)
 * - hospitalVisitDates: 병원 내원일 배열 (연보라 배경 표시)
 * - returnDate: 귀국 예정일 (비행기 이모지 표시)
 */
const Calendar = ({
  selectedDate,
  onSelect,
  minDate,
  markedDate,
  hospitalVisitDates = [],
  returnDate,
  completeDate,
  checkinDates = [],
  
}) => {
  const [viewDate, setViewDate] = useState(selectedDate || markedDate || new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const weeks = getMonthMatrix(year, month);

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDisabled = (date) => {
    if (!minDate || !date) return false;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    return d < min;
  };

  return (
    <Wrapper>
      <Header>
        <NavButton onClick={goPrevMonth}>‹</NavButton>
        <MonthLabel>{year}년 {month + 1}월</MonthLabel>
        <NavButton onClick={goNextMonth}>›</NavButton>
      </Header>

      <WeekRow>
        {WEEKDAYS.map((w) => (
          <WeekdayCell key={w}>{w}</WeekdayCell>
        ))}
      </WeekRow>

      {weeks.map((week, i) => (
        <WeekRow key={i}>
          {week.map((date, j) => {
            if (!date) return <DayCell key={j} $empty />;
            const disabled = isDisabled(date);
            const selected = isSameDay(date, selectedDate);
            const marked = isSameDay(date, markedDate);
            const isToday = isSameDay(date, new Date());
            const isHospitalVisit = hospitalVisitDates.some((d) => isSameDay(d, date));
            const isReturnDay = isSameDay(date, returnDate);
            const isCompleteDay = isSameDay(date, completeDate);
            const hasCheckin = checkinDates.some((d) => isSameDay(d, date));

            return (
              <DayCell
                key={j}
                $selected={selected}
                $disabled={disabled}
                $hospitalVisit={isHospitalVisit}
                onClick={() => !disabled && onSelect && onSelect(date)}
              >
                {date.getDate()}
                {marked && <SurgeryDot />}
                {isReturnDay && <PlaneMark>✈️</PlaneMark>}
                {isCompleteDay && <CompleteMark>🏆</CompleteMark>}
                {hasCheckin && <CheckinDot />}
              </DayCell>
            );
          })}
        </WeekRow>
      ))}
    </Wrapper>
  );
};

export default Calendar;

/* ---------- styles ---------- */

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid ${COLORS.border};
  border-radius: 11px;
  padding: 14px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MonthLabel = styled.div`
  ${font("boldbody")}
  color: #111111;
`;

const NavButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 16px;
  color: ${COLORS.text_gray};
  cursor: pointer;

  &:hover {
    background: ${COLORS.background_lightpurple};
    color: ${COLORS.main};
  }
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const WeekdayCell = styled.div`
  text-align: center;
  ${font("regbody")}
  color: ${COLORS.text_gray};
  padding: 6px 0;
`;

const DayCell = styled.div`
  position: relative;
  text-align: center;
  ${font("regbody")}
  padding: 15px 0;
  border-radius: 10px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  color: ${({ $disabled, $selected }) =>
    $disabled ? COLORS.greey : $selected ? "#ffffff" : COLORS.text_gray};
  background: ${({ $selected, $hospitalVisit }) =>
    $selected ? COLORS.main : $hospitalVisit ? COLORS.background_lightpurple : "transparent"};
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  visibility: ${({ $empty }) => ($empty ? "hidden" : "visible")};

  &:hover {
    background: ${({ $disabled, $selected }) =>
      $disabled ? "transparent" : $selected ? COLORS.main : COLORS.background_lightpurple};
  }
`;

const SurgeryDot = styled.span`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${COLORS.main};
  border: 2px solid ${COLORS.sub};
`;

const PlaneMark = styled.span`
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  line-height: 1;
`;

const CompleteMark = styled.span`
  position: absolute;
  bottom: 1px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  line-height: 1;
`;

const CheckinDot = styled.span`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${COLORS.text_green};
  border: 2px solid ${COLORS.info};
`;