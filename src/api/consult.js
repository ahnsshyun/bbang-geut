import apiClient from "./client";

/** GET /api/v1/consult/messages — 병원과 주고받은 상담 전체(원문+번역문 둘 다 옴) */
export async function getConsultMessages() {
  const { data } = await apiClient.get("/api/v1/consult/messages");
  return data;
}

/**
 * POST /api/v1/consult/messages
 * @param {{ body: string, attach?: { reportId?: number, checkinId?: number } }} params
 */
export async function postConsultMessage({ body, attach } = {}) {
  const payload = { body };
  if (attach?.reportId || attach?.checkinId) {
    payload.attach = {
      ...(attach.reportId ? { report_id: attach.reportId } : {}),
      ...(attach.checkinId ? { checkin_id: attach.checkinId } : {}),
    };
  }
  const { data } = await apiClient.post("/api/v1/consult/messages", payload);
  return data;
}

/** POST /api/v1/consult/read — 상담 화면 진입 시 호출, 알림 미읽음 배지 해제 */
export async function markConsultRead() {
  await apiClient.post("/api/v1/consult/read");
}