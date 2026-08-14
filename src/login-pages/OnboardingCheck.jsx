import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { NoticeBox, InfoBox, InfoRow } from "../components/Box";
import Button from "../components/Button";

// TODO(백엔드 연동 시 제거): 병원이 등록한 시술 정보 목업
// 실제 구현 시 수술기록 PDF 파싱값(명세서 3.4) 응답으로 대체
const PROCEDURE_INFO = {
  procedure: "코성형 (융비술)",
  detail: "실리콘 보형물 삽입 + 자기진피 비주 연장 · 1회차",
  surgeryDate: "2026-08-03",
  hospital: "서울 N성형외과의원 · 김서준 원장",
  patient: "사토 유이(SATO YUI)",
  hospitalShortName: "서울 N성형외과의원",
};

const PROCEDURE_ROWS = [
  { label: "시술", value: PROCEDURE_INFO.procedure },
  { label: "상세", value: PROCEDURE_INFO.detail },
  { label: "수술일", value: PROCEDURE_INFO.surgeryDate },
  { label: "병원", value: PROCEDURE_INFO.hospital },
  { label: "환자", value: PROCEDURE_INFO.patient },
];

const OnboardingCheck = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/onboarding/personal");
  };

  return (
    <Layout>
      <Content>
        <LoginTheme
          step="STEP 2/3 · 시술 확인"
          title="시술 정보를 확인해 주세요"
          desc="D+120 회복 루틴의 기준이 돼요"
        />

        <InfoBox>
          {PROCEDURE_ROWS.map((row) => (
            <InfoRow key={row.label}>
              <RowLabel>{row.label}</RowLabel>
              <RowValue>{row.value}</RowValue>
            </InfoRow>
          ))}
        </InfoBox>

        <NoticeSpacing>
          <NoticeBox>
            ⓘ 시술 정보는 병원이 등록하며 환자가 직접 고칠 수 없습니다.
            정보가 다르다면 병원에 알려 주세요.
          </NoticeBox>
        </NoticeSpacing>

        <Spacer />

        <Button type="button" onClick={handleConfirm}>
          맞아요
        </Button>
      </Content>
    </Layout>
  );
};

export default OnboardingCheck;

/* ---------- styles ---------- */

const RowLabel = styled.span`
  width: 48px;
  flex-shrink: 0;
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.text_gray};
  padding-top: 1px;
`;

const RowValue = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111; 
  line-height: 1.5;
`;

const NoticeSpacing = styled.div`
  margin-top: 20px;
`;