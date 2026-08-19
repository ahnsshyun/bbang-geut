import apiClient from "./client";

export async function getPrescriptionOcr(file) {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await apiClient.post("/api/v2/prescriptions/ocr", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function confirmPrescription(ocrId) {
  const { data } = await apiClient.post("/api/v1/prescriptions/confirm", {
    ocr_id: ocrId,
  });
  return data;
}