import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { NoticeBox, PromptBox, PromptDesc, InfoBox, InfoRow } from "../components/Box/Box";
import Button from "../components/Button";
import { useLang } from "../hooks/useLang";

import { useMe } from "../hooks/useMe";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";

const SERVICE_NAME = "나란히";

const DOCUMENT_LABEL_KEY = {
  surgery_record: "docSurgeryRecord",
  instructions: "docInstructions",
  appointments: "docAppointments",
};

const DOCUMENT_ICONS = {
  surgery_record: "🧾",
  instructions: "📄",
  appointments: "🗓️",
};

const OnboardingIntake = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const { me, loading: meLoading, error: meError } = useMe();
  const { status, loading: statusLoading, error: statusError } = useOnboardingStatus();

  const loading = meLoading || statusLoading;
  const error = meError || statusError;

  const handleCapturePrescription = () => navigate("/onboarding/prescription/capture");

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme step={t("step1")} title={t("loadingData")} />
        </Content>
      </Layout>
    );
  }

  if (error || !me || !status) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step={t("step1")}
            title={t("loadDataFail")}
            desc={t("checkNetwork")}
          />
          <Spacer />
          <Button type="button" onClick={() => window.location.reload()}>
            {t("retry")}
          </Button>
        </Content>
      </Layout>
    );
  }

  const hospitalName = me.clinic.name;
  const { documents, prescription } = status;

  // TODO: status.can_proceed 값으로 "다음 단계" 버튼을 막을 지점인데,
  // 지금 이 화면 디자인엔 별도 버튼이 없어서(처방전 촬영 버튼뿐) 아직 어디에도 안 쓰고 있어요.
  // 다음 단계로 넘어가는 버튼이 이 화면에 추가되면 그때 disabled={!status.can_proceed} 로 연결하면 됩니다.

  return (
    <Layout>
      <Content>
        <LoginTheme
          step={t("step1")}
          title={
            <>
              {hospitalName}{t("receivedFrom1")}
              <br />
              {t("receivedFrom2")}
            </>
          }
          desc={t("dataStorageNotice")}
        />

        <InfoBox>
          {documents.map((doc) => (
            <InfoRow key={doc.key} style={{ justifyContent: "space-between" }}>
              <RowLeft>
                <Icon>{DOCUMENT_ICONS[doc.key] ?? "📄"}</Icon>
                <RowLabel>{t(DOCUMENT_LABEL_KEY[doc.key]) ?? doc.key}</RowLabel>
              </RowLeft>
              {doc.received ? (
                <StatusReceived>{t("received")}</StatusReceived>
              ) : (
                <StatusPending>{t("pending")}</StatusPending>
              )}
            </InfoRow>
          ))}

          <InfoRow style={{ justifyContent: "space-between" }}>
            <RowLeft>
              <Icon>➕</Icon>
              <RowLabel>{t("patientPrescription")}</RowLabel>
            </RowLeft>
            {prescription.registered ? (
              <StatusReceived>{t("registered")}</StatusReceived>
            ) : (
              <StatusAction>{t("registerDirect")}</StatusAction>
            )}
          </InfoRow>
        </InfoBox>

        <Spacer />

        {!prescription.registered && (
          <PromptBox title={t("registerPrescriptionTitle")}>
            <PromptDesc>
              {t("registerPrescriptionDescPrefix")}{" "}<b>{t("registerPrescriptionDescBold")}</b>{t("registerPrescriptionDescSuffix")}
            </PromptDesc>
            <Button type="button" onClick={handleCapturePrescription}>
              {t("capturePrescription")}
            </Button>
          </PromptBox>
        )}

        {/* TODO: 원래 디자인엔 이 화면에 "다음" 버튼이 없었어요.
            처방 등록이 끝나면 더 이상 이 화면에서 할 일이 없어서 넘어갈 방법이
            없길래(=사용자 막힘) 임시로 추가한 버튼입니다.
            팀원과 상의해서 디자인에 맞는 위치/문구로 다시 다듬으면 좋을 것 같아요. */}
        {prescription.registered && (
          <Button type="button" onClick={() => navigate("/onboarding/check")}>
            {t("nextStep")}
          </Button>
        )}

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

const StatusPending = styled.span`
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.text_gray};
  flex-shrink: 0;
`;

const StatusAction = styled.span`
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.main};
  flex-shrink: 0;
`;