import apiClient from "./client";
import { getCurrentLang } from "../hooks/useLang";
import { STORAGE_KEYS } from "./storageKeys";

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
    // NOTE: 명세서 표는 int라고 되어 있었지만, 실제로는 문자열이어야 정상 동작함
    // (2026-08-XX 테스트로 확인). 명세서 표 오타로 보임 — 필요하면 백엔드에 문서 정정 요청.
    dob,
    lang: lang ?? getCurrentLang(),
  });
  return data;
}

/** 로그인 성공 응답을 localStorage에 저장 */
export function saveAuthSession(data) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh);
  localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(data.patient));
  localStorage.setItem(STORAGE_KEYS.SURGERY_ID, String(data.surgery_id));
  localStorage.setItem(STORAGE_KEYS.CARE_STATUS, data.care_status);
  localStorage.removeItem(STORAGE_KEYS.ME);
}

/** 로그아웃 등에서 사용할 세션 초기화 */
export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.PATIENT);
  localStorage.removeItem(STORAGE_KEYS.SURGERY_ID);
  localStorage.removeItem(STORAGE_KEYS.CARE_STATUS);
  // NOTE: 기존 코드에 이 줄이 빠져 있었음 — me 세션도 함께 지워야 하는지 확인 필요.
  // 만약 로그아웃 시 me 캐시를 유지해야 한다면 이 줄은 제거하세요.
  localStorage.removeItem(STORAGE_KEYS.ME);
}

/** 현재 로그인된 환자 정보를 편하게 꺼내 쓰기 위한 헬퍼 */
export function getStoredPatient() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * GET /api/v1/me
 * 로그인 후 환자 · 수술 · 병원 정보를 한 번에 조회.
 * (login 응답의 patient보다 더 자세한 정보 — surgery, clinic 포함)
 * @returns {Promise<{
 *   patient: object,
 *   surgery: object,
 *   clinic: object
 * }>}
 */
export async function getMe({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/me", {
    params: { lang: lang ?? getCurrentLang() },
  });
  return data;
}

/** /me 응답을 localStorage에 저장 */
export function saveMeSession(data) {
  localStorage.setItem(STORAGE_KEYS.ME, JSON.stringify(data));
}

/** 저장된 /me 응답을 편하게 꺼내 쓰기 위한 헬퍼 */
export function getStoredMe() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ME);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}