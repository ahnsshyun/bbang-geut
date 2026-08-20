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

import { confirmPrescription, getPrescriptionDetail, getPrescriptionOcr } from "../api/prescription";

const PrescriptionResult = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(null);

  // ocr_id는 로컬(샘플처방전 불러오기 시 저장된 draft 값)에서 읽는다.
  // 이미 확정된 처방전이 있으면 confirm 없이도 진행 가능하므로 필수는 아니다.
  const [ocrId] = useState(() => {
    const raw = localStorage.getItem("naranhi_prescription_ocr");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.ocr_id ?? null;
  });

  const [ocrData, setOcrData] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(true);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setOcrLoading(true);

    // 1) 이미 확정된 처방전이 있는지 먼저 확인한다 — 있으면 그걸 그대로 보여주고
    //    confirm은 다시 호출할 필요가 없다.
    getPrescriptionDetail()
      .then((data) => {
        if (cancelled) return;
        setOcrData(data);
        setAlreadyConfirmed(true);
        setOcrLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // 2) 확정된 처방전이 없으면(404 등) 로컬에 저장된 draft(ocr_id)를 확인한다.
        if (!ocrId) {
          setOcrLoading(false);
          return;
        }
        getPrescriptionOcr()
          .then((data) => {
            if (!cancelled) setOcrData(data);
          })
          .catch(() => {
            if (!cancelled) setOcrData(null);
          })
          .finally(() => {
            if (!cancelled) setOcrLoading(false);
          });
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
    // 이미 확정된 처방전이면 confirm을 다시 호출할 필요 없이 바로 다음 단계로.
    if (alreadyConfirmed) {
      localStorage.setItem("naranhi_prescription_registered", "true");
      navigate("/onboarding/check");
      return;
    }

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

  if (ocrLoading) {
    return (
      <Layout>
        <Content>
          <NoticeBox>{t("loading")}</NoticeBox>
        </Content>
      </Layout>
    );
  }

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
          <CapturedPhoto>
            {photoUrl && <CapturedPhotoImg src={photoUrl} alt="" />}
          </CapturedPhoto>
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
