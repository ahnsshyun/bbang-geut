import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeTheme from "../components/HomeTheme";
import { ProgressCard, CheckinBox, RoutineSection, RoutineCard, StatusGroupList } from "../components/HomeBox";
import { RoutineDetailModal, DrugDetailModal } from "../components/Modal";

import { useHome } from "../hooks/useHome";
import { putTaskLog, getCareItem } from "../api/home";

// TODO: 백엔드 응답의 icon 필드가 지금 전부 빈 문자열("")로 와요.
// 실제 아이콘 값이 채워지기 전까지 FE에서 key 기준으로 임시 매핑합니다.
const TASK_ICON_FALLBACK = {
  sleep45: "🛌",
  walk: "🚶",
  saline: "💧",
  tape: "🩹",
  antisep: "💉",
  ice: "🧊",
  warm: "♨️",
  packing_removal: "🧻",
};

const RULE_ICON_FALLBACK = {
  wash: "🧼",
  makeup: "💄",
  ex: "🏃",
  drink: "🍺",
  glasses: "👓",
  mass: "💆",
  blow: "🤧",
  flight: "✈️",
  sauna: "♨️",
  side: "🛏️",
};

// API status("ok"/"care"/"no") → 컴포넌트 status 토큰("ok"/"caution"/"danger")
const RULE_STATUS_MAP = { ok: "ok", care: "caution", no: "danger" };

const DISCLAIMER =
  "※ 나란히는 병원 안내문의 내용을 수정하거나 임의 병원 지침을 함께 제공하지 않습니다. 병원마다 관리 방법이 다를 수 있으므로 수술한 병원의 안내를 우선해 주세요.";

function careItemErrorMessage(err) {
  const code = err?.response?.data?.error?.code;
  if (code === "ONBOARDING_REQUIRED") return "온보딩이 아직 완료되지 않았어요.";
  if (err?.response?.status === 404) return "이 항목에 대한 안내 정보가 아직 없어요.";
  return "안내 정보를 불러오지 못했어요.";
}

function formatCareItemMeta(item) {
  if (!item) return "";
  if (item.subtitle) return item.subtitle; // medication 전용
  if (item.day_from !== undefined && item.day_to !== undefined) {
    return `D+${item.day_from}~D+${item.day_to} · 하루 ${item.times_per_day}회`;
  }
  return "";
}

function formatOriginalQuote(item) {
  if (!item?.source_text) return "";
  return item.source_ref ? `${item.source_text} (${item.source_ref})` : item.source_text;
}

