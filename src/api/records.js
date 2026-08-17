import apiClient from "./client";

/** GET /api/v1/records/photos — 사진 있는 날짜만, 날짜 오름차순 */
export async function getPhotoTimeline() {
  const { data } = await apiClient.get("/api/v1/records/photos");
  return data;
}

/** GET /api/v1/records/symptoms?days=14 */
export async function getSymptomFlow({ days } = {}) {
  const { data } = await apiClient.get("/api/v1/records/symptoms", {
    params: days ? { days } : undefined,
  });
  return data;
}

/** GET /api/v1/records/day?date=YYYY-MM-DD */
export async function getDayDetail({ date }) {
  const { data } = await apiClient.get("/api/v1/records/day", { params: { date } });
  return data;
}

/** GET /api/v1/records/calendar?year=&month= */
export async function getCalendar({ year, month } = {}) {
  const params = {};
  if (year) params.year = year;
  if (month) params.month = month;

  const { data } = await apiClient.get("/api/v1/records/calendar", { params });
  return data;
}