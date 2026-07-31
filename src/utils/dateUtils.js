// Calender에서는 UI, 여기에서는 계산 다룸
// 시간 계산 따로 분리해 다시 사용 가능


// 두 날짜 사이 일수 차이 (returnDate - procedureDate)
export const diffDays = (fromDate, toDate) => {
  const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const to = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((to - from) / MS_PER_DAY);
};

// 같은 날짜인지 비교 (시/분/초 무시)
export const isSameDay = (a, b) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

// 특정 연/월의 달력 매트릭스 생성 (앞뒤 빈칸 null 포함, 일요일 시작)
export const getMonthMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay(); // 0=일요일

  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= lastDate; d++) days.push(new Date(year, month, d));

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};

export const formatDate = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};
