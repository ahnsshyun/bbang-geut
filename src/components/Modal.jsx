import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { CloseButton } from "./Button";

import { DrugBox, NoticeBox } from "./Box";

/* ---------- 공용 바텀시트 뼈대 ---------- */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const ModalSheet = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const ModalHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: ${COLORS.border};
  margin: 0 auto 4px;
`;

const ModalHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

/**
 * 바텀시트형 모달 뼈대. 내용은 children으로 자유롭게 구성.
 *
 * props:
 * - onClose
 * - header: 헤더 영역 커스텀 노드 (없으면 헤더 자체 생략)
 * - showCloseIcon: 우측 상단 ✕ 버튼 표시 여부 (기본 true)
 * - children
 */
export function Modal({
  onClose,
  header,
  showCloseIcon = true,
  showCloseButton = true,
  children,
}) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalSheet onClick={(e) => e.stopPropagation()}>
        <ModalHandle />

        {(header || showCloseIcon) && (
          <ModalHeaderRow>
            <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
            {showCloseIcon && (
              <CloseButton type="button" onClick={onClose} aria-label="닫기">
                ✕
              </CloseButton>
            )}
          </ModalHeaderRow>
        )}

        {children}

      </ModalSheet>
    </ModalOverlay>
  );
}

/* ---------- 케어 루틴 상세 모달 전용 스타일/내용 ---------- */
const ModalTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ModalIconWrap = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${COLORS.background_lightpurple};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const ModalTitle = styled.p`
  ${font("boldbody")}
  font-size: 16px;
  color: #111111;
  margin: 0;
`;

const ModalMeta = styled.p`
  ${font("regbody")}
  font-size: 12px;
  color: ${COLORS.text_gray};
  margin: 2px 0 0;
`;

const ModalSectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: ${COLORS.main};
  margin: 0 0 8px;
`;

const ModalReasonText = styled.p`
  ${font("regbody")}
  line-height: 1.6;
  color: #111111;
  margin: 0;
`;

const ModalStepList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ModalStepItem = styled.li`
  ${font("regbody")}
  line-height: 1.6;
  color: #111111;
`;

const QuoteBox = styled.div`
  box-sizing: border-box;
  padding: 16px;
  background: ${COLORS.background_lightpurple};
  border-radius: 11px;
`;

const OriginalQuoteText = styled.p`
  ${font("semibody")}
  font-size: 12px;
  line-height: 1.6;
  color: #111111;
  margin: 0;
`;

const ModalDisclaimer = styled.p`
  ${font("regbody")}
  line-height: 1.5;
  color: ${COLORS.greey};
  margin: 0;
`;

/**
 * props:
 * - icon, title, meta
 * - reason, steps(선택), originalQuote, disclaimer
 * - questionLabel: "왜 해야 하나요?" 자리에 들어갈 문구 (기본값 있음)
 * - onClose
 */
export function RoutineDetailModal({
  icon,
  title,
  meta,
  reason,
  steps = [],
  originalQuote,
  disclaimer,
  onClose,
  questionLabel = "왜 해야 하나요?",
  status,

}) {
  return (
    <Modal
      onClose={onClose}
      header={
        <ModalTitleGroup>
          <ModalIconWrap>{icon}</ModalIconWrap>
          <div style={{ flex: 1 }}>
            <ModalTitle>{title}</ModalTitle>
            <ModalMeta>{meta}</ModalMeta>
          </div>
        
        </ModalTitleGroup>
      }
    >
      
      <div>
        <ModalSectionTitle>{questionLabel}</ModalSectionTitle>
        <ModalReasonText>{reason}</ModalReasonText>
      </div>

      {steps.length > 0 && (
      <div>
        <ModalSectionTitle>어떻게 하나요?</ModalSectionTitle>
        <QuoteBox style={{ background: `${COLORS.background_lightpurple}4D` }}>
        <ModalStepList>
          {steps.map((step, i) => (
            <ModalStepItem key={i}>① {step}</ModalStepItem>
          ))}
        </ModalStepList>
        </QuoteBox>
      </div>
      )}

      <div>
        <ModalSectionTitle>병원 안내문 원문</ModalSectionTitle>
        <QuoteBox>
          <OriginalQuoteText>"{originalQuote}"</OriginalQuoteText>
        </QuoteBox>
      </div>

      {disclaimer && <ModalDisclaimer>{disclaimer}</ModalDisclaimer>}
    </Modal>
  );
}

/* ---------- 처방약 상세 모달 ---------- */
const DrugModalTitle = styled.p`
  ${font("boldbody")}
  font-size: 16px;
  color: #111111;
  margin: 0;
`;

const DrugModalMeta = styled.p`
  ${font("regbody")}
  font-size: 12px;
  color: ${COLORS.text_gray};
  margin: 2px 0 0;
`;

const RequiredSectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${COLORS.main};
  }
`;

const AsNeededSectionTitle = styled(RequiredSectionTitle)`
  &::before {
    background: #E0A800;
  }
`;

const DrugListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;


/**
 * props:
 * - title, meta (예: "처방약 4종 복용", "하루 3회 · 매 식후 · D+0 ~ D+5")
 * - requiredDrugs: [{ badge, name, ingredient, amount, frequency, duration, instruction }]
 * - asNeededDrugs: 같은 형식
 * - periodNote: 하단 복약 시작일/종료일 안내 문구
 * - onClose
 */
export function DrugDetailModal({
  title,
  meta,
  requiredDrugs = [],
  asNeededDrugs = [],
  periodNote,
  onClose,
}) {
  return (
    <Modal
      onClose={onClose}
      header={
        <div>
          <DrugModalTitle>{title}</DrugModalTitle>
          <DrugModalMeta>{meta}</DrugModalMeta>
        </div>
      }
    >
      {requiredDrugs.length > 0 && (
        <div>
          <RequiredSectionTitle>정해진 시간에 복용해야 하는 약 {requiredDrugs.length}종</RequiredSectionTitle>
          <DrugListWrap style={{ marginTop: 12 }}>
            {requiredDrugs.map((drug, i) => (
              <DrugBox key={i} {...drug} asNeeded={false} />
            ))}
          </DrugListWrap>
        </div>
      )}

      {asNeededDrugs.length > 0 && (
        <div>
          <AsNeededSectionTitle>필요시 약 {asNeededDrugs.length}종</AsNeededSectionTitle>
          <DrugListWrap style={{ marginTop: 12 }}>
            {asNeededDrugs.map((drug, i) => (
              <DrugBox key={i} {...drug} asNeeded={true} />
            ))}
          </DrugListWrap>
        </div>
      )}

      {periodNote && <NoticeBox>{periodNote}</NoticeBox>}
    </Modal>
  );
}

