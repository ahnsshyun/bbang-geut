import React, { useState } from "react";
import HomeTheme from "../components/HomeTheme";
import { ProgressCard, CheckinBox, RoutineSection, RoutineCard, StatusGroupList } from "../components/HomeBox";
import { useNavigate } from "react-router-dom";
import { RoutineDetailModal, DrugDetailModal } from "../components/Modal";

const ROUTINES = [
  {
    key: "incision",
    icon: "💉",
    title: "절개부 소독",
    meta: "하루 2회",
    description: "절개 부위를 식염수로 적신 뒤 연고를 발라요.",
    totalChecks: 2,
    variant: "default",

    reason: "실밥을 제거하기 전까지 절개 부위의 감염을 예방하고 상처를 청결하게 유지하기 위해 필요해요.",
    steps: ["손을 깨끗이 씻어요", "생리식염수를 묻힌 거즈로 닦아요", "연고를 얇게 발라요"],
    originalQuote: "자가소독은 멸균 거즈와 생리식염수, 처방받은 항생제 연고를 사용하며 하루 1~2회 시행합니다.",
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
  {
    key: "shower",
    icon: "🚿",
    title: "샤워",
    description: "미온수로 짧게",
    status: "caution",
    meta: "주의",
    reason: "수술 초기에는 부목이나 고정 테이프가 물에 젖으면 접착력이 약해질 수 있어요.",
    originalQuote: "샤워는 실밥 제거 전까지 수술 부위가 젖지 않도록 주의하며 짧게 시행합니다.",
  },
  {
    key: "sauna",
    icon: "♨️",
    title: "사우나",
    description: "당분간 금지",
    status: "danger",
    meta: "금지",
    reason: "고온 환경은 붓기를 악화시키고 상처 회복을 늦출 수 있어요.",
    originalQuote: "사우나 및 찜질방은 완전 회복 전까지 금지합니다.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [isCheckedIn] = useState(false);
  const [checks, setChecks] = useState(
    Object.fromEntries(ROUTINES.map((r) => [r.key, 0]))
  );
  const [detailKey, setDetailKey] = useState(null); // 열려있는 상세 모달의 routine key
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false); // 약 모달
  const [statusDetailKey, setStatusDetailKey] = useState(null);

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

  const detailRoutine = ROUTINES.find((r) => r.key === detailKey);
  const detailStatus = TODAY_STATUS_ITEMS.find((s) => s.key === statusDetailKey);

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

      <RoutineSection title="오늘 해야할 케어 루틴">
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
            onOpenDetail={() =>
              routine.variant === "drug"
                ? setIsDrugModalOpen(true)
                : setDetailKey(routine.key)
            }
            variant={routine.variant}
          />
        ))}
      </RoutineSection>

<RoutineSection title="오늘 해도 될까?">
  <StatusGroupList
    items={TODAY_STATUS_ITEMS.map((item) => ({
      ...item,
      onClick: item.status === "ok" ? undefined : () => setStatusDetailKey(item.key),
    }))}
  />
</RoutineSection>

      {detailRoutine && (
        <RoutineDetailModal
          icon={detailRoutine.icon}
          title={detailRoutine.title}
          meta={detailRoutine.meta}
          reason={detailRoutine.reason}
          steps={detailRoutine.steps}
          originalQuote={detailRoutine.originalQuote}
          disclaimer="※ 나란히는 병원 안내문의 내용을 수정하거나 임의 병원 지침을 함께 제공하지 않습니다. 병원마다 관리 방법이 다를 수 있으므로 수술한 병원의 안내를 우선해 주세요."
          onClose={() => setDetailKey(null)}
        />
      )}

            {isDrugModalOpen && (
        <DrugDetailModal
          title="처방약 복용"
          meta="하루 3회 · 식후"
          requiredDrugs={[
            {
              badge: "항생제",
              name: "후로목스정",
              ingredient: "세프카펜피복실염산염 100mg",
              amount: "1정",
              frequency: "3회",
              duration: "6일",
              instruction: "매 식후 30분 경구 복용",
            }
          ]}
          asNeededDrugs={[
            {
              badge: "소염진통제",
              name: "타이레놀정",
              ingredient: "아세트아미노펜정 500mg",
              amount: "1정",
              frequency: "최대 3회",
              duration: "6일",
              instruction: "⚠️ 통증 시 4시간 간격 경구 복용",
            },
          ]}
          periodNote="정기 복용약은 복약 체크로 이어집니다. 필요시 약은 증상에 맞게 복용하세요. 자세한 문의는 병원으로 연락 주세요."
          onClose={() => setIsDrugModalOpen(false)}
        />
      )}

      {detailStatus && (
  <RoutineDetailModal
    icon={detailStatus.icon}
    title={detailStatus.title}
    meta={detailStatus.meta}
    status={detailStatus.status}
    questionLabel={detailStatus.status === "caution" ? "왜 주의해야 하나요?" : "왜 금지인가요?"}
    reason={detailStatus.reason}
    originalQuote={detailStatus.originalQuote}
    disclaimer="※ 나란히는 병원 안내문의 내용을 수정하거나 임의 병원 지침을 함께 제공하지 않습니다. 병원마다 관리 방법이 다를 수 있으므로 수술받은 병원의 안내를 우선해 주세요."
    onClose={() => setStatusDetailKey(null)}
  />
)}

      
    </HomeTheme>
  );
};

export default Home;