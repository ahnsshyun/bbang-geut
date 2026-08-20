import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { ToastOverlay } from "../components/Box/Box";
import { SubButton, ShutterButton, MockButton } from "../components/Button";
import { useLang } from "../hooks/useLang";
import { getPrescriptionOcr } from "../api/prescription";
import mockPrescriptionImg from "../assets/mockPrescription.png";

const PrescriptionCapture = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleShutterClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

  // Result 화면에서도 보여주기 위해 Base64로 변환해 저장
  const reader = new FileReader();
  reader.onloadend = () => {
    localStorage.setItem("naranhi_prescription_photo", reader.result);
  };
  reader.readAsDataURL(file);

    handleCapture(file);
  };

  const handleUseMockPrescription = async () => {
    setPreviewUrl(mockPrescriptionImg);
    try {
      const res = await fetch(mockPrescriptionImg);
      const blob = await res.blob();
      const file = new File([blob], "mock-prescription.jpg", { type: blob.type });

    // 목업 이미지도 동일하게 저장
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("naranhi_prescription_photo", reader.result);
    };
    reader.readAsDataURL(blob);

      await handleCapture(file, { silent: true });
    } catch (err) {
      setError(t("ocrError"));
    }
  };

  const handleCapture = async (file, { silent = false } = {}) => {
    setIsScanning(true);
    setError(null);
    try {
      const result = await getPrescriptionOcr(file);
      localStorage.setItem("naranhi_prescription_ocr", JSON.stringify(result));
      navigate("/onboarding/prescription/result");
    } catch (err) {
      if (silent) {
        navigate("/onboarding/prescription/result");
        return;
      }
      setError(t("useMockPrescriptionPrompt"));
      setIsScanning(false);
    }
  };

  return (
    <Layout>
      <Content>
        <LoginTheme
          step={t("step1")}
          title={t("capturePrescriptionTitle")}
          desc={<>{t("capturePrescriptionDesc")}</>}
        />

        <CameraFrame>
          {previewUrl && <PreviewImage src={previewUrl} alt="" />}
        </CameraFrame>

        <ShutterArea>
          <ShutterButton onClick={handleShutterClick} ariaLabel={t("shootPrescription")} disabled={isScanning} />

          <MockButton type="button" onClick={handleUseMockPrescription} disabled={isScanning}>
            {t("useMockPrescription")}
          </MockButton>
        </ShutterArea>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <Spacer />

        <SubButton onClick={() => navigate("/onboarding/intake")}>
          {t("back")}
        </SubButton>
      </Content>

      {isScanning && (
        <ToastOverlay title={t("readingPrescription")} />
      )}
    </Layout>
  );
};

export default PrescriptionCapture;

/* ---------- styles ---------- */

const CameraFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  background: #e0e0e0;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ShutterArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
`;

const ShutterCaption = styled.p`
  font-family: ${FONTS.roles.regbody};
  font-size: 13px;
  color: ${COLORS.text_gray};
  margin: 0;
`;

const ErrorText = styled.p`
  ${font("regbody")}
  color: ${COLORS.error};
  text-align: center;
  margin: 12px 0 0;
`;