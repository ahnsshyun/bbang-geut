import { useCallback, useEffect, useState } from "react";
import { getHome } from "../api/home";

/**
 * /api/v1/home 데이터를 불러오고, 필요할 때(refetch) 다시 불러올 수 있게 하는 훅.
 * 루틴 체크(task-logs PUT) 후 완주율 등을 다시 맞추고 싶을 때 refetch() 호출.
 */
export function useHome() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setError(null);
    return getHome()
      .then((data) => {
        setHome(data);
        return data;
      })
      .catch((err) => {
        setError(err);
        throw err;
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    refetch()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refetch]);

  return { home, loading, error, refetch, setHome };
}