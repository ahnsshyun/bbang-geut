import styled from 'styled-components';
import COLORS from '../../styles/colors';
import FONTS, { font } from '../../styles/fonts';
import { useLang } from "../../hooks/useLang";

/* ============================================================
   1. NoticeBox — 회색 안내 박스 (내용 텍스트만)
============================================================ */
const GrayBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #f3f3f3;
  
  color: ${COLORS.text_gray};
  border-radius: 11px;
  padding: 10px;
  ${font("regbody")}
  line-height: 1.6;
`;

export function NoticeBox({ children }) {
  return <GrayBox>{children}</GrayBox>;
}

/* ============================================================
   2. PromptBox — 연보라 강조 박스 (제목 필수)
============================================================ */
const PurpleBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: ${COLORS.background_lightpurple};
  border-radius: 11px;
  border: 0.6px solid ${COLORS.sub};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PromptTitle = styled.p`
  ${font("boldbody")}
  color: ${COLORS.main};
  margin: 0;
`;

export function PromptBox({ title, children }) {
  return (
    <PurpleBox>
      <PromptTitle>{title}</PromptTitle>
      {children}
    </PurpleBox>
  );
}

// PromptBox 안에서 같이 쓰는 설명 텍스트
export const PromptDesc = styled.p`
  ${font("regbody")}
  line-height: 1.6;
  color: ${COLORS.text_gray}; 
  margin: 0;
`;

/* ============================================================
   3. ToastBox — 검정 배경 토스트 알림
============================================================ */
export const ToastBox = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  box-sizing: border-box;
  padding: 14px 20px;
  border-radius: 30px;
  background: rgba(0, 0, 0, 0.85);
  color: #ffffff;
  ${font("boldbody")}
  font-size: 13px;
  white-space: nowrap;
  animation: toastFadeInOut 2.5s ease forwards;

  @keyframes toastFadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
    10% { opacity: 1; transform: translateX(-50%) translateY(0); }
    85% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
  }
`;

/* ============================================================
   4. ErrorBox — 폼 에러 메시지 박스 (가운데 정렬)
============================================================ */
const RedBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: ${COLORS.background_lightpurple};
  border-radius: 11px;
  padding: 8px 12px;

  text-align: center;
  ${font("regbody")}
  color: ${COLORS.error};
`;

export function ErrorBox({ children }) {
  return <RedBox>{children}</RedBox>;
}

/* ============================================================
   5. DrugBox — 약 정보 카드
   asNeeded: true면 "필요시 약" 스타일로 표시
============================================================ */
const DrugCard = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-height: 150px;

  background: ${({ $asNeeded }) => ($asNeeded ? "#FFFBEF" : "#ffffff")};
  border: 1px solid ${({ $asNeeded }) => ($asNeeded ? "#F5D678" : "rgba(104, 104, 104, 0.3)")};
  border-radius: 11px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;

  color: ${COLORS.error};
  ${font("regbody")}
`;

const DrugBadge = styled.span`
  display: inline-block;
  width: fit-content;
  height: 21px;
  padding: 2px 4px;
  border-radius: 2px;
  border: 0.4px solid ${({ $asNeeded }) => ($asNeeded ? "#F5D678" : COLORS.main)};
  background: ${({ $asNeeded }) => ($asNeeded ? "#FFF3CD" : COLORS.background_lightpurple)};
  
  color: ${({ $asNeeded }) => ($asNeeded ? "#D19C00" : COLORS.main)};
  ${font("boldbody")}
  flex-shrink: 0;
   white-space: nowrap;
   padding: 2px 8px;
`;

const DrugName = styled.div`
  ${font("boldbody")}
  color: #000000;
`;

const DrugInfoRow = styled.div`
  display: flex;
  gap: 10px;
`;

const DrugInfoItem = styled.div`
  box-sizing: border-box;
  flex: 1;
  min-height: 48px;

  background: ${({ $asNeeded }) => ($asNeeded ? "#FFF3CD" : `${COLORS.background_lightpurple}99`)};
  border: 1px solid  ${({ $asNeeded }) => ($asNeeded ? "#F5D678" : `${COLORS.sub}`)}; 
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    ${font("regbody")}
    color: ${COLORS.text_gray};
  }
  .value {
    ${font("boldbody")}
    color: #000000;
  }
`;

const DrugInstruction = styled.div`
  ${font("boldbody")}
  color: ${COLORS.text_gray};
`;

const DrugTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export function DrugBox({ badge, name, ingredient, amount, frequency, duration, instruction, asNeeded = false }) {
  const { t } = useLang();
  
  return (
    <DrugCard $asNeeded={asNeeded}>
      <DrugTop>
        <DrugBadge $asNeeded={asNeeded}>{badge}</DrugBadge>
        <DrugName>{name} </DrugName>
      </DrugTop>
      <DrugInfoRow>
        <DrugInfoItem $asNeeded={asNeeded}>
          <span className="label">{t("drugOnceLabel")}</span>
          <span className="value">{amount}</span>
        </DrugInfoItem>
        <DrugInfoItem $asNeeded={asNeeded}>
          <span className="label">{t("drugDailyLabel")}</span>
          <span className="value">{frequency}</span>
        </DrugInfoItem>
        <DrugInfoItem $asNeeded={asNeeded}>
          <span className="label">{t("drugPeriodLabel")}</span>
          <span className="value">{duration}</span>
        </DrugInfoItem>
      </DrugInfoRow>
      <DrugInstruction>{instruction}</DrugInstruction>
    </DrugCard>
  );
}

/* ============================================================
   6. ToastOverlay — 화면 위에 뜨는 어두운 배경 + 중앙 토스트
   예: 처방전 스캔 중 로딩 팝업
============================================================ */
const Dim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const OverlayToast = styled.div`
  width: calc(100% - 56px);
  max-width: 290px;
  box-sizing: border-box;
  background: ${COLORS.background_lightpurple};
  color: ${COLORS.main};
  border-radius: 11px;
  padding: 20px;
  ${font("regbody")}
`;

const OverlayTitle = styled.p`
  ${font("boldbody")}
  margin: 10px 0 10px;
  text-align: center;
`;

export function ToastOverlay({ title, children }) {
  return (
    <Dim>
      <OverlayToast>
        {title && <OverlayTitle>{title}</OverlayTitle>}
        {children}
      </OverlayToast>
    </Dim>
  );
}

/* ============================================================
   7. InfoBox 
============================================================ */
export const InfoBox = styled.div`
  border: 1px solid ${COLORS.border};
  border-radius: 11px;
  overflow: hidden;
  background: #ffffff;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  
  gap: 12px;
  padding: 16px;

  & + & {
    border-top: 1px solid ${COLORS.border};
  }
`;

/* ============================================================
   7. ShadowBox 
============================================================ */
export const ShadowBox = styled.div`
  border-radius: 11px;
  overflow: hidden;
  background: #ffffff;
  padding: 20px;
  boxShadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1);
`;
