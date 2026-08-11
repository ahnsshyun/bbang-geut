import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";

// TODO(백엔드 연동 시 제거): 병원이 등록한 시술 정보 목업
// 실제 구현 시 수술기록 PDF 파싱값(명세서 3.4) 응답으로 대체
const PROCEDURE_INFO = {
  procedure: "코성형 (융비술)",
  detail: "실리콘 보형물 삽입 + 자기진피 비주 연장 · 1회차",
  surgeryDate: "2026-08-03",
  hospital: "서울 N성형외과의원 · 김서준 원장",
  patient: "사토 유이(SATO YUI)",
  hospitalShortName: "서울 N성형외과의원",
};

const OnboardingCheck = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/onboarding/personal");
  };

  return (
    <Layout>
      <Content>
        <StepBadge>STEP 2/3 · 시술 확인</StepBadge>

        <Title>맞게 불러왔는지 확인해 주세요</Title>

        <Desc>자동으로 확정하지 않아요. 이 값이 D+120 루틴의 기준이 돼요</Desc>

        <Card>
          <Row>
            <RowLabel>시술</RowLabel>
            <RowValue>{PROCEDURE_INFO.procedure}</RowValue>
          </Row>
          <Row>
            <RowLabel>상세</RowLabel>
            <RowValue>{PROCEDURE_INFO.detail}</RowValue>
          </Row>
          <Row>
            <RowLabel>수술일</RowLabel>
            <RowValue>{PROCEDURE_INFO.surgeryDate}</RowValue>
          </Row>
          <Row>
            <RowLabel>병원</RowLabel>
            <RowValue>{PROCEDURE_INFO.hospital}</RowValue>
          </Row>
          <Row>
            <RowLabel>환자</RowLabel>
            <RowValue>{PROCEDURE_INFO.patient}</RowValue>
          </Row>
        </Card>

        <NoticeCard>
          ⓘ 시술 정보는 병원이 등록한 정보라 환자가 직접 고칠 수 없습니다.
          정보가 다르다면 {PROCEDURE_INFO.hospitalShortName} 국제진료팀에 알려
          주세요 - 병원이 수정하면 이 화면에 바로 반영됩니다.
        </NoticeCard>

        <Spacer />

        <ConfirmButton type="button" onClick={handleConfirm}>
          맞아요
        </ConfirmButton>
      </Content>
    </Layout>
  );
};

export default OnboardingCheck;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  text-align: left;
`;

const StepBadge = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 10px 0 24px;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const RowLabel = styled.span`
  width: 48px;
  flex-shrink: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  padding-top: 1px;
`;

const RowValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

const NoticeCard = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textBody};
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 24px;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  cursor: pointer;
`;