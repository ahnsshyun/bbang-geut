import { useEffect, useState } from "react";
import { getHome } from "../api/home";
import { createCheckin } from "../api/checkins";

// TODO: 기존 체크인을 재사용하는 경우(GET /home에 checkin_id가 이미 있는 경우)
// symptom_terms를 다시 받아올 방법이 명세에 없어서 기본값으로 대체합니다.
// 백엔드에 단일 체크인 조회(GET /checkins/{id}) 같은 엔드포인트가 생기면 교체 필요.
const FALLBACK_SYMPTOM_TERMS = ["swelling", "pain", "bruise"];

/**
 * 오늘(D+N) 체크인의 checkin_id/day/date/symptom_terms를 확보한다.
 * - GET /home의 checkin.checkin_id가 있으면 그걸 재사용 (새로 생성 안 함)
 * - 없으면 POST /checkins로 새로 생성
 * - 혹시 타이밍상 이미 존재해서 409가 나도, 그 응답의 checkin_id로 복구
 */
export function useCheckin() {
  const [checkin, setCheckin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      try {
        const home = await getHome();

        if (home.checkin.checkin_id) {
          if (!cancelled) {
            setCheckin({
              checkinId: home.checkin.checkin_id,
              day: home.day,
              date: home.date,
              symptomTerms: FALLBACK_SYMPTOM_TERMS,
              completed: home.checkin.completed ?? false,
            });
          }
          return;
        }

        const created = await createCheckin();
        if (!cancelled) {
          setCheckin({
            checkinId: created.checkin_id,
            day: created.day,
            date: created.date,
            symptomTerms: created.symptom_terms,
            completed: false,
          });
        }
      } catch (err) {
        const conflictData = err.response?.status === 409 ? err.response?.data : null;
        if (conflictData?.checkin_id) {
          if (!cancelled) {
            setCheckin({
              checkinId: conflictData.checkin_id,
              day: conflictData.day,
              date: conflictData.date,
              symptomTerms: FALLBACK_SYMPTOM_TERMS,
            });
          }
          return;
        }
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  return { checkin, loading, error };
}