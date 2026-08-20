import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeTheme from "../components/Theme/HomeTheme";
import { ProgressCard, CheckinBox, RoutineSection, RoutineCard, StatusGroupList } from "../components/Box/HomeBox";
import { RoutineDetailModal, DrugDetailModal } from "../components/Modal/Modal";

import { useHome } from "../hooks/useHome";
import { putTaskLog, getCareItem } from "../api/home";
import { useLang } from "../hooks/useLang";
import { getStoredPatient } from "../api/auth";

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

const RULE_STATUS_MAP = { ok: "ok", care: "caution", no: "danger" };

function careItemErrorMessage(err, t) {
  const code = err?.response?.data?.error?.code;
  if (code === "ONBOARDING_REQUIRED") return t("onboardingRequired");
  if (err?.response?.status === 404) return t("careItemNotFound");
  return t("careItemLoadError");
}

function formatCareItemMeta(item, t) {
  if (!item) return "";
  if (item.subtitle) return item.subtitle;
  if (item.day_from !== undefined && item.day_to !== undefined) {
    return `D+${item.day_from}~D+${item.day_to} · ${t("perDay")} ${item.times_per_day}${t("times")}`;
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
  const { t } = useLang();

  const [checks, setChecks] = useState({});
  const [detailKey, setDetailKey] = useState(null);
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false);
  const [statusDetailKey, setStatusDetailKey] = useState(null);

  const [careItem, setCareItem] = useState(null);
  const [careItemLoading, setCareItemLoading] = useState(false);
  const [careItemError, setCareItemError] = useState(null);

  useEffect(() => {
    if (!home) return;
    setChecks(Object.fromEntries(home.tasks.map((t) => [t.key, t.done_count])));
  }, [home]);

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

   const patient = getStoredPatient();
   const lang = patient?.lang || "ko";

    getCareItem({ kind, key: activeKey, day: home?.day, lang })
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
        <p>{t("loading")}</p>
      </HomeTheme>
    );
  }

  if (error || !home) {
    return (
      <HomeTheme bannerTitle="나란히">
        <p>{t("loadError")}</p>
        <button type="button" onClick={() => refetch()}>
          {t("retry")}
        </button>
      </HomeTheme>
    );
  }

  const { day, date, stage, summary, checkin, tasks, rules } = home;

  const stats = [
    { value: `${summary.unlocked_count} / ${summary.unlocked_total}`, label: t("homeUnlocked") },
    { value: `${Math.round(summary.completion_rate * 100)}%`, label: t("homeCompletionRate") },
    {
      value: summary.next_unlock ? `D+${summary.next_unlock.day}` : "-",
      label: summary.next_unlock ? summary.next_unlock.label.split(" — ")[0] : t("homeNextUnlock"),
    },
    { value: `D-${Math.abs(summary.return_dn)}`, label: `${t("homeReturn")} (${formatDot(summary.return_date)})` },
  ];

  const handleToggle = (task) => async (index) => {
    const current = checks[task.key] ?? task.done_count;
    const next = index < current ? index : index + 1;
    const prev = checks[task.key];

    setChecks((prevChecks) => ({ ...prevChecks, [task.key]: next }));

    try {
      await putTaskLog({ taskKey: task.key, date, doneCount: next });
    } catch (err) {
      setChecks((prevChecks) => ({ ...prevChecks, [task.key]: prev }));
      alert(t("checkSaveFail"));
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

      <RoutineSection title={t("homeTodayRoutine")}>
        {tasks.map((task) => (
          <RoutineCard
            key={task.key}
            icon={task.icon || TASK_ICON_FALLBACK[task.key] || "📝"}
            title={task.name}
            meta={`${t("perDay")} ${task.times_per_day}${t("times")}`}
            description=""
            totalChecks={task.times_per_day}
            checkedCount={checks[task.key] ?? task.done_count}
            onToggleCheck={handleToggle(task)}
            onOpenDetail={() => setDetailKey(task.key)}
            variant="default"
          />
        ))}
      </RoutineSection>

      <RoutineSection title={t("homeTodayStatus")}>
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
          meta={careItemLoading ? "" : formatCareItemMeta(careItem, t) || `${t("perDay")} ${detailTask.times_per_day}${t("times")}`}
          reason={
            careItemLoading
              ? t("loadingCareItem")
              : careItemError
              ? careItemErrorMessage(careItemError, t)
              : careItem?.why ?? t("noGuideYet")
          }
          originalQuote={formatOriginalQuote(careItem)}
          disclaimer={t("disclaimer")}
          onClose={() => setDetailKey(null)}
        />
      )}

      {isDrugModalOpen && (
        <DrugDetailModal
          title={t("drugTitle")}
          meta=""
          requiredDrugs={[]}
          asNeededDrugs={[]}
          periodNote={t("drugPending")}
          onClose={() => setIsDrugModalOpen(false)}
        />
      )}

      {detailStatus && (
        <RoutineDetailModal
          icon={careItem?.icon || detailStatus.icon}
          title={careItem?.name || detailStatus.title}
          meta={careItem?.current?.text ?? detailStatus.description}
          status={detailStatus.status}
          questionLabel={detailStatus.status === "caution" ? t("whyCaution") : t("whyDanger")}
          reason={
            careItemLoading
              ? t("loadingCareItem")
              : careItemError
              ? careItemErrorMessage(careItemError, t)
              : careItem?.why ?? detailStatus.description
          }
          originalQuote={formatOriginalQuote(careItem)}
          disclaimer={t("disclaimer")}
          onClose={() => setStatusDetailKey(null)}
        />
      )}
    </HomeTheme>
  );
};

export default Home;