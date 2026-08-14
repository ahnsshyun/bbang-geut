import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import CheckinTheme from "../components/CheckinTheme";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import { NoticeBox } from "../components/Box";
import MainButton, { ShutterButton, CloseButton } from "../components/Button";

import faceGuideFront from "../assets/faceGuideFront.svg";
import faceGuideLeft from "../assets/faceGuideLeft.svg";
import faceGuideRight from "../assets/faceGuideRight.svg";

const STEPS = [
  { key: "front", label: "정면", shortLabel: "정면 컷", guideImage: faceGuideFront },
  { key: "left", label: "좌측", shortLabel: "좌측 컷", guideImage: faceGuideLeft },
  { key: "right", label: "우측", shortLabel: "우측 컷", guideImage: faceGuideRight },
];

const TODAY_LABEL = "D+4 체크인";
const DATE_LABEL = "2026.08.07";

const CheckinPhoto = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [photos, setPhotos] = useState({ front: null, left: null, right: null });

  const currentStep = STEPS[stepIndex];
  const capturedCount = Object.values(photos).filter(Boolean).length;
  const isCurrentCaptured = !!photos[currentStep.key];
  const isLastStep = stepIndex === STEPS.length - 1;

  const handleShutterClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos((prev) => ({ ...prev, [currentStep.key]: url }));
    e.target.value = "";
  };

  const handleNext = () => {
    if (!isCurrentCaptured) return;
    if (isLastStep) {
      // TODO: 백엔드 업로드 연동
      navigate("/checkin/status");
      return;
    }
    setStepIndex((prev) => prev + 1);
  };

  const handleTabClick = (index) => {
    const targetKey = STEPS[index].key;
    if (photos[targetKey] || index <= stepIndex) {
      setStepIndex(index);
    }
  };

  return (
    <Layout>
      <Content>
        <CheckinTheme
          title={TODAY_LABEL}
          date={DATE_LABEL}
          onClose={() => navigate("/home")}
          totalSteps={3}
          currentStep={1}
        />

        <RecordRow>
          <RecordLabel>변화 기록</RecordLabel>
          <RecordCount>{capturedCount}/3</RecordCount>
        </RecordRow>

        <CameraFrame>
          {photos[currentStep.key] ? (
            <PreviewImage src={photos[currentStep.key]} alt={currentStep.label} />
          ) : (
            <GuideBox>
              <GuideSilhouette src={currentStep.guideImage} alt={`${currentStep.label} 가이드`} />
            </GuideBox>
          )}
        </CameraFrame>

        <TabRow>
          {STEPS.map((step, i) => {
            const done = !!photos[step.key];
            const active = i === stepIndex;
            return (
              <TabButton
                key={step.key}
                type="button"
                $active={active}
                $done={done}
                onClick={() => handleTabClick(i)}
              >
                {done && "✓ "}
                {step.label}
              </TabButton>
            );
          })}
        </TabRow>

        <ShutterArea>
          
          <ShutterButton onClick={handleShutterClick} ariaLabel={`${currentStep.label} 촬영`} />
          
          <Spacer/>
          
          <NoticeBox>
            반투명 기준 일러스트에 얼굴을 맞춰 주세요
            <br />
            매일 같은 각도로 찍을수록 변화가 정확하게 보여요
          </NoticeBox>
        </ShutterArea>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Spacer />

        <MainButton disabled={!isCurrentCaptured} onClick={handleNext}>
          {isLastStep ? "완료" : "다음"}
        </MainButton>
      </Content>
    </Layout>
  );
};

export default CheckinPhoto;

/* ---------- styles ---------- */

const RecordRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const RecordLabel = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
`;

const RecordCount = styled.span`
  ${font("boldbody")}
  font-size: 16px;
  color: ${COLORS.main};
`;

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

const GuideBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  box-sizing: border-box;
`;

const GuideSilhouette = styled.img`
  width: 400px;
  height: 400px;
  opacity: 0.35;
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: 10px;
  border: 1px solid
    ${({ $active, $done }) => ($active ? COLORS.main : $done ? COLORS.text_green : COLORS.border)};
  background: ${({ $active, $done }) =>
    $active ? COLORS.background_lightpurple : $done ? "#E7F7EE" : "#ffffff"};
  color: ${({ $active, $done }) => ($active ? COLORS.main : $done ? COLORS.text_green : COLORS.text_gray)};
  ${font("boldbody")}
  font-size: 13px;
  cursor: pointer;
`;

const ShutterArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 28px 0;
`;
