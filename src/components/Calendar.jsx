import { useState } from "react";
import styled from "styled-components";
import { getMonthMatrix, isSameDay } from "../utils/dateUtils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * props:
 * - selectedDate: 선택된 Date | null
 * - onSelect: (date: Date) => void
 * - minDate: 이 날짜보다 이전은 선택 불가 (보통 시술일)
 */
const Calendar = ({ selectedDate, onSelect, minDate }) => {
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
            return (
              <DayCell
                key={j}
                $selected={selected}
                $disabled={disabled}
                onClick={() => !disabled && onSelect(date)}
              >
                {date.getDate()}
              </DayCell>
            );
          })}
        </WeekRow>
      ))}
    </Wrapper>
  );
};

export default Calendar;

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.button};
  padding: 14px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MonthLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const NavButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textLight};
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const WeekdayCell = styled.div`
  text-align: center;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 6px 0;
`;

const DayCell = styled.div`
  text-align: center;
  font-size: 12px;
  padding: 8px 0;
  border-radius: 10px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  color: ${({ theme, $disabled, $selected }) =>
    $disabled ? theme.colors.textMuted : $selected ? theme.colors.white : theme.colors.textSub};
  background: ${({ theme, $selected }) => ($selected ? theme.colors.primary : "transparent")};
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};
  visibility: ${({ $empty }) => ($empty ? "hidden" : "visible")};

  &:hover {
    background: ${({ theme, $disabled, $selected }) =>
      $disabled ? "transparent" : $selected ? theme.colors.primary : theme.colors.primaryLight};
  }
`;
