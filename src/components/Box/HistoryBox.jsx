import styled from "styled-components";
import COLORS from "../../styles/colors";
import FONTS, { font } from "../../styles/fonts";
import { InfoBox, InfoRow } from "./Box";
import { useLang } from "../../hooks/useLang";

/* ============================================================
   PhotoTimelineBox — 사진 타임라인
============================================================ */
const TimelineSectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const SectionTitleText = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 0;
`;

const PhotoScrollRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const PhotoCard = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  background: ${({ $hasImage }) => ($hasImage ? "#e0e0e0" : "linear-gradient(180deg, #B8A9F5, #8C6FEC)")};
  display: flex;
  align-items: flex-end;
  padding: 8px;
  box-sizing: border-box;
`;

const PhotoCardImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoCardLabel = styled.span`
  ${font("boldbody")}
  font-size: 12px;
  color: #ffffff;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
`;


/**
 * props:
 * - photos: [{ label }]  // D+n 라벨들
 * - progressPercent: 진행률(0~100), 하단 바 표시용
 */
export function PhotoTimelineBox({ photos = [], progressPercent = 0 }) {
  const { t } = useLang();
  return (
    <div>
      <TimelineSectionTitle>
        <SectionTitleText>{t("photoTimeline")}</SectionTitleText>
      </TimelineSectionTitle>

      <PhotoScrollRow>
        {photos.map((p, i) => (
          <PhotoCard key={i} $hasImage={!!p.url}>
            {p.url && <PhotoCardImg src={p.url} alt={p.label} />}
            <PhotoCardLabel>{p.label}</PhotoCardLabel>
          </PhotoCard>
        ))}
      </PhotoScrollRow>

    </div>
  );
}

/* ============================================================
   SymptomFlowBox — 증상 흐름 (부기/통증/멍 막대 그래프)
============================================================ */
const SymptomGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SymptomHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const SymptomLabel = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: ${COLORS.main};
`;

const BarRow = styled.div`
  display: flex;
  gap: 1px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

const BarItem = styled.div`
  flex-shrink: 0;
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const BarTrack = styled.div`
  width: 60px;
  height: 70px;
  border-radius: 6px;
  background: ${COLORS.background_lightpurple};
  display: flex;
  align-items: flex-end;
  overflow: hidden;
`;

const BarFill = styled.div`
  width: 100%;
  height: ${({ $level }) => $level * 20}%;
  background: linear-gradient(180deg, ${COLORS.main}, ${COLORS.sub});
  border-radius: 6px 6px 0 0;
`;

const BarDayLabel = styled.span`
  ${font("regbody")}
  color: ${COLORS.text_gray};
`;

/**
 * props:
 * - symptoms: [{ key, label, days: [{ label, level }] }]
 */
export function SymptomFlowBox({ symptoms = [], rangeLabel }) {
  const { t } = useLang();
  return (
    <div>
      <TimelineSectionTitle>
        <SectionTitleText>{t("symptomFlow")}</SectionTitleText>
      </TimelineSectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {symptoms.map((symptom) => (
          <SymptomGroup key={symptom.key}>
            <SymptomHeader>
              <SymptomLabel>{symptom.label}</SymptomLabel>
            </SymptomHeader>
            <BarRow>
              {symptom.days.map((day, i) => (
                <BarItem key={i}>
                  <BarTrack>
                    <BarFill $level={day.level} />
                  </BarTrack>
                  <BarDayLabel>{day.label}</BarDayLabel>
                </BarItem>
              ))}
            </BarRow>
          </SymptomGroup>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   NoCheckinState — 체크인 기록 없음 안내
============================================================ */
const EmptyStateWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px 0;
`;

const EmptyStateText = styled.p`
  ${font("semibody")}
  color: ${COLORS.text_gray};
  margin: 0;
`;

export function NoCheckinState() {
  const { t } = useLang();
  return (
    <EmptyStateWrap>
      <span style={{ fontSize: 32 }}>❕</span>
      <EmptyStateText>{t("noCheckinRecord")}</EmptyStateText>
    </EmptyStateWrap>
  );
}

/* ============================================================
   HospitalAlertBox — 의료기관 전달 안내
============================================================ */
const AlertBoxEl = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 15px;
  border-radius: 16px;
  background: #FFFBEF;
  border: 1px solid #F5D678;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AlertTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #8A6300;
  margin: 0;
`;

const AlertText = styled.p`
  ${font("regbody")}
  line-height: 1.6;
  color: #a87c02;
  margin: 0;

  b {
    ${font("boldbody")}
    font-size: 12px;
    color: #8A6300;
  }
`;

/**
 * props:
 * - title
 * - children: 본문 내용 (b 태그로 강조 가능)
 */
export function HospitalAlertBox({ title, children }) {
  const { t } = useLang();
  return (
    <AlertBoxEl>
      <AlertTitle>{title ?? t("hospitalAlertTitle")}</AlertTitle>
      <AlertText>{children}</AlertText>
    </AlertBoxEl>
  );
}

/* ============================================================
   StatCardRow — 체크인 기록 / 증상 변화 / 루틴 이행률 3칸 통계
============================================================ */
const StatCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0px 30px 0px;;
`;