function formatSurgeryDateLabel(dateStr, day) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - day);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function formatDot(dateStr) {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

const Home = () => {
  const navigate = useNavigate();
  const { home, loading, error, refetch } = useHome();

  // 루틴 체크 상태는 즉각적인 클릭 반응을 위해 로컬에도 보관 (home.tasks의 done_count로 초기화)
  const [checks, setChecks] = useState({});
  const [detailKey, setDetailKey] = useState(null); // 열려있는 상세 모달의 task key
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false);
  const [statusDetailKey, setStatusDetailKey] = useState(null);

  // 근거시트(care-items) — 응답 필드가 아직 명세에 없어 방어적으로 사용
  const [careItem, setCareItem] = useState(null);
  const [careItemLoading, setCareItemLoading] = useState(false);
  const [careItemError, setCareItemError] = useState(null);

  useEffect(() => {
    if (!home) return;
    setChecks(Object.fromEntries(home.tasks.map((t) => [t.key, t.done_count])));
  }, [home]);

  // 상세 모달 열릴 때 근거시트 불러오기
  useEffect(() => {
    const activeKey = detailKey ?? statusDetailKey;
    const kind = detailKey ? "task" : statusDetailKey ? "rule" : null;
    if (!activeKey || !kind) {
      setCareItem(null);
      setCareItemError(null);
      return undefined;
    }

    let cancelled = false;
    setCareItemLoading(true);
    setCareItem(null);
    setCareItemError(null);

    getCareItem({ kind, key: activeKey, day: home?.day })
      .then((data) => {
        if (!cancelled) setCareItem(data);
      })
      .catch((err) => {
        if (!cancelled) setCareItemError(err);
      })
      .finally(() => {
        if (!cancelled) setCareItemLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [detailKey, statusDetailKey]);

  if (loading) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>불러오는 중이에요...</p>
      </HomeTheme>
    );
  }

  if (error || !home) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>정보를 불러오지 못했어요. 네트워크 상태를 확인해 주세요.</p>
        <button type="button" onClick={() => refetch()}>
          다시 시도
        </button>
      </HomeTheme>
    );
  }

  const { day, date, stage, summary, checkin, tasks, rules } = home;

  const stats = [
    { value: `${summary.unlocked_count} / ${summary.unlocked_total}`, label: "다시 할 수 있게 된 것" },
    { value: `${Math.round(summary.completion_rate * 100)}%`, label: "케어 루틴 완주율" },
    {
      value: summary.next_unlock ? `D+${summary.next_unlock.day}` : "-",
      label: summary.next_unlock ? summary.next_unlock.label.split(" — ")[0] : "다음 해금",
    },
    { value: `D-${summary.return_dn}`, label: `귀국 (${formatDot(summary.return_date)})` },
  ];

  const handleToggle = (task) => async (index) => {
    const current = checks[task.key] ?? task.done_count;
    const next = index < current ? index : index + 1;
    const prev = checks[task.key];

    // 낙관적 업데이트로 먼저 화면 반영
    setChecks((prevChecks) => ({ ...prevChecks, [task.key]: next }));

    try {
      await putTaskLog({ taskKey: task.key, date, doneCount: next });
    } catch (err) {
      // 실패하면 되돌리기
      setChecks((prevChecks) => ({ ...prevChecks, [task.key]: prev }));
      alert("체크 저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const statusItems = ["ok", "care", "no"].flatMap((group) =>
    (rules[group]?.items ?? []).map((item) => ({
      key: item.key,
      icon: item.icon || RULE_ICON_FALLBACK[item.key] || "•",
      title: item.name,
      description: item.text,
      status: RULE_STATUS_MAP[item.status] ?? "ok",
    }))
  );

  const detailTask = tasks.find((t) => t.key === detailKey);
  const detailStatus = statusItems.find((s) => s.key === statusDetailKey);

  return (
    <HomeTheme bannerTitle="나란히">
      <ProgressCard
        dDay={day}
        surgeryDateLabel={formatSurgeryDateLabel(date, day)}
        stageLabel={stage}
        stats={stats}
        onViewCalendar={() => navigate("/schedule")}
      />

      <CheckinBox done={checkin.completed} dDay={day} />

      <RoutineSection title="오늘 해야할 케어 루틴">
        {tasks.map((task) => (
          <RoutineCard
            key={task.key}
            icon={task.icon || TASK_ICON_FALLBACK[task.key] || "📝"}
            title={task.name}
            meta={`하루 ${task.times_per_day}회`}
            description=""
            totalChecks={task.times_per_day}
            checkedCount={checks[task.key] ?? task.done_count}
            onToggleCheck={handleToggle(task)}
            onOpenDetail={() => setDetailKey(task.key)}
            variant="default"
            // TODO: 처방약 태스크를 구분하는 필드(예: source === "prescription")가
            // 아직 명세에 명확하지 않아 지금은 모든 태스크를 "default" variant로 표시합니다.
            // "처방약 N종 복용" 카드(변형된 노란 카드 + DrugDetailModal)는 실제 구분 기준 확인 후 연결 예정.
          />
        ))}
      </RoutineSection>

      <RoutineSection title="오늘 해도 될까?">
        <StatusGroupList
          items={statusItems.map((item) => ({
            ...item,
            onClick: item.status === "ok" ? undefined : () => setStatusDetailKey(item.key),
          }))}
        />
      </RoutineSection>

      {detailTask && (
        <RoutineDetailModal
          icon={careItem?.icon || detailTask.icon || TASK_ICON_FALLBACK[detailTask.key] || "📝"}
          title={careItem?.name || detailTask.name}
          meta={careItemLoading ? "" : formatCareItemMeta(careItem) || `하루 ${detailTask.times_per_day}회`}
          reason={
            careItemLoading
              ? "불러오는 중이에요..."
              : careItemError
              ? careItemErrorMessage(careItemError)
              : careItem?.why ?? "아직 안내 정보가 준비되지 않았어요."
          }
          originalQuote={formatOriginalQuote(careItem)}
          disclaimer={DISCLAIMER}
          onClose={() => setDetailKey(null)}
        />
      )}

      {isDrugModalOpen && (
        <DrugDetailModal
          title="처방약 복용"
          meta=""
          requiredDrugs={[]}
          asNeededDrugs={[]}
          periodNote="처방약 정보 연동은 준비 중이에요. 자세한 문의는 병원으로 연락 주세요."
          onClose={() => setIsDrugModalOpen(false)}
        />
      )}

      {detailStatus && (
        <RoutineDetailModal
          icon={careItem?.icon || detailStatus.icon}
          title={careItem?.name || detailStatus.title}
          meta={careItem?.current?.text ?? detailStatus.description}
          status={detailStatus.status}
          questionLabel={detailStatus.status === "caution" ? "왜 주의해야 하나요?" : "왜 금지인가요?"}
          reason={
            careItemLoading
              ? "불러오는 중이에요..."
              : careItemError
              ? careItemErrorMessage(careItemError)
              : careItem?.why ?? detailStatus.description
          }
          originalQuote={formatOriginalQuote(careItem)}
          disclaimer={DISCLAIMER}
          onClose={() => setStatusDetailKey(null)}
        />
      )}
    </HomeTheme>
  );
};

export default Home;