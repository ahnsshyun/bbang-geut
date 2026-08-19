import apiClient from "./client";

/**
 * GET /api/v1/home
 * 홈 화면 전체 데이터 — D+N 진행상황, 오늘 할 일(tasks), 오늘 해도 될까(rules)
 */
export async function getHome({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/home", {
    params: lang ? { lang } : undefined,
  });
  return data;
}

/**
 * PUT /api/v1/task-logs
 * 루틴 체크 반영. done_count는 "누적"이 아니라 "그 날짜의 총 완료 횟수(절대값)".
 * @param {{ taskKey: string, date: string, doneCount: number }} params date는 YYYY-MM-DD
 */
export async function putTaskLog({ taskKey, date, doneCount }) {
  const { data } = await apiClient.put("/api/v1/task-logs", {
    task_key: taskKey,
    date,
    done_count: doneCount,
  });
  return data;
}

/**
 * GET /api/v1/care-items/{kind}/{key}
 * 근거시트(왜 그런지 · 병원 안내문 원문).
 * kind: "task" | "rule"
 *
 * task 응답: { kind, key, icon, name, subtitle?, why, day_from, day_to, times_per_day,
 *              interval_days, source_text, source_ref }
 * rule 응답: { kind, key, icon, name, current: { status, text } | null, why,
 *              phases: [{ day_from, day_to, status, text, current }], source_text, source_ref }
 *
 * day 또는 date 쿼리로 조회 시점을 지정할 수 있음(생략 시 서버 기본값).
 */
export async function getCareItem({ kind, key, day, date, lang } = {}) {
  const params = {};
  if (day !== undefined) params.day = day;
  if (date) params.date = date;
  if (lang) params.lang = lang;

  const { data } = await apiClient.get(`/api/v1/care-items/${kind}/${key}`, { params });
  return data;
}