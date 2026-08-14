import React, { useState } from "react";
import HomeTheme from "../components/HomeTheme";
import { ProgressCard, CheckinBox, RoutineSection, RoutineCard, StatusGroupList } from "../components/HomeBox";
import { useNavigate } from "react-router-dom";

const ROUTINES = [
  {
    key: "incision",
    icon: "💉",
    title: "절개부 소독",
    meta: "하루 2회",
    description: "절개 부위를 식염수로 적신 뒤 연고를 발라요.",
    totalChecks: 2,
    variant: "default",
  },
  {
    key: "coldpack",
    icon: "🧊",
    title: "냉찜질",
    meta: "하루 4회",
    description: "수술 초기의 붓기와 불편함을 줄이는 데 도움이 돼요.",
    totalChecks: 4,
    variant: "default",
  },
  {
    key: "drug",
    icon: "💊",
    title: "처방약 4종 복용",
    meta: "하루 3회 · 식후",
    description: "",
    totalChecks: 3,
    variant: "drug",
  },
];

const TODAY_STATUS_ITEMS = [
  { key: "wash", icon: "🧼", title: "세안", description: "절개 부위를 피해 가볍게", status: "ok", onClick: () => {} },
  { key: "shower", icon: "🚿", title: "샤워", description: "미온수로 짧게", status: "caution", onClick: () => {} },
  { key: "sauna", icon: "♨️", title: "사우나", description: "당분간 금지", status: "danger", onClick: () => {} },
];

const Home = () => {
  const navigate = useNavigate();
  const [isCheckedIn] = useState(false);
  const [checks, setChecks] = useState(
    Object.fromEntries(ROUTINES.map((r) => [r.key, 0]))
  );

  const dDay = 2;
  const stats = [
    { value: "0 / 10", label: "다시 할 수 있게 된 것" },
    { value: "60%", label: "케어 루틴 완주율" },
    { value: "D+8", label: "세안 가능" },
    { value: "D-12", label: "귀국 (2026.08.17)" },
  ];

  const handleToggle = (key, totalChecks) => (index) => {
    setChecks((prev) => {
      const current = prev[key];
      const next = index < current ? index : index + 1;
      return { ...prev, [key]: next };
    });
  };

  // 4개 항목(처방약 제외) 완료 개수
  const nonDrugRoutines = ROUTINES.filter((r) => r.variant !== "drug");
  const doneCount = nonDrugRoutines.filter(
    (r) => checks[r.key] >= r.totalChecks
  ).length;

  return (
    <HomeTheme bannerTitle="나란히">
      <ProgressCard
        dDay={dDay}
        surgeryDateLabel="2026.08.05"
        stageLabel="1단계 · 초기 안정"
        stats={stats}
        onViewCalendar={() => navigate("/schedule")}
      />

      <CheckinBox done={isCheckedIn} dDay={dDay} />

      <RoutineSection title="오늘의 케어 루틴">
        {ROUTINES.map((routine) => (
          <RoutineCard
            key={routine.key}
            icon={routine.icon}
            title={routine.title}
            meta={routine.meta}
            description={routine.description}
            totalChecks={routine.totalChecks}
            checkedCount={checks[routine.key]}
            onToggleCheck={handleToggle(routine.key, routine.totalChecks)}
            onViewOriginal={() => {}}
            variant={routine.variant}
          />
        ))}
      </RoutineSection>

      <RoutineSection title="오늘 해도 될까?">
        <StatusGroupList items={TODAY_STATUS_ITEMS} />
      </RoutineSection>
    </HomeTheme>
  );
};

export default Home;