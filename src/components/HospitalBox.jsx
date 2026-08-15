import styled from "styled-components";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import React from "react";
import { NoticeBox, InfoBox } from "../components/Box";
import MainButton from "../components/Button";

/* ============================================================
   AppointmentList — 예약 목록 (노란색 "예정" 배지만 사용)
============================================================ */
const SectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 16px;
  color: #111111;
  margin: 0 0 12px;
`;

const AppointmentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AppointmentCardEl = styled.button`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const AppointmentIconWrap = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${COLORS.background_lightpurple};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const AppointmentTextGroup = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AppointmentTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
  margin: 0;
`;

const AppointmentDesc = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  margin: 0;
`;

const AppointmentBadge = styled.span`
  flex-shrink: 0;
  ${font("boldbody")}
  color: #8A6300;
  background: #FFF3CD;
  padding: 5px 12px;
  border-radius: 20px;
  white-space: nowrap;
`;

/**
 * 개별 예약 카드
 * props: icon, title, dDayLabel, dateLabel, badgeLabel("예정" 등), onClick
 */
export function AppointmentCard({ icon, title, dDayLabel, dateLabel, badgeLabel = "예정", onClick }) {
  return (
    <AppointmentCardEl type="button" onClick={onClick}>
      <AppointmentIconWrap>{icon}</AppointmentIconWrap>
      <AppointmentTextGroup>
        <AppointmentTitle>{title}</AppointmentTitle>
        <AppointmentDesc>
          {dDayLabel} · {dateLabel}
        </AppointmentDesc>
      </AppointmentTextGroup>
      <AppointmentBadge>{badgeLabel}</AppointmentBadge>
    </AppointmentCardEl>
  );
}

/**
 * items: [{ key, title, dDayLabel, dateLabel, badgeLabel, onClick }]
 */
export function AppointmentList({ items = [] }) {
  if (items.length === 0) return null;

  return (
      <AppointmentGroup>
        {items.map((item) => (
          <AppointmentCard
            key={item.key}
            icon={item.icon}
            title={item.title}
            dDayLabel={item.dDayLabel}
            dateLabel={item.dateLabel}
            badgeLabel={item.badgeLabel}
            onClick={item.onClick}
          />
        ))}
      </AppointmentGroup>
  );
}

/* ============================================================
   ChatConsultation — 원격 상담 채팅
============================================================ */
const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #ffffff;
  padding: 10px;
  border-radius: 11px;
`;

const ChatDoctorName = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 0 0 4px;
`;

const ChatDoctorMeta = styled.p`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  margin: 0;
`;

const ConnectedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  ${font("boldbody")}
  color: ${COLORS.text_green};
`;

const ConnectedDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${COLORS.text_green};
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TranslateNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${COLORS.background_lightpurple}8D;
  margin-top: 20px;
`;

const TranslateHeader = styled.span`
  flex-direction: column;
  display: flex;
  gap: 5px;
`;

const TranslateTitle = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: ${COLORS.main};
`;

const TranslateText = styled.span`
  ${font("regbody")}
  color: ${COLORS.main};
`;

const LangToggle = styled.div`
  flex-shrink: 0;
  display: flex;
  border-radius: 20px;
  background: #ffffff;
  overflow: hidden;
`;

const LangToggleBtn = styled.button`
  border: none;
  padding: 5px 10px;
  ${font("boldbody")}
  background: ${({ $active }) => ($active ? COLORS.main : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : COLORS.text_gray)};
  cursor: pointer;
  border-radius: 20px;
`;

/* ---- 메시지 ---- */
const DateDivider = styled.div`
  text-align: center;
  ${font("boldbody")}
  color: ${COLORS.text_gray};
  margin: 8px 0;
  background: ${COLORS.background_lightpurple}4D;
  border-radius: 20px;
  border: 1px solid ${COLORS.sub};
  width: 120px;
  height: 20px;
  align-self: center;
`;

const DateDividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${COLORS.border};
  }
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: ${({ $fromDoctor }) => ($fromDoctor ? "flex-start" : "flex-end")};
`;

const MessageMeta = styled.span`
  ${font("boldbody")}
  color: #111111;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 14px;
  ${font("regbody")}
  font-size: 13px;
  line-height: 1.6;
  background: ${({ $fromDoctor }) => ($fromDoctor ? "#F2F2F5" : COLORS.background_lightpurple)};
  color: #111111;
  border-bottom-left-radius: ${({ $fromDoctor }) => ($fromDoctor ? "4px" : "14px")};
  border-bottom-right-radius: ${({ $fromDoctor }) => ($fromDoctor ? "14px" : "4px")};
`;

const TranslateHint = styled.span`
  ${font("regbody")}
  color: ${COLORS.text_gray};
`;

