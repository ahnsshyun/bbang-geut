import React from 'react'
import styled from 'styled-components';
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";
import Button from "../components/Button";

import { Box, Row } from "../components/InfoBox";

const OnboardingCheck = () => {
  const navigate = useNavigate();

  return (
    <>
      <Layout>
      <Content>
        <Badge>STEP 1/3</Badge>
        <Title>시술 정보를 <br />확인해주세요</Title>
        <Box>
        <Row><span>시술</span><b>리쥬란 힐러 · 1회차</b></Row>
        <Row><span>병원</span><b>서현클리닉</b></Row>
        <Row><span>시술일</span><b>8월 1일 (현재 D+0)</b></Row>
        </Box>
        <Desc>
          💡 병원 QR로 진입하면 
          <br />  시술일·시술 종류가 자동 등록돼요. 
          <br />  모든 가이드가 이 날짜를 기준으로 계산돼요.
        </Desc>

        <Button onClick={() => navigate("/onboarding/return")}>
        맞아요, 다음으로
        </Button>
      </Content>   
      </Layout>
    </>
  )
}

export default OnboardingCheck


const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 15px;
  width: 100%;
`;


const Badge = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryHover};
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.radius.badge};
  padding: 4px 12px;
`;

const Desc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;
