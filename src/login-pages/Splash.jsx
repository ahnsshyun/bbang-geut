import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";

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

        <Warning>⚠️언어는 최초 한 번만 선택 가능합니다.</Warning>

        <StartButton
          type="button"
          disabled={!lang}
          $active={!!lang}
          onClick={handleStart}
        >
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
  background: linear-gradient(
    160deg,
    ${COLORS.main} 0%,
    #935fe8 69%,
    #B262E1 100%
  );
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
  ${font("regbody")}
  font-family: ${FONTS.fallback};
  color: #ffffff;
  margin: 0 0 25px;
`;

const Logo = styled.h1`
  font-family: ${FONTS.fallback};
  font-size: 55px;
  font-weight: 800;
  margin: 0 0 30px;
  line-height: 36px;
  letter-spacing: -4.4px;
`;

const Tagline = styled.p`
  font-family: ${FONTS.fallback};
  font-weight: ${FONTS.roles.heading.weight};
  font-size: ${FONTS.roles.heading.size};
  line-height: ${FONTS.roles.heading.lineHeight};
  margin: 0 0 28px;
`;

const Desc = styled.p`
  ${font("regbody")}
  line-height: 20px;
  color: #ffffff;
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
  font-family: ${FONTS.fallback};
  font-weight: ${FONTS.roles.semibody.weight};
  font-size: ${FONTS.roles.semibody.size};
  color: ${({ $active }) => ($active ? COLORS.main : "#ffffff")};
  background: ${({ $active }) =>
    $active ? COLORS.background_lightpurple : "rgba(255, 255, 255, 0.15)"};
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 11px;
  cursor: pointer;
`;

const Warning = styled.p`
  font-family: ${FONTS.fallback};
  font-weight: ${FONTS.roles.regbody.weight};
  font-size: ${FONTS.roles.regbody.size};
  color: #ffffff;
  margin: 0;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-family: ${FONTS.fallback};
  font-weight: ${FONTS.roles.body.weight};
  font-size: ${FONTS.roles.body.size};
  color: ${({ $active }) => ($active ? COLORS.main : "#ffffff")};
  background: ${({ $active }) =>
    $active ? COLORS.background_lightpurple : "rgba(255, 255, 255, 0.15)"};
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 11px;
  cursor: pointer;
  transition: opacity 0.15s ease, background 0.15s ease;

`;