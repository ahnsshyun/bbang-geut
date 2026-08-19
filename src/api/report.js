import apiClient from "./client";

export async function createOrGetReport(kind, lang) {
  const { data } = await apiClient.post("/api/v1/reports", {
    kind,
    ...(lang ? { lang } : {}),
  });
  return data;
}

export async function getReportList(kind) {
  const { data } = await apiClient.get("/api/v1/reports/", {
    params: kind ? { kind } : {},
  });
  return data.items;
}

export async function getReportById(id) {
  const { data } = await apiClient.get(`/api/v1/reports/${id}`);
  return data;
}