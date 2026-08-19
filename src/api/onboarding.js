import apiClient from "./client";

/**
 * GET /api/v1/onboarding/status
 * 자료 수신 현황(documents) + 처방 등록 여부(prescription) + 다음 단계 진행 가능 여부(can_proceed)
 */
export async function getOnboardingStatus({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/onboarding/status", {
    params: lang ? { lang } : undefined,
  });
  return data;
}

/**
 * GET /api/v1/onboarding/surgery
 * 시술 확인(STEP2) 화면에 그대로 뿌릴 수 있는 rows(label/value) + notice 문구.
 * lang: 개발 편의용 쿼리 파라미터. 생략하면 로그인 시 잠긴 환자 언어로 응답됨.
 */
export async function getSurgeryInfo({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/onboarding/surgery", {
    params: lang ? { lang } : undefined,
  });
  return data;
}

/**
 * GET /api/v1/onboarding/questions
 * 개인변수(STEP3) 화면의 예/아니오 질문 목록 + 귀국일 입력 범위(min/max/default).
 */
export async function getOnboardingQuestions({ lang } = {}) {
  const { data } = await apiClient.get("/api/v1/onboarding/questions", {
    params: lang ? { lang } : undefined,
  });
  return data;
}

/**
 * POST /api/v1/onboarding/complete
 * 개인변수 답변 + 귀국일을 저장하고, 케어 루틴을 생성한 결과 요약을 받는다.
 * @param {{ answers: Record<string, boolean>, returnDate: string }} params
 *   returnDate는 "YYYY-MM-DD" 형식 문자열이어야 함
 */
export async function completeOnboarding({ answers, returnDate }) {
  const { data } = await apiClient.post("/api/v1/onboarding/complete", {
    answers,
    return_date: returnDate,
  });
  return data;
}