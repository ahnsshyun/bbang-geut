import apiClient from "./client";

/**
 * POST /api/v1/auth/login
 * @param {{ patientCode: string, dob: string, lang: "ko" | "ja" }} params
 * @returns {Promise<{
 *   access: string,
 *   refresh: string,
 *   patient: {
 *     patient_code: string,
 *     name: string,
 *     name_romaji: string,
 *     nationality: string,
 *     lang: string,
 *     lang_locked: boolean
 *   },
 *   surgery_id: number,
 *   care_status: string
 * }>}
 */
export async function loginPatient({ patientCode, dob, lang }) {
  const { data } = await apiClient.post("/api/v1/auth/login", {
    patient_code: patientCode,
    // TODO: 명세서 표는 dob 타입을 int라고 하는데, 예시 request body는
    // "19940512"처럼 문자열로 되어 있어요. 실제 서버가 어느 쪽을 기대하는지
    // 백엔드와 한 번 확인해 주세요. 지금은 예시(JSON 문자열) 기준으로 보냅니다.
    dob,
    lang,
  });
  return data;
}

/** 로그인 성공 응답을 localStorage에 저장 */
export function saveAuthSession(data) {
  localStorage.setItem("naranhi_access_token", data.access);
  localStorage.setItem("naranhi_refresh_token", data.refresh);
  localStorage.setItem("naranhi_patient", JSON.stringify(data.patient));
  localStorage.setItem("naranhi_surgery_id", String(data.surgery_id));
  localStorage.setItem("naranhi_care_status", data.care_status);
}

/** 로그아웃 등에서 사용할 세션 초기화 */
export function clearAuthSession() {
  localStorage.removeItem("naranhi_access_token");
  localStorage.removeItem("naranhi_refresh_token");
  localStorage.removeItem("naranhi_patient");
  localStorage.removeItem("naranhi_surgery_id");
  localStorage.removeItem("naranhi_care_status");
}

/** 현재 로그인된 환자 정보를 편하게 꺼내 쓰기 위한 헬퍼 */
export function getStoredPatient() {
  try {
    const raw = localStorage.getItem("naranhi_patient");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * GET /api/v1/me
 * 로그인 후 환자 · 수술 · 병원 정보를 한 번에 조회.
 * (login 응답의 patient보다 더 자세한 정보 — surgery, clinic 포함)
 */
export async function getMe() {
  const { data } = await apiClient.get("/api/v1/me");
  return data;
}

export function saveMeSession(data) {
  localStorage.setItem("naranhi_me", JSON.stringify(data));
}

export function getStoredMe() {
  try {
    const raw = localStorage.getItem("naranhi_me");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}