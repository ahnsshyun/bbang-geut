import styled from "styled-components";
import COLORS from "../../styles/colors";
import FONTS, { font } from "../../styles/fonts";
import { useLang } from "../../hooks/useLang";

/* ============================================================
   1. ProgressCard — D+n 진행 상황 카드
============================================================ */
const ProgressCardEl = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #725BEF 0%, #9763EE 49%, #AD68EE 90%);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DDayTitle = styled.h1`
  ${font("display")}
  font-size: 32px;
  color: #ffffff;
  margin: 0;
`;

const StageBadge = styled.span`
  ${font("boldbody")}
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
`;

const SubText = styled.p`
  ${font("regbody")}
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 14px;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.25);
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  border-radius: 6px;
  background: #ffffff;
`;

const ProgressLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  ${font("regbody")}
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin: 6px 0 20px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
`;

const StatBox = styled.div`
  box-sizing: border-box;
  padding: 10px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  ${font("heading")}
  font-size: 18px;
  color: #ffffff;
`;

const StatLabel = styled.span`
  ${font("boldbody")}
  color: #ffffff;
`;

const CalendarLinkButton = styled.button`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 0;
  border-radius: 11px;
  border: 0.4px solid #ffffff;
  background: rgba(255, 255, 255, 0.2);
  ${font("boldbody")}
  color: #ffffff;
  cursor: pointer;
`;

export function ProgressCard({ dDay, surgeryDateLabel, stageLabel, stats = [], onViewCalendar }) {
  const progressPercent = (dDay / 120) * 100;
  const { t } = useLang();

  return (
    <ProgressCardEl>
      <CardTop>
        <DDayTitle>D+{dDay}</DDayTitle>
        <StageBadge>{stageLabel}</StageBadge>
      </CardTop>
      
      <SubText>{t("postSurgeryDay")} {dDay}{t("postSurgeryDayUnit")} · {surgeryDateLabel}</SubText>

      <ProgressBarTrack>
        <ProgressBarFill style={{ width: `${progressPercent}%` }} />
      </ProgressBarTrack>

      <ProgressLabelRow>
        <span>D+0 {t("surgery")}</span>
        <span>{t("fullRecovery")} D+120</span>
      </ProgressLabelRow>

      <StatGrid>
        {stats.map((stat) => (
          <StatBox key={stat.label}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatBox>
        ))}
      </StatGrid>

      <CalendarLinkButton type="button" onClick={onViewCalendar}>
        {t("viewSchedule")} →
      </CalendarLinkButton>
    </ProgressCardEl>
  );
}

/* ============================================================
   2. CheckinBox — 오늘 체크인 여부 안내 박스
============================================================ */
const CheckinBoxEl = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin-top: 12px;
  padding: 16px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ $done }) => ($done ? "#EAF7EF" : "#C3C3C3")};
  border: 0.6px solid
    ${({ $done }) => ($done ? "rgba(189, 255, 220, 0.7)" : "rgba(104, 104, 104, 0.2)")};
`;

const CheckinIcon = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${font("boldbody")}
  font-size: 13px;
  color: ${({ $done }) => ($done ? "#ffffff" : COLORS.text_gray)};
  background: ${({ $done }) => ($done ? COLORS.text_green : "#ffffff")};
`;

const CheckinTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CheckinTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: ${({ $done }) => ($done ? COLORS.text_green : "#ffffff")};
  margin: 0;
`;

const CheckinDesc = styled.p`
  ${font("boldbody")}
  color: ${({ $done }) => ($done ? COLORS.greey : COLORS.greey)};
  margin: 0;
`;

export function CheckinBox({ done, dDay }) {
  const { t } = useLang();

  return (
    <CheckinBoxEl $done={done}>
      <CheckinIcon $done={done}>{done ? "✓" : "•••"}</CheckinIcon>
      <CheckinTextGroup>
        {done ? (
          <>
            <CheckinTitle $done>D+{dDay} {t("checkinDoneTitle")}</CheckinTitle>
            <CheckinDesc $done>{t("checkinDoneDesc")}</CheckinDesc>
          </>
        ) : (
          <>
            <CheckinTitle>{t("checkinNotDoneTitle")}</CheckinTitle>
            <CheckinDesc>{t("checkinNotDoneDesc")}</CheckinDesc>
          </>
        )}
      </CheckinTextGroup>
    </CheckinBoxEl>
  );
}

/* ============================================================
   3. RoutineCard — 오늘의 케어 루틴 카드
   variant: "default"(연보라 완료) | "drug"(노란 처방약 카드)
============================================================ */
const RoutineCardEl = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  border-radius: 11px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  background: ${({ $variant, $allChecked }) => {
    if ($allChecked) {
      return $variant === "drug" ? "#FFF3CD" : COLORS.background_lightpurple;
    }
    return $variant === "drug" ? "#FFFBEF" : "#ffffff";
  }};
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background 0.15s ease;
`;

const RoutineTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const RoutineTitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
`;

const RoutineIconWrap = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${({ $variant }) => ($variant === "drug" ? "#FFF3CD" : COLORS.background_lightpurple)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const RoutineTextGroup = styled.div`
  min-width: 0;
`;

const RoutineTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
  margin: 0 0 2px;
`;

const RoutineMeta = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  margin: 0;
`;

const RoutineDesc = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  margin: 0;
  white-space: pre-line;
`;

const CheckGroup = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 6px;
`;

const CheckCircle = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid ${({ $checked, $variant }) =>
      $checked ? "transparent" : $variant === "drug" ? "#E0A800" : COLORS.sub};
  background: ${({ $checked, $variant }) =>
    $checked ? ($variant === "drug" ? "#E0A800" : COLORS.main) : "#ffffff"};

  color: ${({ $checked, $variant }) =>
      $checked ? "#ffffff" : $variant === "drug" ? "#E0A800" : COLORS.main};
  ${font("boldbody")}

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
`;

export function RoutineCard({
  icon,
  title,
  meta,
  description,
  totalChecks,
  checkedCount,
  onToggleCheck,
  onOpenDetail,
  variant = "default",
}) {
  const allChecked = checkedCount >= totalChecks;
  const { t } = useLang();

  return (
    <RoutineCardEl
      $variant={variant}
      $allChecked={allChecked}
      onClick={onOpenDetail}
    >
      <RoutineTop>
        <RoutineTitleGroup>
          <RoutineIconWrap $variant={variant}>{icon}</RoutineIconWrap>
          <RoutineTextGroup>
            <RoutineTitle>{title}</RoutineTitle>
            <RoutineMeta>{meta}</RoutineMeta>
          </RoutineTextGroup>
        </RoutineTitleGroup>

        <CheckGroup>
          {Array.from({ length: totalChecks }).map((_, i) => {
            const checked = i < checkedCount;
            return (
              <CheckCircle
                key={i}
                type="button"
                $checked={checked}
                $variant={variant}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheck(i);
                }}
                aria-label={`${i + 1}${t("checkLabel")} ${checked ? t("uncheckAction") : t("checkAction")}`}
              >
                {checked ? "✓" : i + 1}
              </CheckCircle>
            );
          })}
        </CheckGroup>
      </RoutineTop>

      <RoutineDesc>{description}</RoutineDesc>
    </RoutineCardEl>
  );
}

/* ============================================================
   4. RoutineSection — "오늘 해야할 케어 루틴" 섹션 래퍼
============================================================ */
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h2`
  ${font("boldbody")}
  color: #111111;
  margin: 0;
`;

export function RoutineSection({ title, doneCount, totalCount, children }) {
  return (
    <SectionWrapper>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
      </SectionHeader>
      {children}
    </SectionWrapper>
  );
}

/* ============================================================
   5. StatusSection — "오늘 해도 될까?" 섹션 안의 가능/주의/금지
============================================================ */
const STATUS_STYLE = {
  ok: {
    dotColor: COLORS.text_green,
    badgeBg: "#E7F7EE",
    cardBorder: "#CDEBDB",
  },
  caution: {
    dotColor: "#E0A800",
    badgeBg: "#FFF3CD",
    cardBorder: "#fde394",
  },
  danger: {
    dotColor: COLORS.error,
    badgeBg: "#FDEAEA",
    cardBorder: "#F5C6C6",
  },
};

const StatusGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StatusGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_STYLE[$status].dotColor};
`;

const StatusGroupLabel = styled.p`
  ${font("boldbody")}
  color: ${COLORS.text_gray};
  margin: 0;
`;

const StatusCardEl = styled.button`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ $status }) => STATUS_STYLE[$status].cardBorder};
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const StatusIconWrap = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ $status }) => STATUS_STYLE[$status].badgeBg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const StatusTextGroup = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatusTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
  margin: 0;
