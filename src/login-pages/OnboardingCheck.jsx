import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { NoticeBox, InfoBox, InfoRow } from "../components/Box";
import Button from "../components/Button";

import { getSurgeryInfo } from "../api/onboarding";

const OnboardingCheck = () => {
  const navigate = useNavigate();
  const [surgery, setSurgery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: 응답의 surgery.editable(현재 예시는 false)은 아직 화면에서 안 쓰고 있어요.
  // 나중에 true인 케이스가 생기면(환자가 직접 수정 가능한 시술 정보) 수정 UI를 붙여야 해요.

  useEffect(() => {
    let cancelled = false;

    getSurgeryInfo()
      .then((data) => {
        if (!cancelled) setSurgery(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleConfirm = () => {
    navigate("/onboarding/personal");
  };

  if (loading) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step="STEP 2/3 · 시술 확인"
            title="시술 정보를 불러오고 있어요"
          />
        </Content>
      </Layout>
    );
  }

  if (error || !surgery) {
    return (
      <Layout>
        <Content>
          <LoginTheme
            step="STEP 2/3 · 시술 확인"
            title="시술 정보를 불러오지 못했어요"
            desc="네트워크 상태를 확인하고 다시 시도해 주세요"
          />
          <Spacer />
          <Button type="button" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content>
        <LoginTheme
          step="STEP 2/3 · 시술 확인"
          title="시술 정보를 확인해 주세요"
          desc="D+120 회복 루틴의 기준이 돼요"
        />

        <InfoBox>
          {surgery.rows.map((row) => (
            <InfoRow key={row.label}>
              <RowLabel>{row.label}</RowLabel>
              <RowValue>{row.value}</RowValue>
            </InfoRow>
          ))}
        </InfoBox>

        <NoticeSpacing>
          <NoticeBox>ⓘ {surgery.notice}</NoticeBox>
        </NoticeSpacing>

        <Spacer />

        <Button type="button" onClick={handleConfirm}>
          맞아요
        </Button>
      </Content>
    </Layout>
  );
};

export default OnboardingCheck;

/* ---------- styles ---------- */

const RowLabel = styled.span`
  width: 48px;
  flex-shrink: 0;
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.text_gray};
  padding-top: 1px;
`;

const RowValue = styled.span`
  ${font("boldbody")}
  font-size: 14px;
  color: #111111; 
  line-height: 1.5;
`;

const NoticeSpacing = styled.div`
  margin-top: 20px;
`;