const StatCardEl = styled.div`
  box-sizing: border-box;
  padding: 16px 12px;
  border-radius: 11px;
  background: linear-gradient(180deg, #ffffff,${({ $tone }) => STAT_TONE[$tone].bg});
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 130px;
`;

const STAT_TONE = {
  green: { bg: "#EAF7EF", iconBg: "#D3F0DF" },
  purple: { bg: COLORS.background_lightpurple, iconBg: "#E4DEFB" },
  orange: { bg: "#FFF1EC", iconBg: "#FFE1D3" },
};

const StatIconWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $tone }) => STAT_TONE[$tone].iconBg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
`;

const StatLabel = styled.span`
  ${font("semibody")}
  color: ${COLORS.text_gray};
  margin: 10px 0px 5px 0px;
`;

const StatValue = styled.span`
  ${font("boldbody")}
  font-size: 18px;
  color: #111111;
  margin-top: auto;
`;

/**
 * props:
 * - stats: [{ key, icon, label, value, tone }]  // tone: "green" | "purple" | "orange"
 */
export function StatCardRow({ stats = [] }) {
  return (
    <StatCardGrid>
      {stats.map((stat) => (
        <StatCardEl key={stat.key} $tone={stat.tone}>
          <StatIconWrap $tone={stat.tone}>{stat.icon}</StatIconWrap>
          <StatLabel>{stat.label}</StatLabel>
          <StatValue>{stat.value}</StatValue>
        </StatCardEl>
      ))}
    </StatCardGrid>
  );
}

/* ============================================================
   SymptomChangeList — 증상 변화 리스트 (↑↓— + 배지)
============================================================ */
const SymptomSectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 20px 0 12px;
`;

const SymptomChangeTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SymptomChangeName = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
`;

const TrendIcon = styled.span`
  font-size: 20px;
  color: ${({ $trend }) =>
    $trend === "up" ? COLORS.error : $trend === "down" ? COLORS.text_green : COLORS.text_gray};
`;

const SymptomChangeDesc = styled.p`
  ${font("regbody")}
  font-size: 13px;
  line-height: 1.6;
  color: ${COLORS.text_gray};
  margin: 0;
`;

const TREND_ICON = { up: "↑", down: "↓", same: "···" };

/**
 * props:
 * - items: [{ key, label, trend: "up"|"down"|"same", desc }]
 */
export function SymptomChangeList({ items = [] }) {
  const { t } = useLang();
  return (
    <div>
      <SymptomSectionTitle>{t("symptomChangeTitle")}</SymptomSectionTitle>
      <InfoBox style={{background: `${COLORS.background_lightpurple}4D`, border: "none", boxShadow: "0px 4px rgba(0, 0, 0, 0.04)"}}>
        {items.map((item) => (
          <InfoRow key={item.key} style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <SymptomChangeTitleRow>
              <SymptomChangeName>{item.label}</SymptomChangeName>
              <TrendIcon $trend={item.trend}>{TREND_ICON[item.trend]}</TrendIcon>
            </SymptomChangeTitleRow>
            <SymptomChangeDesc>{item.desc}</SymptomChangeDesc>
          </InfoRow>
        ))}
      </InfoBox>
    </div>
  );
}

/* ============================================================
   RoutineDonutRow — 셀프 케어 루틴 이행 (도넛 차트 3개)
============================================================ */
const DonutSectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 40px 0 15px;
`;

const DonutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const DonutCard = styled.div`
  box-sizing: border-box;
  padding: 10px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid ${COLORS.border};
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  margin-bottom: 40px;
`;

const DonutDay = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: ${COLORS.main};
  min-height: 36px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DonutDate = styled.span`
  ${font("boldbody")}
  color: ${COLORS.text_gray};
  margin-bottom: 8px;
`;

const DonutSvgWrap = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
`;

const DonutPercentText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
`;

function DonutChart({ percent, id }) {
  const size = 80;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const gradientId = `donutGradient-${id}`;

  return (
    <DonutSvgWrap>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B6FF6" />
            <stop offset="50%" stopColor="#4080F6" />
            <stop offset="100%" stopColor="#A358F7" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS.background_lightpurple}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <DonutPercentText>{percent}%</DonutPercentText>
    </DonutSvgWrap>
  );
}

/**
 * props:
 * - days: [{ key, dLabel, dateLabel, percent }]
 */
export function RoutineDonutRow({ days = [] }) {
  const { t } = useLang();
  return (
    <div>
      <DonutSectionTitle>{t("routineDonutTitle")}</DonutSectionTitle>
      <DonutGrid>
        {days.map((day) => (
          <DonutCard key={day.key}>
            <DonutDay>{day.dLabel}</DonutDay>
            <DonutDate>{day.dateLabel}</DonutDate>
            <DonutChart percent={day.percent} id={day.key} />
          </DonutCard>
        ))}
      </DonutGrid>
    </div>
  );
}