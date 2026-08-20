import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { NoticeBox, PromptBox, PromptDesc, DrugBox } from "../components/Box/Box";
import Button, { SubButton } from "../components/Button";
import { useLang } from "../hooks/useLang";

import { confirmPrescription, getPrescriptionDetail } from "../api/prescription";

const PrescriptionResult = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(null);

  // ocr_id는 로컬(캡처 직후 저장된 값)에서만 읽는다. confirm 호출에 필요.
  const [ocrId] = useState(() => {
    const raw = localStorage.getItem("naranhi_prescription_ocr");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.ocr_id ?? null;
  });

  // 약 정보는 API에서 받아온다. (ocr정보는 더 이상 사용하지 않음 — 실패해도 조용히 무시)
  const [ocrData, setOcrData] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(true);

  useEffect(() => {
    if (!ocrId) {
      setOcrLoading(false);
      return undefined;
    }
    let cancelled = false;
    setOcrLoading(true);
    getPrescriptionDetail()
      .then((data) => {
        if (!cancelled) setOcrData(data);
      })
      .catch(() => {
        // ocr정보는 사용하지 않으므로 에러는 무시하고 빈 상태로 둔다.
        if (!cancelled) setOcrData(null);
      })
      .finally(() => {
        if (!cancelled) setOcrLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ocrId]);

const [photoUrl, setPhotoUrl] = useState(null);

useEffect(() => {
  setPhotoUrl(localStorage.getItem("naranhi_prescription_photo"));
}, []);

  const regularDrugs = (ocrData?.items ?? []).filter((item) => !item.is_prn);
  const prnDrugs = (ocrData?.items ?? []).filter((item) => item.is_prn);

  // 시연용 복약 일수 로직 설정
const totalMedicationDays = regularDrugs.length > 0
  ? Math.max(...regularDrugs.map((d) => Number(d.days) || 0))
  : 0;

  const handleRetake = () => navigate("/onboarding/prescription/capture");

  const handleSave = async () => {
    if (!ocrId) {
      setError(t("ocrDataMissing"));
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      const result = await confirmPrescription(ocrId);

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

  if (!ocrId) {
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
          <CapturedPhoto>
            {photoUrl && <CapturedPhotoImg src={photoUrl} alt="" />}
          </CapturedPhoto>
          <PromptDesc>{t("retakeNotice")}</PromptDesc>
        </PromptBox>

        {ocrLoading && <PromptDesc>{t("loading")}</PromptDesc>}

        {!ocrLoading && regularDrugs.length > 0 && (
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

        {!ocrLoading && prnDrugs.length > 0 && (
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
  overflow: hidden;
  position: relative;
`;

const CapturedPhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
