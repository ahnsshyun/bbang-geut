import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import CheckinTheme from "../components/CheckinTheme";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import { NoticeBox, InfoBox } from "../components/Box";
import MainButton from "../components/Button";

const STATUS_ITEMS = [
  { key: "swelling", label: "부기" },
  { key: "pain", label: "통증" },
  { key: "bruising", label: "멍" },
];

const LEVELS = [1, 2, 3, 4, 5];

const TODAY_LABEL = "D+4 체크인";
const DATE_LABEL = "2026.08.07";

const CheckinStatus = () => {
  const navigate = useNavigate();

  const [levels, setLevels] = useState({
    swelling: 0,
    pain: 0,
    bruising: 0,
  });

  const allSelected = STATUS_ITEMS.every((item) => levels[item.key] > 0);

  const handleSelect = (key, level) => {
    setLevels((prev) => ({
      ...prev,
      // 같은 값 다시 누르면 선택 해제되도록
      [key]: prev[key] === level ? 0 : level,
    }));
  };

  const handleSave = () => {
    if (!allSelected) return;
    // TODO: 백엔드 업로드 연동
    navigate("/checkin/complete");
  };

  return (
    <Layout>
      <Content>
        <CheckinTheme
          title={TODAY_LABEL}
          date={DATE_LABEL}
          onClose={() => navigate("/home")}
          totalSteps={3}
          currentStep={2}
        />

        <SectionTitle>오늘의 상태 기록</SectionTitle>

        <InfoBox style={{padding: "20px", gap: "20px", display: "flex", flexDirection: "column"}}>
          {STATUS_ITEMS.map((item) => (
            <StatusRow key={item.key}>
              <StatusRowHeader>
                <StatusLabel>{item.label}</StatusLabel>
                {levels[item.key] === 0 && <StatusHint>빈칸을 눌러주세요</StatusHint>}
              </StatusRowHeader>
              <LevelTrack>
                {LEVELS.map((level) => (
                  <LevelBox
                    key={level}
                    type="button"
                    $level={level}
                    $selected={levels[item.key] >= level}
                    onClick={() => handleSelect(item.key, level)}
                    aria-label={`${item.label} ${level}단계`}
                  />
                ))}
              </LevelTrack>
            </StatusRow>
          ))}
        </InfoBox>

        <Spacer />

        <NoticeBox>
          수치나 정상/이상 판정은 표시하지 않습니다. 
          <br/>변화의 흐름만 남깁니다.
        </NoticeBox>

        <Spacer />

        <MainButton disabled={!allSelected} onClick={handleSave}>
          저장하기
        </MainButton>
      </Content>
    </Layout>
  );
};

export default CheckinStatus;

/* ---------- styles ---------- */

const SectionTitle = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 0 0 12px;
`;

const StatusRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusRowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusLabel = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111;
`;

const StatusHint = styled.span`
  ${font("regbody")}
  font-size: 12px;
  color: ${COLORS.text_gray};
`;

const LevelTrack = styled.div`
  display: flex;
  gap: 6px;
`;

// 단계가 높을수록 진해지는 보라색 (1~5단계)
const LEVEL_COLORS = [
  "#E4DEFB", // 1
  "#C6B8F7", // 2
  "#A78CF2", // 3
  "#8865EC", // 4
  COLORS.main, // 5
];

const LevelBox = styled.button`
  flex: 1;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: ${({ $selected, $level }) => ($selected ? LEVEL_COLORS[$level - 1] : "#F0F0F3")};
  cursor: pointer;
  transition: background 0.15s ease;
`;