import React from 'react'
import styled from 'styled-components';
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";
import Button from "../components/Button";

const OnboardingWelcome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Layout>
        <Content>
        <IconCircle>💙</IconCircle>
        <Badge>병원 QR로 접속됨</Badge>
        <Title>SKIN RECOVER<br />애프터케어에 오신 것을 환영해요</Title>
        <Desc>
          귀국 후에도 회복 과정을 모국어로 안내받고,
          <br />필요할 때만 병원과 연결돼요.
        </Desc>
        <Button onClick={() => navigate ("/onboarding/check")}>
        시작하기
        </Button>
        </Content>    
      </Layout>
    </>
  )
}

export default OnboardingWelcome

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

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
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
