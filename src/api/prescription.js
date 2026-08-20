import apiClient from "./client";

export async function getPrescriptionOcr() {
  const { data } = await apiClient.get("/api/v1/prescriptions/ocr");
  return data;
}

// 처방전 사진을 업로드해서 새 OCR draft를 생성한다.
export async function postPrescriptionOcr(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await apiClient.post("/api/v2/prescriptions/ocr", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
