import React, { useState } from 'react'
import styled from 'styled-components';
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";
import Button from "../components/Button";

const LANGUAGES = [
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

const OnboardingLang = () => {
  const navigate = useNavigate();

  const [lang, setLang] = useState(null); // 나중에 백엔드 교체

  return (
    <>
      <Layout>
      <Content>
        <Badge>STEP 3/3</Badge>
        <Title>안내받을 언어를 <br />선택하세요</Title>
        
        <LangList>
        {LANGUAGES.map(({ code, name, flag }) => (
          <LangOption
            key={code}
            $active={lang === code}
            onClick={() => setLang(code)}
          >
            <Flag>{flag}</Flag>
            <Name>{name}</Name>
            {lang === code && <Check>✓</Check>}
          </LangOption>
        ))}
       </LangList>

        <Desc>
          💡 질문·기록은 모국어로 쓰면 돼요. 
          <br />  병원에는 자동으로 한국어로 번역·정리돼 전달돼요
        </Desc>

        <Button onClick={() => navigate("/home")}>
        회복 관리 시작하기
        </Button>
      </Content>   
    </Layout>
    </>
  )
}

export default OnboardingLang


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

const LangList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0;
`;

const LangOption = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.button};
  border: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primaryLight : theme.colors.white)};
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Flag = styled.span`
  font-size: 18px;
`;

const Name = styled.span`
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const Check = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;
