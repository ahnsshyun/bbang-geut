// 데이터는 임시 정적 값 (나중에 Context/API로 교체)

import styled from "styled-components";
import StatusBadge from "../components/StatusBadge";
import { useState } from "react";

// --- 임시 정적 데이터 (나중에 실제 phase 계산 로직/props로 교체) ---
const MOCK = {
  day: 3,
  returnDay: 4,
  phaseName: "초기 회복기",
  phaseTip: "자극을 최소화하는 시기예요",
  procedure: "리쥬란 힐러",

  phases: [
    { id: "p1", from: 0, to: 2 },
    { id: "p2", from: 3, to: 6 },
    { id: "p3", from: 7, to: 14 },
  ],
  phaseIdx: 1,

  city: "서울",
  uvi: 9,
  temp: 32,

  bannedText: "음주 · 사우나·온천을 피해주세요.",
  tip: "외출 20분 전 SPF50+, 2–3시간마다 덧발라주세요.",

  actions: [
    { id: "wash", icon: "🧼", label: "세안", note: "미지근한 물로 가볍게", status: "ok" },
    { id: "makeup", icon: "💄", label: "메이크업", note: "포인트 메이크업만 권장", status: "caution" },
    { id: "alcohol", icon: "🍶", label: "음주", note: "회복기엔 피해주세요", status: "no" },
    { id: "sauna", icon: "♨️", label: "사우나·온천", note: "체온 상승 자극 위험", status: "no" },
    { id: "exercise", icon: "🏃", label: "운동", note: "가벼운 산책 정도만", status: "caution" },
  ],
};

function Home() {
  const [showSource, setShowSource] = useState(false);

  return (
    <Wrapper>
      <SummaryCard>
        <SummaryTop>
          <div>
            <DayText>D+{MOCK.day}</DayText>
            <PhaseText>{MOCK.phaseName} — {MOCK.phaseTip}</PhaseText>
          </div>
          <ProcedureBadge>{MOCK.procedure}</ProcedureBadge>
        </SummaryTop>

        <ProgressRow>
          {MOCK.phases.map((p, i) => (
            <ProgressBar key={p.id} $state={i < MOCK.phaseIdx ? "done" : i === MOCK.phaseIdx ? "current" : "todo"} />
          ))}
        </ProgressRow>
        <ProgressLabelRow>
          {MOCK.phases.map((p) => (
            <span key={p.id}>D{p.from}{p.to !== p.from ? `–${p.to}` : ""}</span>
          ))}
        </ProgressLabelRow>
      </SummaryCard>

      <WeatherStrip>
        <span>☀️</span>
        <span>{MOCK.city} · UV {MOCK.uvi} · {MOCK.temp}°C</span>
        
      </WeatherStrip>

      <AiBox onClick={() => setShowSource((v) => !v)}>
        <AiBadge>✨ AI 브리핑</AiBadge>
        <AiHeadline>오늘은 {MOCK.bannedText}</AiHeadline>
        <PhaseText>{MOCK.tip}</PhaseText>

        {showSource && (
          <SourceNote>
            <SourceLine1>병원 승인 프로토콜만 참고 · 진단 아님</SourceLine1>
            <SourceLine2>
              서울피부과의원 · 리쥬란 힐러 프로토콜 v2.1 · 흡수기 지침 근거
              (인터넷 정보를 사용하지 않아요)
            </SourceLine2>
          </SourceNote>
        )}
      </AiBox>

      <SectionTitle>오늘 해도 될까? — 한눈에 보기</SectionTitle>
      <ActionList>
        {MOCK.actions.map((a) => (
          <ActionRow key={a.id}>
            <ActionIcon>{a.icon}</ActionIcon>
            <ActionText>
              <ActionLabel>{a.label}</ActionLabel>
              <ActionNote>{a.note}</ActionNote>
            </ActionText>
            <StatusBadge status={a.status} />
            <ChevronIcon>›</ChevronIcon>
          </ActionRow>
        ))}
      </ActionList>

      <Disclaimer>
        ※ 본 안내는 의료 진단이 아닌, 시술 병원이 승인한 일반 회복 정보입니다.
      </Disclaimer>
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 0 20px;
`;

const SummaryCard = styled.div`
  margin: 0 16px;
  border-radius: ${({ theme }) => theme.radius.card};
  padding: 16px;
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
`;

const SummaryTop = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const DayText = styled.div`
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
`;

const PhaseText = styled.div`
  font-size: 11px;
  opacity: 0.9;
  margin-top: 6px;
`;

const ProcedureBadge = styled.div`
  font-size: 9px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.radius.badge};
  padding: 4px 8px;
`;

const ProgressRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 14px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.badge};
  background: ${({ $state }) =>
    $state === "done" ? "#ffffff" : $state === "current" ? "#fde68a" : "rgba(255,255,255,0.25)"};
`;

const ProgressLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  opacity: 0.8;
  margin-top: 4px;
`;

const WeatherStrip = styled.div`
  margin: 0 16px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.button};
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`;


const AiBox = styled.div`
  margin: 0 16px;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: 16px;
`;

const AiBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryHover};
  margin-bottom: 6px;
`;

const AiHeadline = styled.div`
  font-size: 13.5px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

const SectionTitle = styled.div`
  margin: 4px 16px 0;
  font-size: 11px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textSub};
`;

const ActionList = styled.div`
  margin: 0 16px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  overflow: hidden;
`;

const ActionRow = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ActionIcon = styled.span`
  font-size: 15px;
`;

const ActionText = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActionLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textSub};
`;

const ActionNote = styled.div`
  font-size: 9.5px;
  color: ${({ theme }) => theme.colors.textLight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChevronIcon = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.border};
`;

const Disclaimer = styled.div`
  margin: 4px 16px 0;
  font-size: 9px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const SourceNote = styled.div`
  margin: 7px 0px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.button};
  padding: 10px 14px;
  
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SourceLine1 = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryHover};
`;

const SourceLine2 = styled.div`
  font-size: 9.5px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
  margin-top: 3px;
`;