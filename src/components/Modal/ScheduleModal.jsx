import styled from "styled-components";
import COLORS from "../../styles/colors";
import FONTS, { font } from "../../styles/fonts";
import { Modal } from "./Modal";
import { useLang } from "../../hooks/useLang";

/* ---------- 헤더 (아이콘 + D+n + 날짜 + 단계 배지) ---------- */
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrap = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFB86B, #FF8A4C);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const TitleGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

const DDayTitle = styled.p`
  ${font("boldbody")}
  font-size: 18px;
  color: #111111;
  margin: 0;
`;

const DateLabel = styled.p`
  ${font("regbody")}
  font-size: 13px;
  color: ${COLORS.text_gray};
  margin: 2px 0 0;
`;

const StageBadge = styled.span`
  flex-shrink: 0;
  ${font("boldbody")}
  font-size: 12px;
  color: ${COLORS.main};
  background: ${COLORS.background_lightpurple};
  padding: 6px 12px;
  border-radius: 20px;
  white-space: nowrap;
`;

/* ---------- 이 날의 루틴 ---------- */
const SectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
  margin: 0 0 10px;
`;

const TagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const RoutineTag = styled.span`
  ${font("boldbody")}
  font-size: 12px;
  color: ${COLORS.main};
  background: ${COLORS.background_lightpurple};
  padding: 8px 12px;
  border-radius: 20px;
  white-space: nowrap;
`;

/* ---------- 이 날 해도 되는 것들 (가능/주의/금지) ---------- */
const StatusGroupWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const STATUS_STYLE = {
  ok: { color: COLORS.text_green, dot: COLORS.text_green, bg: "#F4FBF7", border: "#CDEBDB", labelKey: "statusOk" },
  care: { color: "#8A6300", dot: "#E0A800", bg: "#FFFBEF", border: "#F5D678", labelKey: "statusCare" },
  no: { color: COLORS.error, dot: COLORS.error, bg: "#FFF7F7", border: "#F5C6C6", labelKey: "statusNo" },
};

const StatusColumn = styled.div`
  box-sizing: border-box;
  padding: 12px;
  border-radius: 12px;
  background: ${({ $status }) => STATUS_STYLE[$status].bg};
  border: 1px solid ${({ $status }) => STATUS_STYLE[$status].border};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_STYLE[$status].dot};
`;

const StatusLabel = styled.span`
  ${font("boldbody")}
  font-size: 12px;
  color: ${({ $status }) => STATUS_STYLE[$status].color};
`;

const StatusCount = styled.span`
  ${font("boldbody")}
  font-size: 12px;
  color: ${({ $status }) => STATUS_STYLE[$status].color};
`;

const StatusItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StatusItemChip = styled.div`
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 8px;
  background: #ffffff;
  ${font("regbody")}
  font-size: 12px;
  color: #111111;
  text-align: center;
`;

/**
 * props:
 * - dDayLabel: "D+17"
 * - dateLabel: "2026.08.20"
 * - stageLabel: "4단계 · 생활 복귀"
 * - routines: string[]  // ["상체 45° 수면", "짧은 보행 · 3회", ...]
 * - statusGroups: { ok: string[], care: string[], no: string[] }
 * - onClose
 */
export function ScheduleDayModal({
  dDayLabel,
  dateLabel,
  stageLabel,
  routines = [],
  statusGroups = { ok: [], care: [], no: [] },
  onClose,
}) {
  const { t } = useLang();

  return (
    <Modal
      onClose={onClose}
      header={
        <HeaderRow>
          <IconWrap>📅</IconWrap>
          <TitleGroup>
            <DDayTitle>{dDayLabel}</DDayTitle>
            <DateLabel>{dateLabel}</DateLabel>
          </TitleGroup>
          {stageLabel && <StageBadge>{stageLabel}</StageBadge>}
        </HeaderRow>
      }
    >
      {routines.length > 0 && (
        <div>
          <SectionTitle>{t("dayRoutines")}</SectionTitle>
          <TagWrap>
            {routines.map((r, i) => (
              <RoutineTag key={i}>{r}</RoutineTag>
            ))}
          </TagWrap>
        </div>
      )}

      <div>
        <SectionTitle>{t("dayStatusTitle")}</SectionTitle>
        <StatusGroupWrap>
          {["ok", "care", "no"].map((status) => (
            <StatusColumn key={status} $status={status}>
              <StatusHeader>
                <StatusDot $status={status} />
                <StatusLabel $status={status}>{STATUS_STYLE[status].label}</StatusLabel>
                <StatusLabel $status={status}>{t(STATUS_STYLE[status].labelKey)}</StatusLabel>
              </StatusHeader>
              <StatusItemList>
                {(statusGroups[status] ?? []).map((item, i) => (
                  <StatusItemChip key={i}>{item}</StatusItemChip>
                ))}
              </StatusItemList>
            </StatusColumn>
          ))}
        </StatusGroupWrap>
      </div>
    </Modal>
  );
}