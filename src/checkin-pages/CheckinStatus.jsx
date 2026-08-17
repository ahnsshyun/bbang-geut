import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import CheckinTheme from "../components/CheckinTheme";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import { NoticeBox, InfoBox, ErrorBox } from "../components/Box";
import MainButton from "../components/Button";

import { useCheckin } from "../hooks/useCheckin";
import { putCheckinSymptoms, completeCheckin } from "../api/checkins";

// symptom_terms key → 화면 표시 라벨. 목록에 없는 새 term이 오면 key를 그대로 보여줌(안 깨지게).
const SYMPTOM_LABELS = {
  swelling: "부기",
  pain: "통증",
  bruise: "멍",
};

const LEVELS = [1, 2, 3, 4, 5];

function formatDotDate(isoDate) {
  return isoDate ? isoDate.replaceAll("-", ".") : "";
}

const CheckinStatus = () => {
  const navigate = useNavigate();
  const { checkin, loading, error } = useCheckin();

  const [levels, setLevels] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!checkin) return;
    setLevels(Object.fromEntries(checkin.symptomTerms.map((key) => [key, 0])));
  }, [checkin]);

  const statusItems = checkin
    ? checkin.symptomTerms.map((key) => ({ key, label: SYMPTOM_LABELS[key] ?? key }))
    : [];

  const allSelected = statusItems.length > 0 && statusItems.every((item) => levels[item.key] > 0);

  const handleSelect = (key, level) => {
    setLevels((prev) => ({
      ...prev,
      [key]: prev[key] === level ? 0 : level,
    }));
  };

  const handleSave = async () => {
    if (!allSelected || !checkin || isSaving) return;

    setSaveError("");
    setIsSaving(true);
    try {
      await putCheckinSymptoms({ checkinId: checkin.checkinId, symptoms: levels });
      const result = await completeCheckin({ checkinId: checkin.checkinId });

      // TODO: 전역 상태/서버 세션이 없어 다음 화면(완료)으로 값 전달용으로 localStorage 사용
      localStorage.setItem(
        "naranhi_checkin_result",
        JSON.stringify({ ...result, date: checkin.date })
      );

      navigate("/checkin/complete");
    } catch (err) {
      setSaveError(
        err.response?.data?.error?.message ||
          "저장 중 문제가 발생했어요. 사진 3컷이 모두 등록됐는지 확인해 주세요."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Content>
          <p>체크인 정보를 불러오고 있어요...</p>
        </Content>
      </Layout>
    );
  }

  if (error || !checkin) {
    return (
      <Layout>
        <Content>
          <ErrorBox>체크인을 불러오지 못했어요. 네트워크 상태를 확인해 주세요.</ErrorBox>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content>
        <CheckinTheme
          title={`D+${checkin.day} 체크인`}
          date={formatDotDate(checkin.date)}
          onClose={() => navigate("/home")}
          totalSteps={3}
          currentStep={2}
        />

        <SectionTitle>오늘의 상태 기록</SectionTitle>

        <InfoBox style={{ padding: "20px", gap: "20px", display: "flex", flexDirection: "column" }}>
          {statusItems.map((item) => (
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

        {saveError ? (
          <ErrorBox>{saveError}</ErrorBox>
        ) : (
          <NoticeBox>
            수치나 정상/이상 판정은 표시하지 않습니다.
            <br />
            변화의 흐름만 남깁니다.
          </NoticeBox>
        )}

        <Spacer />

        <MainButton disabled={!allSelected || isSaving} onClick={handleSave}>
          {isSaving ? "저장 중..." : "저장하기"}
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

const LEVEL_COLORS = [
  "#E4DEFB",
  "#C6B8F7",
  "#A78CF2",
  "#8865EC",
  COLORS.main,
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