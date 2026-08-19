import apiClient from "./client";

/** POST /api/v1/checkins */
export async function createCheckin({ date } = {}) {
  const { data } = await apiClient.post("/api/v1/checkins", date ? { date } : {});
  return data;
}

/**
 * POST /api/v1/checkins/{checkinId}/photos
 * 같은 angle로 다시 올리면 서버에서 덮어씀.
 */
export async function uploadCheckinPhoto({ checkinId, angle, file }) {
  const formData = new FormData();
  formData.append("angle", angle);
  formData.append("image", file);

  const { data } = await apiClient.post(`/api/v1/checkins/${checkinId}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** PUT /api/v1/checkins/{checkinId}/symptoms — symptoms의 모든 항목을 다 채워서 보내야 함 */
export async function putCheckinSymptoms({ checkinId, symptoms }) {
  const { data } = await apiClient.put(`/api/v1/checkins/${checkinId}/symptoms`, { symptoms });
  return data;
}

/** POST /api/v1/checkins/{checkinId}/complete — 사진 3컷 + 증상 다 있어야 성공 */
export async function completeCheckin({ checkinId }) {
  const { data } = await apiClient.post(`/api/v1/checkins/${checkinId}/complete`);
  return data;
}