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
 * - markedDate: 표시(점)를 찍을 날짜 (보통 수술일)
 */
const Calendar = ({ selectedDate, onSelect, minDate, markedDate }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
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
            return (
              <DayCell
                key={j}
                $selected={selected}
                $disabled={disabled}
                $marked={marked}
                onClick={() => !disabled && onSelect(date)}
              >
                {date.getDate()}
                {isToday && <TodayDot />}
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
/* TODO: colors.js에 border, textMuted, textSub 값이 없어 임시 매핑/하드코딩했습니다. */

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
  padding: 8px 0;
  border-radius: 10px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  color: ${({ $disabled, $selected }) =>
    $disabled ? COLORS.greey : $selected ? "#ffffff" : COLORS.text_gray};
  background: ${({ $selected, $marked }) =>
    $selected ? COLORS.main : $marked ? COLORS.background_lightpurple : "transparent"};
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  visibility: ${({ $empty }) => ($empty ? "hidden" : "visible")};

  &:hover {
    background: ${({ $disabled, $selected }) =>
      $disabled ? "transparent" : $selected ? COLORS.main : COLORS.background_lightpurple};
  }
`;

const TodayDot = styled.span`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${COLORS.main};
`;