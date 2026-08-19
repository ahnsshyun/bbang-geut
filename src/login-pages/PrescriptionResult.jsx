import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { NoticeBox, PromptBox, PromptDesc, DrugBox } from "../components/Box/Box";
import Button, { SubButton } from "../components/Button";
import { useLang } from "../hooks/useLang";

import { confirmPrescription } from "../api/prescription";

const PrescriptionResult = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(null);

  const [ocrData] = useState(() => {
    const raw = localStorage.getItem("naranhi_prescription_ocr");
    return raw ? JSON.parse(raw) : null;
  });

  const regularDrugs = (ocrData?.items ?? []).filter((item) => !item.is_prn);
  const prnDrugs = (ocrData?.items ?? []).filter((item) => item.is_prn);

  const handleRetake = () => navigate("/onboarding/prescription/capture");

  const handleSave = async () => {
    if (!ocrData?.ocr_id) {
      setError(t("ocrDataMissing"));
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      const result = await confirmPrescription(ocrData.ocr_id);

      const summary = {
        firstDrugName: regularDrugs[0]?.drug_name ?? "",
        regularCount: result.regular_count,
        dailyFreq: regularDrugs[0]?.times_per_day ?? "",
        totalDays: regularDrugs[0]?.days ?? "",
        prnCount: result.prn_count,
      };

      localStorage.setItem("naranhi_prescription_registered", "true");
      localStorage.setItem("naranhi_prescription_summary", JSON.stringify(summary));
      localStorage.setItem("naranhi_prescription_confirmed", JSON.stringify(result));
      navigate("/onboarding/check");
    } catch (err) {
      const code = err.response?.data?.error?.code;
      const message = err.response?.data?.error?.message;

      if (code === "OCR_DRAFT_EXPIRED") {
        setError(message || t("ocrExpired"));
      } else if (code === "PRESCRIPTION_ALREADY_CONFIRMED") {
        localStorage.setItem("naranhi_prescription_registered", "true");
        navigate("/onboarding/check");
        return;
      } else if (code === "OCR_DRAFT_NOT_FOUND") {
        setError(t("ocrDraftNotFound"));
      } else {
        setError(message || t("confirmError"));
      }
    } finally {
      setIsConfirming(false);
    }
  };

  if (!ocrData) {
    return (
      <Layout>
        <Content>
          <NoticeBox>
            {t("ocrDataMissing")}
          </NoticeBox>
          <Spacer />
          <SubButton type="button" onClick={handleRetake}>
            {t("retakePrescription")}
          </SubButton>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content>
<LoginTheme
  step={t("step1")}
  title={t("confirmInfoTitle")}
  desc={
    <>
      {t("confirmInfoDescPrefix")} <b>{t("confirmInfoDescBold")}</b>
      {t("confirmInfoDescSuffix")}
    </>
  }
/>

        <PromptBox>
          <CapturedPhoto />
          <PromptDesc>{t("retakeNotice")}</PromptDesc>
        </PromptBox>

        {regularDrugs.length > 0 && (
          <>
            <SectionHeading>🟢 {t("regularDrugCount")} {regularDrugs.length}{t("drugUnit")}</SectionHeading>
            {regularDrugs.map((drug) => (
              <DrugBox
                key={drug.seq}
                badge={drug.category}
                name={drug.drug_name}
                ingredient={drug.drug_name}
                amount={drug.dose}
                frequency={drug.times_per_day}
                duration={drug.days}
                instruction={drug.usage}
              />
            ))}
          </>
        )}

        {prnDrugs.length > 0 && (
          <>
            <SectionHeading>🟡 {t("prnDrugCount")} {prnDrugs.length}{t("drugUnit")}</SectionHeading>
            {prnDrugs.map((drug) => (
              <DrugBox
                key={drug.seq}
                badge={drug.category}
                name={drug.drug_name}
                ingredient={drug.drug_name}
                amount={drug.dose}
                frequency={drug.times_per_day}
                duration={drug.days}
                instruction={drug.usage}
                asNeeded
              />
            ))}
          </>
        )}

        <Spacer />

        <NoticeBox>
          <b>{t("regularDrugNoticeBold")}</b>{t("regularDrugNoticeSuffix")}
          <br />
          <b>{t("prnDrugNoticeBold")}</b>{t("prnDrugNoticeSuffix")}
          <br />
          {t("medicationInquiryNotice")}
        </NoticeBox>

        {error && <ErrorText>{error}</ErrorText>}

        <ButtonGroup>
          <Button type="button" onClick={handleSave} disabled={isConfirming}>
            {isConfirming ? t("saving") : t("confirmSave")}
          </Button>
          <SubButton type="button" onClick={handleRetake}>
            {t("retakeShoot")}
          </SubButton>
        </ButtonGroup>
      </Content>
    </Layout>
  );
};

export default PrescriptionResult;

/* ---------- styles ---------- */

const CapturedPhoto = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  background: #e0e0e0;
`;

const SectionHeading = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  margin: 24px 0 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
`;

const ErrorText = styled.p`
  ${font("regbody")}
  color: ${COLORS.error};
  text-align: center;
  margin: 12px 0 0;
`;