/* ---- 첨부 자료 ---- */
const AttachTitle = styled.p`
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.text_gray};
  margin: 0 0 10px;
`;

const AttachRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;

  & + & {
    border-top: 1px solid ${COLORS.border};
  }
`;

const AttachLabel = styled.span`
  ${font("boldbody")}
  color: #111111;

`;

/* ---- 입력 영역 ---- */
const ChatInputWrap = styled.div`
  box-sizing: border-box;
  padding: 14px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid ${COLORS.border};
`;

const ChatTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  border: none;
  resize: none;
  ${font("regbody")}
  font-size: 13px;
  color: #111111;
  min-height: 48px;
  outline: none;

  &::placeholder {
    color: ${COLORS.text_gray};
  }
`;

const ChatInputFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${COLORS.border};
`;

const AutoTranslateText = styled.span`
  ${font("regbody")}
  color: ${COLORS.text_gray};
`;

const ToggleSwitch = styled.button`
  flex-shrink: 0;
  width: 34px;
  height: 20px;
  border-radius: 10px;
  border: none;
  background: ${({ $on }) => ($on ? COLORS.main : "#D9D9D9")};
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? "16px" : "2px")};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    transition: left 0.15s ease;
  }
`;

/**
 * props:
 * - doctorName, doctorMeta
 * - messages: [{ key, from: "doctor"|"me", authorLabel, dateLabel, text, translateHint }]
 * - attachments: [{ key, label, onView }]
 * - inputValue, onInputChange, onSend
 * - autoTranslate, onToggleAutoTranslate
 */
export function ChatConsultation({
  doctorName,
  doctorMeta,
  messages = [],
  attachments = [],
  inputValue,
  onInputChange,
  onSend,
  autoTranslate,
  onToggleAutoTranslate,
}) {
  return (
    <ChatWrapper>
      <InfoBox style={{padding: "14px"}}>
        <HeaderTopRow>
          <div>
            <ChatDoctorName>{doctorName}</ChatDoctorName>
            <ChatDoctorMeta>{doctorMeta}</ChatDoctorMeta>
          </div>
          <ConnectedBadge>
            <ConnectedDot /> 연결됨
          </ConnectedBadge>
        </HeaderTopRow>

        <TranslateNotice>
          <TranslateHeader>
          <TranslateTitle>실시간 번역</TranslateTitle>
          <TranslateText>상담 답변을 일본어로 보고 있어요</TranslateText>
          </TranslateHeader>
          <LangToggle>
            <LangToggleBtn type="button" $active>
              日本語
            </LangToggleBtn>
            <LangToggleBtn type="button">원문</LangToggleBtn>
          </LangToggle>
        </TranslateNotice>
      </InfoBox>

      {messages.map((msg, i) => {
        const showDate = i === 0 || msg.dateLabel !== messages[i - 1].dateLabel;
        return (
          <React.Fragment key={msg.key}>
            {showDate && 
              <DateDividerRow>
                <DateDivider>{msg.dateLabel}</DateDivider>
              </DateDividerRow>
            }
            <MessageRow $fromDoctor={msg.from === "doctor"}>
              <MessageMeta>{msg.authorLabel}</MessageMeta>
              <MessageBubble $fromDoctor={msg.from === "doctor"}>{msg.text}</MessageBubble>
              {msg.translateHint && <TranslateHint>{msg.translateHint}</TranslateHint>}
            </MessageRow>
          </React.Fragment>
        );
      })}

      {attachments.length > 0 && (
        <InfoBox style={{padding: "12px", background: `${COLORS.info}4D`}}>
          <AttachTitle>📄 함께 전송될 자료</AttachTitle>
          {attachments.map((a) => (
            <AttachRow key={a.key}>
              <AttachLabel>{a.label}</AttachLabel>
            </AttachRow>
          ))}
        </InfoBox>
      )}

      <ChatInputWrap>
        <ChatTextarea
          placeholder="무엇이 궁금하신가요?"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <ChatInputFooter>
          <ToggleSwitch type="button" $on={autoTranslate} onClick={onToggleAutoTranslate} />
          <AutoTranslateText>한국어로 자동 번역해 보내기</AutoTranslateText>
        </ChatInputFooter>
      </ChatInputWrap>

      <MainButton onClick={onSend}>
        전송
      </MainButton>

      <NoticeBox>
        ⓘ 의료진 상담과 회복 관련 안내를 위한 기능입니다. 
        <br/>진단이나 처방을 위해 대면 진료가 필요할 수 있으며, 응급 상황에서는 현지 또는 담당 의료기관에 직접 연락해 주세요.
      </NoticeBox>
    </ChatWrapper>
  );
}