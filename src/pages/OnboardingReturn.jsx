import React from 'react'
import styled from 'styled-components';
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";
import Button from "../components/Button";

import Calendar from "../components/Calendar";
import { Box, Row } from "../components/InfoBox";

import { diffDays, formatDate } from "../utils/dateUtils"; //테스트용
import { useState } from "react";

const OnboardingReturn = () => {
  const navigate = useNavigate();
  
  // 임시 가짜 시술일 (백엔드 연결 전까지는 오늘 날짜로 고정해서 테스트)
      const [procedureDate] = useState(new Date());
      const [returnDate, setReturnDate] = useState(null);
    
      const returnDay = returnDate ? diffDays(procedureDate, returnDate) : null;

  return (
    <>
    <Layout>
      <Content>
        <Badge>STEP 2/3</Badge>
        <Title>귀국일을 알려주세요</Title>
        <Desc>귀국 후엔 현지 날씨·UV를 반영해 안내해요</Desc>
        
        <Calendar
          selectedDate={returnDate}
          onSelect={setReturnDate}
          minDate={procedureDate} // 시술일 이전 선택 불가
        />

        {returnDate && (
          <Box>
            <span>✈️ 시술 후 <b>{formatDate(returnDate)}</b>에 귀국</span>
            <Badge>D+{returnDay}</Badge>
          </Box>
        )}

        <Button onClick={() => navigate("/onboarding/lang")}>
        다음으로
        </Button>

      </Content>  
      </Layout>
    </>
  )
}

export default OnboardingReturn


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
