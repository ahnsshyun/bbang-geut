import apiClient from "./client";

/** GET /api/v1/notifications — 헤더 종 아이콘 탭 시 호출 */
export async function getNotifications({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/notifications", {
    params: lang ? { lang } : undefined,
  });
  return data;
}