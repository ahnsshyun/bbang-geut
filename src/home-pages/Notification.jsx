import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { CloseButton } from "../components/Button";

// TODO(백엔드 연동 시 제거): 예시 고정 데이터
const HOSPITAL_REPLIES = [
  {
    key: "reply1",
    title: "안서현 원장님이 답변했어요",
    content:
      "초기 반흔 조직이 자리잡는 과정에서 흔히 느끼는 감각입니다. D+5 부목 제거 때 직접 보겠습니다.",
    meta: "어제 18:24 · 자동 번역됨",
  },
];

const TODAY_ROUTINE_NOTIS = [
  {
    key: "incision",
    title: "절개부 소독",
    remaining: "2회",
  },
  {
    key: "coldpack",
    title: "냉찜질",
    remaining: "4회",
  },
];

const Notification = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Header>
        <Title>알림</Title>
        <CloseButton type="button" onClick={() => navigate("/home")} aria-label="닫기">
          ✕
        </CloseButton>
      </Header>

      <Section>
        <SectionTitle>병원 답변</SectionTitle>
        <List>
          {HOSPITAL_REPLIES.map((item) => (
            <NotiCard key={item.key}>
              <NotiTitle>{item.title}</NotiTitle>
              <NotiQuote>"{item.content}"</NotiQuote>
              <NotiMeta>{item.meta}</NotiMeta>
            </NotiCard>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>오늘 루틴</SectionTitle>
        <List>
          {TODAY_ROUTINE_NOTIS.map((item) => (
            <NotiCard key={item.key}>
              <NotiTop>
                <NotiDot />
                <NotiTitle>
                  {item.title} · <RemainingCount>{item.remaining}</RemainingCount>{" "}
                  <RemainingLabel>남았어요</RemainingLabel>
                </NotiTitle>
              </NotiTop>
            </NotiCard>
          ))}
        </List>
      </Section>
    </Wrapper>
  );
};

export default Notification;

/* ---------- styles ---------- */

const Wrapper = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px 28px 40px;
  background: #ffffff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  ${font("heading")}
  font-size: 20px;
  color: #111111;
  margin: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  ${font("boldbody")}
  font-size: 15px;
  color: ${COLORS.main};
  margin: 0 0 4px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NotiCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 14px;
  background: ${COLORS.background_lightpurple}4D;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
`;

const NotiTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotiDot = styled.span`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${COLORS.background_lightpurple};
  border: 1.5px solid ${COLORS.main};
`;

const NotiTitle = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
  margin: 0;
`;

const RemainingCount = styled.span`
  color: ${COLORS.text_green};
  margin-left: 4px;
`;

const RemainingLabel = styled.span`
  color: ${COLORS.text_gray};
`;

const NotiQuote = styled.p`
  ${font("regbody")}
  line-height: 1.6;
  color: #111111;
  margin: 0;
`;

const NotiContent = styled.p`
  ${font("regbody")}
  line-height: 1.6;
  color: ${COLORS.text_gray};
  margin: 0;
`;

const NotiMeta = styled.p`
  ${font("regbody")}
  font-size: 12px;
  color: ${COLORS.text_gray};
  margin: 0;
`;