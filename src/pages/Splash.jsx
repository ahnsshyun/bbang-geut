import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LANGUAGES = [
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "en", name: "English" },
];

const Splash = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState(null);

  const handleStart = () => {
    if (!lang) return;

    // TODO: 백엔드 API 연동
    // - 실제 서비스에서는 언어 선택값을 서버(환자 프로필)에도 저장해
    //   진료 기록·제출 문서 언어를 이 값 기준으로 고정해야 함
    localStorage.setItem("naranhi_lang", lang);

    navigate("/login");
  };

  return (
    <Wrapper>
      <TopSection>
        <Label>AFTERCARE COMPANION</Label>
        <Logo>나란히</Logo>
        <Tagline>
          회복의 모든 날을
          <br />
          나란히
        </Tagline>
        <Desc>
          수술 다음 날부터 4개월 뒤까지,
          <br />
          혼자 판단하지 않아도 되도록
          <br />
          병원의 회복 프로토콜을 매일 옆에 둡니다.
        </Desc>
      </TopSection>

      <BottomSection>
        <LangRow>
          {LANGUAGES.map(({ code, name }) => (
            <LangButton
              key={code}
              type="button"
              $active={lang === code}
              onClick={() => setLang(code)}
            >
              {name}
            </LangButton>
          ))}
        </LangRow>

        <Warning>
          ⚠️언어는 지금 한 번만 선택합니다. 진료 기록 · 제출 문서의 언어가
          함께 결정되므로 이후 앱 내에서 변경이 불가합니다.
        </Warning>

        <StartButton type="button" disabled={!lang} onClick={handleStart}>
          시작하기
        </StartButton>
      </BottomSection>
    </Wrapper>
  );
};

export default Splash;

const Wrapper = styled.div`
  width: 360px;
  min-height: 640px;
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  border: none;
  background: ${({ theme }) =>
    `linear-gradient(160deg, ${theme.colors.gradientStart} 0%, ${theme.colors.gradientEnd} 100%)`};
  box-shadow: 0 12px 32px rgba(80, 130, 180, 0.14);
  padding: 44px 28px 32px;
  margin: 0 auto;
  color: #ffffff;
  box-sizing: border-box;
`;

const TopSection = styled.div`
  margin-top: 56px;
`;

const Label = styled.p`
  font-size: 12px;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 12px;
`;

const Logo = styled.h1`
  font-size: 44px;
  font-weight: 800;
  margin: 0 0 20px;
`;

const Tagline = styled.p`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  margin: 0 0 16px;
`;

const Desc = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`;

const BottomSection = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LangRow = styled.div`
  display: flex;
  gap: 8px;
`;

const LangButton = styled.button`
  flex: 1;
  padding: 14px 0;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: ${({ $active }) =>
    $active ? "rgba(255, 255, 255, 0.34)" : "rgba(255, 255, 255, 0.16)"};
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.9)" : "transparent")};
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
`;

const Warning = styled.p`
  font-size: 11px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;