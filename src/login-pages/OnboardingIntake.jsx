import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { NoticeBox, PromptBox, PromptDesc, InfoBox, InfoRow } from "../components/Box";
import Button from "../components/Button";

import { useMe } from "../hooks/useMe";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";

const SERVICE_NAME = "나란히";

// 문서 key별 아이콘 매핑. API가 새 문서 종류를 추가해도 깨지지 않도록 기본값(📄) 둠.
const DOCUMENT_ICONS = {
  surgery_record: "🧾",
  instructions: "📄",
  appointments: "🗓️",
};

const OnboardingIntake = () => {
  const navigate = useNavigate();
  const { me, loading: meLoading, error: meError } = useMe();
  const { status, loading: statusLoading, error: statusError } = useOnboardingStatus();

  const loading = meLoading || statusLoading;
  const error = meError || statusError;

  const handleCapturePrescription = () => navigate("/onboarding/prescription/capture");

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme step="STEP 1/3 · 자료 수신" title="자료를 불러오고 있어요" />
        </Content>
      </Layout>
    );
  }

  if (error || !me || !status) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step="STEP 1/3 · 자료 수신"
            title="자료를 불러오지 못했어요"
            desc="네트워크 상태를 확인하고 다시 시도해 주세요"
          />
          <Spacer />
          <Button type="button" onClick={() => window.location.reload()}>
            다시 시도
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
          step="STEP 1/3 · 자료 수신"
          title={
            <>
              {hospitalName}에서
              <br />
              회복 자료를 받았습니다.
            </>
          }
          desc="정보는 기기 안에만 보관되며, 병원에만 전송됩니다."
        />

        <InfoBox>
          {documents.map((doc) => (
            <InfoRow key={doc.key} style={{ justifyContent: "space-between" }}>
              <RowLeft>
                <Icon>{DOCUMENT_ICONS[doc.key] ?? "📄"}</Icon>
                <RowLabel>{doc.label}</RowLabel>
              </RowLeft>
              {doc.received ? (
                <StatusReceived>받음</StatusReceived>
              ) : (
                <StatusPending>대기중</StatusPending>
              )}
            </InfoRow>
          ))}

          <InfoRow style={{ justifyContent: "space-between" }}>
            <RowLeft>
              <Icon>➕</Icon>
              <RowTextGroup>
                <RowLabel>환자보관용 처방전</RowLabel>
                {prescription.registered && prescription.summary && (
                  <RowSubLabelSuccess>{prescription.summary}</RowSubLabelSuccess>
                )}
              </RowTextGroup>
            </RowLeft>
            {prescription.registered ? (
              <StatusReceived>등록됨</StatusReceived>
            ) : (
              <StatusAction>직접 등록</StatusAction>
            )}
          </InfoRow>
        </InfoBox>

        <Spacer />

        {!prescription.registered && (
          <PromptBox title="처방전을 직접 등록해주세요">
            <PromptDesc>
              처방전을 촬영하면{" "}<b>약물명 · 1회 투여량 · 1일 투여 횟수 · 복용 기간</b>을 읽어
              복약 가이드로 만들어 드려요.
            </PromptDesc>
            <Button type="button" onClick={handleCapturePrescription}>
              📷 처방전 촬영하기
            </Button>
          </PromptBox>
        )}

        {/* TODO: 원래 디자인엔 이 화면에 "다음" 버튼이 없었어요.
            처방 등록이 끝나면 더 이상 이 화면에서 할 일이 없어서 넘어갈 방법이
            없길래(=사용자 막힘) 임시로 추가한 버튼입니다.
            팀원과 상의해서 디자인에 맞는 위치/문구로 다시 다듬으면 좋을 것 같아요. */}
        {prescription.registered && (
          <Button type="button" onClick={() => navigate("/onboarding/check")}>
            다음 단계로
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

const RowSubLabelSuccess = styled.span`
  ${font("regbody")}
  font-size: 11px;
  color: ${COLORS.text_green};
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