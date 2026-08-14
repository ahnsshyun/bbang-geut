import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { NoticeBox, PromptBox, PromptDesc, InfoBox, InfoRow } from "../components/Box";
import Button from "../components/Button";

const HOSPITAL_NAME = "서울 N성형외과의원";
const SERVICE_NAME = "나란히";

const RECEIVED_ITEMS = [
  { icon: "🧾", label: "수술기록 (PDF)" },
  { icon: "📄", label: "수술 후 주의사항 안내문" },
  { icon: "🗓️", label: "내원 예약 일정" },
];

const OnboardingIntake = () => {
  const navigate = useNavigate();

  const handleCapturePrescription = () => navigate("/onboarding/prescription/capture");

  return (
    <Layout>
      <Content>
        <LoginTheme
          step="STEP 1/3 · 자료 수신"
          title={
            <>
              {HOSPITAL_NAME}에서
              <br />
              회복 자료를 받았습니다.
            </>
          }
          desc="정보는 기기 안에만 보관되며, 병원에만 전송됩니다."
        />

        <InfoBox>
          {RECEIVED_ITEMS.map((item) => (
            <InfoRow key={item.label} style={{ justifyContent: "space-between" }}>
              <RowLeft>
                <Icon>{item.icon}</Icon>
                <RowLabel>{item.label}</RowLabel>
              </RowLeft>
              <StatusReceived>받음</StatusReceived>
            </InfoRow>
          ))}

          <InfoRow style={{ justifyContent: "space-between" }}>
            <RowLeft>
              <Icon>➕</Icon>
              <RowTextGroup>
                <RowLabel>환자보관용 처방전</RowLabel>
              </RowTextGroup>
            </RowLeft>
            <StatusAction>직접 등록</StatusAction>
          </InfoRow>
        </InfoBox>

        <Spacer />

        <PromptBox title="처방전을 직접 등록해주세요">
          <PromptDesc>
            처방전을 촬영하면{" "}<b>약물명 · 1회 투여량 · 1일 투여 횟수 · 복용 기간</b>을 읽어
            복약 가이드로 만들어 드려요.
          </PromptDesc>
          <Button type="button" onClick={handleCapturePrescription}>
            📷 처방전 촬영하기
          </Button>
        </PromptBox>

        <Spacer />
      </Content>
    </Layout>
  );
};

export default OnboardingIntake;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.span`
  font-size: 16px;
`;

const RowTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RowLabel = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
`;

const StatusReceived = styled.span`
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.text_green};
  flex-shrink: 0;
`;

const StatusAction = styled.span`
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.main};
  flex-shrink: 0;
`;