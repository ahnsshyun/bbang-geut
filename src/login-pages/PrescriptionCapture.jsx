import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { ToastOverlay } from "../components/Box/Box";
import { SubButton, ShutterButton } from "../components/Button";
import { useLang } from "../hooks/useLang";

import { getPrescriptionOcr } from "../api/prescription";

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

    // UI 연출용 미리보기만 생성 — 서버에는 업로드하지 않음
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    handleCapture();
  };

  const handleCapture = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const result = await getPrescriptionOcr();
      localStorage.setItem("naranhi_prescription_ocr", JSON.stringify(result));
      navigate("/onboarding/prescription/result");
    } catch (err) {
      setError(err.response?.data?.message || t("ocrError"));
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
  margin: 28px 0;
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