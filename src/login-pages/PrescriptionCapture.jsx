import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { ToastOverlay } from "../components/Box";
import { SubButton, ShutterButton } from "../components/Button";

const SCAN_STEPS = ["처방전 인식", "의약품 항목 5건 추출", "정기 복용 · 필요시 복용 구분"];

const PrescriptionCapture = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!isScanning) return undefined;
    // 명세서: 촬영 후 1.3초 지연 뒤 고정된 샘플 결과 반환
    const timer = setTimeout(() => {
      navigate("/onboarding/prescription/result");
    }, 1300);
    return () => clearTimeout(timer);
  }, [isScanning, navigate]);

  const handleCapture = () => {
    // TODO: 백엔드 API 연동 — 실제 카메라 촬영 + OCR 엔진 전달
    setIsScanning(true);
  };

  return (
    <Layout>
      <Content>
        <LoginTheme
          step="STEP 1/3 · 자료 수신"
          title="처방전을 촬영해주세요"
          desc={
            <>
              병원에서 받은 환자보관용 처방전을 촬영 프레임 안에 맞춰주세요.
            </>
          }
        />

        <CameraFrame />

        <ShutterArea>
          <ShutterButton onClick={handleCapture} ariaLabel="처방전 촬영" />
        </ShutterArea>

        <Spacer />

        <SubButton onClick={() => navigate("/onboarding/intake")}>
          뒤로
        </SubButton>
      </Content>

      {isScanning && (
        <ToastOverlay title="처방전을 읽고 있어요"/>
      )}
    </Layout>
  );
};

export default PrescriptionCapture;

/* ---------- styles ---------- */

const CameraFrame = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  background: #e0e0e0; 
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

