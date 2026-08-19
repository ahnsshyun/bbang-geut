import { useEffect, useState } from "react";
import { getOnboardingStatus } from "../api/onboarding";
import { getCurrentLang } from "./useLang";

/**
 * 자료 수신/처방 등록 현황은 사용자 행동(처방 등록 등)에 따라 계속 바뀌는 값이라
 * useMe처럼 localStorage에 오래 캐시하지 않고, 화면 진입마다 새로 불러온다.
 */
export function useOnboardingStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const lang = getCurrentLang();

    getOnboardingStatus({ lang })
      .then((data) => {
        if (!cancelled) setStatus(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { status, loading, error };
}