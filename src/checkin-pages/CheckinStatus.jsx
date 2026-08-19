import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import CheckinTheme from "../components/Theme/CheckinTheme";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import { NoticeBox, InfoBox, ErrorBox } from "../components/Box/Box";
import MainButton from "../components/Button";
import { useLang } from "../hooks/useLang";

import { useCheckin } from "../hooks/useCheckin";
import { putCheckinSymptoms, completeCheckin } from "../api/checkins";

const LEVELS = [1, 2, 3, 4, 5];

function formatDotDate(isoDate) {
  return isoDate ? isoDate.replaceAll("-", ".") : "";
}

const CheckinStatus = () => {
  const navigate = useNavigate();
  const { checkin, loading, error } = useCheckin();
  const { t } = useLang();

  const SYMPTOM_LABELS = {
    swelling: t("symptomSwelling"),
    pain: t("symptomPain"),
    bruise: t("symptomBruise"),
  };

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

      localStorage.setItem(
        "naranhi_checkin_result",
        JSON.stringify({ ...result, date: checkin.date })
      );

      navigate("/checkin/complete");
    } catch (err) {
      setSaveError(err.response?.data?.error?.message || t("saveInProgressError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Content>
          <p>{t("loadingCheckin")}</p>
        </Content>
      </Layout>
    );
  }

  if (error || !checkin) {
    return (
      <Layout>
        <Content>
          <ErrorBox>{t("loadingCheckinError")}</ErrorBox>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content>
        <CheckinTheme
          title={`D+${checkin.day} ${t("checkinTitle")}`}
          date={formatDotDate(checkin.date)}
          onClose={() => navigate("/home")}
          totalSteps={3}
          currentStep={2}
        />

        <SectionTitle>{t("todayStatusRecord")}</SectionTitle>

        <InfoBox style={{ padding: "20px", gap: "20px", display: "flex", flexDirection: "column" }}>
          {statusItems.map((item) => (
            <StatusRow key={item.key}>
              <StatusRowHeader>
                <StatusLabel>{item.label}</StatusLabel>
                {levels[item.key] === 0 && <StatusHint>{t("pleaseSelect")}</StatusHint>}
              </StatusRowHeader>
              <LevelTrack>
                {LEVELS.map((level) => (
                  <LevelBox
                    key={level}
                    type="button"
                    $level={level}
                    $selected={levels[item.key] >= level}
                    onClick={() => handleSelect(item.key, level)}
                    aria-label={`${item.label} ${level}${t("level")}`}
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
            {t("statusNoticeLine1")}
            <br />
            {t("statusNoticeLine2")}
          </NoticeBox>
        )}

        <Spacer />

        <MainButton disabled={!allSelected || isSaving} onClick={handleSave}>
          {isSaving ? t("saving") : t("save")}
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