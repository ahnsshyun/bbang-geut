import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { Modal } from "./Modal";
import historyIcon from "../assets/historyIcon.svg";

/* ============================================================
   DayDetailHeader — 모달 상단 (아이콘+제목+날짜)
============================================================ */
const DayDetailHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DayDetailTitle = styled.p`
  ${font("title")}
  color: #111111;
  margin: 0px;
`;

const DayDetailDate = styled.p`
  ${font("semibody")}
  color: ${COLORS.text_gray};
  margin: 2px 0 0;
`;

function DayDetailHeader({ dDayLabel, dateLabel }) {
  return (
    <DayDetailHeaderRow>
      <img src={historyIcon} alt="체크인 아이콘" width={55} height={55} />
      <div>
        <DayDetailTitle>{dDayLabel} 체크인</DayDetailTitle>
        <DayDetailDate>{dateLabel}</DayDetailDate>
      </div>
    </DayDetailHeaderRow>
  );
}

/* ============================================================
   DayPhotoRow — 그날의 정면/좌/우 사진 3장
============================================================ */
const DaySectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
  margin: 0 0 10px;
`;

const DayPhotoGrid = styled.div`
  display: flex;
  gap: 10px;
`;

const DayPhotoCard = styled.div`
  flex: 1;
  height: 110px;
  border-radius: 12px;
  background: linear-gradient(180deg, #B8A9F5, #8C6FEC);
  display: flex;
  align-items: flex-end;
  padding: 8px;
  box-sizing: border-box;
`;

const DayPhotoLabel = styled.span`
  ${font("boldbody")}
  color: #ffffff;
`;

function DayPhotoRow({ photos = [] }) {
  return (
    <div>
      <DaySectionTitle>사진</DaySectionTitle>
      <DayPhotoGrid>
        {photos.map((p, i) => (
          <DayPhotoCard key={i}>
            <DayPhotoLabel>{p.label}</DayPhotoLabel>
          </DayPhotoCard>
        ))}
      </DayPhotoGrid>
    </div>
  );
}

/* ============================================================
   DaySymptomRow — 그날의 부기/통증/멍 (각 1개, 5단계 진하기 막대)
============================================================ */
const DaySymptomGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const DaySymptomLabel = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: ${COLORS.main};
`;

const DaySymptomTrack = styled.div`
  display: flex;
  gap: 6px;
`;

const DaySymptomLevel = styled.div`
  flex: 1;
  height: 28px;
  border-radius: 8px;
  background: ${({ $filled }) => ($filled ? COLORS.main : COLORS.background_lightpurple)};
`;

function DaySymptomRow({ symptoms = [] }) {
  return (
    <div>
      <DaySectionTitle>상태 흐름</DaySectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {symptoms.map((symptom) => (
          <DaySymptomGroup key={symptom.key}>
            <DaySymptomLabel>{symptom.label}</DaySymptomLabel>
            <DaySymptomTrack>
              {[1, 2, 3, 4, 5].map((level) => (
                <DaySymptomLevel key={level} $filled={level <= symptom.level} />
              ))}
            </DaySymptomTrack>
          </DaySymptomGroup>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   DayCareTagList — 기록된 자가 케어 태그 목록
============================================================ */
const CareTagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CareTag = styled.span`
  ${font("boldbody")}
  font-size: 12px;
  color: ${COLORS.main};
  background: ${COLORS.background_lightpurple};
  padding: 8px 12px;
  border-radius: 20px;
  white-space: nowrap;
`;

function DayCareTagList({ tags = [] }) {
  return (
    <div>
      <DaySectionTitle>기록된 자가 케어</DaySectionTitle>
      <CareTagWrap>
        {tags.map((tag, i) => (
          <CareTag key={i}>{tag}</CareTag>
        ))}
      </CareTagWrap>
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
  ${font("boldbody")}
  font-size: 14px;
  color: ${COLORS.text_gray};
  margin: 0;
`;

function NoCheckinState() {
  return (
    <EmptyStateWrap>
      <span style={{ fontSize: 32 }}>❕</span>
      <EmptyStateText>체크인 기록이 없습니다</EmptyStateText>
    </EmptyStateWrap>
  );
}

/* ============================================================
   HistoryDayModal — 최종 조립
============================================================ */
/**
 * props:
 * - dDayLabel: "D+17" 형태
 * - dateLabel: "2026.08.20"
 * - detail: { photos, symptoms, careTags } | null
 * - onClose
 */
export function HistoryDayModal({ dDayLabel, dateLabel, detail, onClose }) {
  return (
    <Modal
      onClose={onClose}
      header={<DayDetailHeader dDayLabel={dDayLabel} dateLabel={dateLabel} />}
      showCloseButton={false}
    >
      <SectionGap>
      {detail ? (
        <>
          <DayPhotoRow photos={detail.photos} />
          <DaySymptomRow symptoms={detail.symptoms} />
          <DayCareTagList tags={detail.careTags} />
        </>
      ) : (
        <NoCheckinState />
      )}
      </SectionGap>
    </Modal>
  );
}

const SectionGap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;