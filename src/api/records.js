import apiClient from "./client";

/** GET /api/v1/records/photos — 사진 있는 날짜만, 날짜 오름차순 */
export async function getPhotoTimeline({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/records/photos", {
    params: lang ? { lang } : undefined,
  });
  return data;
}

/** GET /api/v1/records/symptoms?days=14 */
export async function getSymptomFlow({ days, lang } = {}) {
  const params = {};
  if (days) params.days = days;
  if (lang) params.lang = lang;

  const { data } = await apiClient.get("/api/v1/records/symptoms", { params });
  return data;
}

/** GET /api/v1/records/day?date=YYYY-MM-DD */
export async function getDayDetail({ date, lang } = {}) {
  const params = { date };
  if (lang) params.lang = lang;

  const { data } = await apiClient.get("/api/v1/records/day", { params });
  return data;
}

/** GET /api/v1/records/calendar?year=&month= */
export async function getCalendar({ year, month, lang } = {}) {
  const params = {};
  if (year) params.year = year;
  if (month) params.month = month;
  if (lang) params.lang = lang;

  const { data } = await apiClient.get("/api/v1/records/calendar", { params });
  return data;
}