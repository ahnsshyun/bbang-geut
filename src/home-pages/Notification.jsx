import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { CloseButton } from "../components/Button";

import { getNotifications } from "../api/notifications";

// 루틴 알림 title이 "짧은 보행 · 3회 남았어요" 형태로 미리 조합돼서 오기 때문에,
// 기존 디자인처럼 "3회" 부분만 초록색으로 강조하려고 다시 분리합니다.
// 패턴이 안 맞으면(형식이 바뀌면) 그냥 title 전체를 평범하게 보여줍니다.
const ROUTINE_TITLE_PATTERN = /^(.+?)\s*·\s*(\d+회)\s*남았어요$/;

function formatDateTime(isoDatetime) {
  const d = new Date(isoDatetime);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${m}.${day} ${hh}:${mm}`;
}

const Notification = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getNotifications()
      .then((data) => {
        if (!cancelled) setItems(data.items);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const clinicReplies = (items ?? []).filter((i) => i.type === "clinic_reply");
  const routineNotis = (items ?? []).filter((i) => i.type === "routine");

  return (
    <Wrapper>
      <Header>
        <Title>알림</Title>
        <CloseButton type="button" onClick={() => navigate(-1)} aria-label="닫기">
          ✕
        </CloseButton>
      </Header>

      {loading && <NotiMeta>불러오는 중이에요...</NotiMeta>}
      {error && <NotiMeta>알림을 불러오지 못했어요.</NotiMeta>}

      {!loading && !error && (
        <>
          {clinicReplies.length > 0 && (
            <Section>
              <SectionTitle>병원 답변</SectionTitle>
              <List>
                {clinicReplies.map((item, i) => (
                  <NotiCard key={`reply-${i}`}>
                    <NotiTop>
                      {item.unread && <NotiDot />}
                      <NotiTitle>{item.title}</NotiTitle>
                    </NotiTop>
                    <NotiQuote>"{item.body}"</NotiQuote>
                    {item.created_at && <NotiMeta>{formatDateTime(item.created_at)}</NotiMeta>}
                  </NotiCard>
                ))}
              </List>
            </Section>
          )}

          {routineNotis.length > 0 && (
            <Section>
              <SectionTitle>오늘 루틴</SectionTitle>
              <List>
                {routineNotis.map((item, i) => {
                  const match = item.title.match(ROUTINE_TITLE_PATTERN);
                  return (
                    <NotiCard key={`routine-${i}`}>
                      <NotiTop>
                        <NotiDot />
                        {match ? (
                          <NotiTitle>
                            {match[1]} · <RemainingCount>{match[2]}</RemainingCount>{" "}
                            <RemainingLabel>남았어요</RemainingLabel>
                          </NotiTitle>
                        ) : (
                          <NotiTitle>{item.title}</NotiTitle>
                        )}
                      </NotiTop>
                      {item.body && <NotiMeta>{item.body}</NotiMeta>}
                    </NotiCard>
                  );
                })}
              </List>
            </Section>
          )}

          {clinicReplies.length === 0 && routineNotis.length === 0 && (
            <NotiMeta>새 알림이 없어요.</NotiMeta>
          )}
        </>
      )}
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

const NotiMeta = styled.p`
  ${font("regbody")}
  font-size: 12px;
  color: ${COLORS.text_gray};
  margin: 0;
`;