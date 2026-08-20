import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { NoticeBox, InfoBox, InfoRow } from "../components/Box/Box";
import Button from "../components/Button";
import { useLang, getCurrentLang } from "../hooks/useLang";

import { getSurgeryInfo } from "../api/onboarding";
import { getStoredPatient } from "../api/auth";

const ROW_LABEL_KEY = {
  procedure_type: "rowProcedureType",
  detail: "rowDetail",
  clinic: "rowClinic",
  patient: "rowPatient",
  surgery_date: "rowSurgeryDate",
};

const OnboardingCheck = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [surgery, setSurgery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: 응답의 surgery.editable(현재 예시는 false)은 아직 화면에서 안 쓰고 있어요.
  // 나중에 true인 케이스가 생기면(환자가 직접 수정 가능한 시술 정보) 수정 UI를 붙여야 해요.

  useEffect(() => {
    let cancelled = false;

    const lang = getCurrentLang();

    getSurgeryInfo({ lang })
      .then((data) => {
        if (!cancelled) setSurgery(data);
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

  const handleConfirm = () => {
    navigate("/onboarding/personal");
  };

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step={t("step2")}
            title={t("loadingSurgeryInfo")}
          />
        </Content>
      </Layout>
    );
  }

  if (error || !surgery) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step={t("step2")}
            title={t("surgeryInfoLoadFail")}
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

  return (
    <Layout>
      <Content>
        <LoginTheme
          step={t("step2")}
          title={t("confirmSurgeryTitle")}
          desc={t("confirmSurgeryDesc")}
        />

        <InfoBox>
          {surgery.rows.map((row) => (
            <InfoRow key={row.key}>
              <RowLabel>{t(ROW_LABEL_KEY[row.key]) ?? row.key}</RowLabel>
              <RowValue>{row.value}</RowValue>
            </InfoRow>
          ))}
        </InfoBox>

        <Spacer />

        <NoticeBox>ⓘ {t("surgeryInfoNotice")}</NoticeBox>
        
        <Spacer />

        <Button type="button" onClick={handleConfirm}>
          {t("confirmYes")}
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

