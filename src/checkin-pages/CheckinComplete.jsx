import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import CheckinTheme from "../components/Theme/CheckinTheme";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import { InfoBox } from "../components/Box/Box";
import MainButton, { SubButton } from "../components/Button";
import { useLang } from "../hooks/useLang";
import { useHome } from "../hooks/useHome";

function formatDotDate(isoDate) {
  return isoDate ? isoDate.replaceAll("-", ".") : "";
}

const CheckinComplete = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const { home, loading, error } = useHome();

  if (loading) {
    return (
      <Layout>
        <Content>
          <p>{t("loading")}</p>
        </Content>
      </Layout>
    );
  }

  if (error || !home) {
    return (
      <Layout>
        <Content>
          <CheckinTheme title={t("resultNotFound")} date="" onClose={() => navigate("/home")} />
          <Spacer />
          <MainButton onClick={() => navigate("/checkin/photo")}>{t("retryCheckin")}</MainButton>
        </Content>
      </Layout>
    );
  }

  const completionPercent = Math.round((home.summary?.completion_rate ?? 0) * 100);

  return (
    <Layout>
      <Content>
        <CheckinTheme
          title={`D+${home.day} ${t("checkinTitle")}`}
          date={formatDotDate(home.date)}
          onClose={() => navigate("/home")}
          totalSteps={3}
          currentStep={3}
        />

        <InfoBox style={{ padding: "20px", gap: "20px", display: "flex", flexDirection: "column" }}>
          <IconWrap>
            <IconEmoji>📋</IconEmoji>
          </IconWrap>

          <CompleteTitle>D+{home.day} {t("recordComplete")}</CompleteTitle>

          <PurpleBox>
            <PurpleTitle>{completionPercent}%  ·  {t("completionRateLabel")}</PurpleTitle>
            <PurpleDesc>{t("completionRateDesc")}</PurpleDesc>
          </PurpleBox>
        </InfoBox>

        <Spacer />

        <MainButton onClick={() => navigate("/history")}>
          {t("viewChangeInRecord")}
        </MainButton>

        <SubButton onClick={() => navigate("/home")}>
          {t("goHome")}
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