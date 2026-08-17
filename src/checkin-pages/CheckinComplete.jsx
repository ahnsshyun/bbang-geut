import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import CheckinTheme from "../components/CheckinTheme";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import { InfoBox } from "../components/Box";
import MainButton, { SubButton } from "../components/Button";

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDotDate(isoDate) {
  return isoDate ? isoDate.replaceAll("-", ".") : "";
}

const CheckinComplete = () => {
  const navigate = useNavigate();

  // /checkins/{id}/complete 응답 — CheckinStatus에서 저장해둔 값
  const result = readJSON("naranhi_checkin_result");

  if (!result) {
    return (
      <Layout>
        <Content>
          <CheckinTheme title="체크인 결과를 찾을 수 없어요" date="" onClose={() => navigate("/home")} />
          <Spacer />
          <MainButton onClick={() => navigate("/checkin/photo")}>체크인 다시 하기</MainButton>
        </Content>
      </Layout>
    );
  }

  const completionPercent = Math.round((result.completion_rate ?? 0) * 100);

  return (
    <Layout>
      <Content>
        <CheckinTheme
          title={`D+${result.day} 체크인`}
          date={formatDotDate(result.date)}
          onClose={() => navigate("/home")}
          totalSteps={3}
          currentStep={3}
        />

        <InfoBox style={{ padding: "20px", gap: "20px", display: "flex", flexDirection: "column" }}>
          <IconWrap>
            <IconEmoji>📋</IconEmoji>
          </IconWrap>

          <CompleteTitle>D+{result.day} 기록 완료</CompleteTitle>

          <PurpleBox>
            <PurpleTitle>{completionPercent}%  ·  지금까지의 루틴 완주율</PurpleTitle>
            <PurpleDesc>끝까지 완주했을 때 가장 좋은 결과를 만듭니다</PurpleDesc>
          </PurpleBox>
        </InfoBox>

        <Spacer />

        <MainButton onClick={() => navigate("/history")}>
          기록 탭에서 변화보기
        </MainButton>

        <SubButton onClick={() => navigate("/home")}>
          홈으로
        </SubButton>
      </Content>
    </Layout>
  );
};

export default CheckinComplete;

/* ---------- styles ---------- */

const IconWrap = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: linear-gradient(135deg, #FF6FA5, #FF9FC0);
  box-shadow: 0px 10px 30px 0px rgba(135, 206, 250, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const IconEmoji = styled.span`
  font-size: 32px;
`;

const CompleteTitle = styled.p`
  ${font("boldbody")}
  font-size: 18px;
  color: #111111;
  text-align: center;
  margin-top: 20px;
`;

const PurpleBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border-radius: 11px;
  background: ${COLORS.background_lightpurple};
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`;

const PurpleTitle = styled.p`
  ${font("boldbody")}
  font-size: 16px;
  color: ${COLORS.main};
  line-height: 8px;
`;

const PurpleDesc = styled.p`
  ${font("boldbody")}
  color: ${COLORS.text_gray};
  line-height: 8px;
`;