`;

const StatusDesc = styled.p`
  ${font("regbody")}
  font-size: 12px;
  color: ${COLORS.text_gray};
  margin: 0;
`;

export function StatusCard({ icon, title, description, status, onClick }) {
  return (
    <StatusCardEl type="button" $status={status} onClick={onClick}>
      <StatusIconWrap $status={status}>{icon}</StatusIconWrap>
      <StatusTextGroup>
        <StatusTitle>{title}</StatusTitle>
        <StatusDesc>{description}</StatusDesc>
      </StatusTextGroup>
    </StatusCardEl>
  );
}

export function StatusGroupList({ items = [] }) {
  const order = ["ok", "caution", "danger"];
  const { t } = useLang();
  const STATUS_LABEL_KEY = { ok: "statusOk", caution: "statusCaution", danger: "statusDanger" };


  return (
    <>
      {order.map((status) => {
        const group = items.filter((item) => item.status === status);
        if (group.length === 0) return null;

        return (
          <StatusGroup key={status}>
            <StatusGroupHeader>
              <StatusDot $status={status} />
              <StatusGroupLabel>
                {t(STATUS_LABEL_KEY[status])}
              </StatusGroupLabel>
            </StatusGroupHeader>

            {group.map((item) => (
              <StatusCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                status={status}
                onClick={item.onClick}
              />
            ))}
          </StatusGroup>
        );
      })}
    </>
  );
}

/* ============================================================
   6. TimelineSection — "앞으로의 변화" 리스트
============================================================ */
const TIMELINE_STATUS_STYLE = {
  visit: { bg: COLORS.background_lightpurple, color: COLORS.main, labelKey: "badgeVisit" },
  complete: { bg: COLORS.main, color: "#ffffff", labelKey: "badgeComplete" },
  ok: { bg: "#E7F7EE", color: COLORS.text_green, labelKey: "statusOk" },
  caution: { bg: "#FFF3CD", color: "#8A6300", labelKey: "statusCaution" },
  danger: { bg: "#FDEAEA", color: COLORS.error, labelKey: "statusDanger" },
  return: { bg: "#E3F2FD", color: "#1976D2", labelKey: "badgeReturn" },
  remote: { bg: "#EFEFEF", color: COLORS.text_gray, labelKey: "badgeRemote" },
  unlock: { bg: "#E7F7EE", color: COLORS.text_green, labelKey: "badgeUnlock" },
};

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0px 10px 10px 1px rgba(0, 0, 0, 0.05);
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;

  & + & {
    border-top: 1px solid ${COLORS.border};
  }
`;

const TimelineDate = styled.span`
  flex-shrink: 0;
  width: 62px;
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.text_gray};
`;

const TimelineDDay = styled.span`
  flex-shrink: 0;
  width: 34px;
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.greey};
`;

const TimelineLabel = styled.span`
  flex: 1;
  min-width: 0;
  ${font("boldbody")}
  font-size: 13px;
  color: #111111;
`;

const TimelineBadge = styled.span`
  flex-shrink: 0;
  ${font("boldbody")}
  font-size: 12px;
  color: ${({ $status }) => TIMELINE_STATUS_STYLE[$status]?.color ?? COLORS.text_gray};
  background: ${({ $status }) => TIMELINE_STATUS_STYLE[$status]?.bg ?? "#EFEFEF"};
  padding: 5px 12px;
  border-radius: 20px;
  white-space: nowrap;
`;

/**
 * props:
 * - items: [{ key, date, dDay, label, status, badgeLabel? }]
 *   status: "visit" | "complete" | "ok" | "caution" | "danger" | "return" | "remote" | "unlock"
 *   badgeLabel을 주면 뱃지 텍스트로 그걸 우선 사용(서버가 이미 번역해서 준 문구가 있을 때).
 */
export function TimelineSection({ items = [] }) {
  const { t } = useLang();

  return (
    <TimelineWrapper>
      {items.map((item) => (
        <TimelineRow key={item.key}>
          <TimelineDate>{item.date}</TimelineDate>
          <TimelineDDay>{item.dDay}</TimelineDDay>
          <TimelineLabel>{item.label}</TimelineLabel>
          <TimelineBadge $status={item.status}>
            {t(TIMELINE_STATUS_STYLE[item.status]?.labelKey) ?? item.status}
          </TimelineBadge>
        </TimelineRow>
      ))}
    </TimelineWrapper>
  );
}