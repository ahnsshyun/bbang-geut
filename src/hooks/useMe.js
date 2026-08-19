import { useEffect, useState } from "react";
import { getMe, getStoredMe, saveMeSession } from "../api/auth";
import { getCurrentLang } from "./useLang";

/**
 * /api/v1/me 응답(환자·수술·병원 정보)을 불러오는 훅.
 * localStorage에 캐시가 있으면 그걸 먼저 쓰고, 없으면 API를 호출해서 채운다.
 * 여러 온보딩 화면(자료수신, 시술확인 등)에서 공통으로 재사용.
 */
export function useMe() {
  const [me, setMe] = useState(() => getStoredMe());
  const [loading, setLoading] = useState(!me);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (me) return undefined;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const lang = getCurrentLang();

    getMe({ lang })
      .then((data) => {
        if (cancelled) return;
        saveMeSession(data);
        setMe(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [me]);

  return { me, loading, error };
}