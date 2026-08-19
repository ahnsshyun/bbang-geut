import apiClient from "./client";

/**
 * GET /api/v1/schedule
 * 월 캘린더 마커(markers) + 앞으로의 변화 리스트(upcoming)
 */
export async function getSchedule({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/schedule", {
    params: lang ? { lang } : undefined,
  });
  return data;
}

/**
 * GET /api/v1/schedule/day
 * 특정 날짜(day 또는 date 중 하나)의 tasks/rules.
 * day, date 둘 다 안 주면 오늘(D+N) 기준으로 응답됨.
 */
export async function getScheduleDay({ day, date, lang } = {}) {
  const params = {};
  if (day !== undefined) params.day = day;
  if (date) params.date = date;
  if (lang) params.lang = lang;

  const { data } = await apiClient.get("/api/v1/schedule/day", { params });
  return data;
}