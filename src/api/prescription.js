import apiClient from "./client";

export async function getPrescriptionOcr() {
  const { data } = await apiClient.get("/api/v1/prescriptions/ocr");
  return data;
}

export async function getPrescriptionDetail() {
  const { data } = await apiClient.get("/api/v1/prescriptions/detail");
  return data;
}

export async function confirmPrescription(ocrId) {
  const { data } = await apiClient.post("/api/v1/prescriptions/confirm", {
    ocr_id: ocrId,
  });
  return data;
}