import apiClient from "./client";

/** GET /api/v1/clinic — 병원 탭 진입 시 호출 */
export async function getClinic() {
  const { data } = await apiClient.get("/api/v1/clinic");
  return data;
}

/** GET /api/v1/appointments — 병원 탭 진입 시 호출 */
export async function getAppointments() {
  const { data } = await apiClient.get("/api/v1/appointments");
  return data;
}