import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import whiteLogo from "../assets/whiteLogo.png";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import { setCurrentLang } from "../hooks/useLang";
import { dict } from "../i18n";

const LANGUAGES = [
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
];

const Splash = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState(null);

  // 아직 언어를 선택 안 했으면 기본 한국어로 미리보기, 선택하면 그 언어로 즉시 전환
  const previewLang = lang ?? "ko";
  const t = (key) => dict[previewLang]?.[key] ?? dict.ko[key] ?? key;

  const handleSelectLang = (code) => {
    setLang(code); // 로컬 state 업데이트 → 화면 텍스트 즉시 리렌더링
  };

  const handleStart = () => {
    if (!lang) return;

    setCurrentLang(lang);
    navigate("/login");
  };

  return (
    <PageBackground>
    <Wrapper>
      <TopSection>
        <Label>{t("splashLabel")}</Label>
        <LogoImg src={whiteLogo} alt="나란히" />
        <Tagline>
          {t("splashTaglineLine1")}
          <br />
          {t("splashTaglineLine2")}
        </Tagline>
        <Desc>
          {t("splashDesc").split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < t("splashDesc").split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </Desc>
      </TopSection>

      <BottomSection>
        <LangRow>
          {LANGUAGES.map(({ code, name }) => (
            <LangButton
              key={code}
              type="button"
              $active={lang === code}
              onClick={() => handleSelectLang(code)}
            >
              {name}
            </LangButton>
          ))}
        </LangRow>

        <Warning>{t("splashWarning")}</Warning>

        <StartButton
          type="button"
          disabled={!lang}
          $active={!!lang}
          onClick={handleStart}
        >
          {t("splashStart")}
        </StartButton>
      </BottomSection>
    </Wrapper>
    </PageBackground>
  );
};

export default Splash;

const PageBackground = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    160deg,
    ${COLORS.main} 0%,
    #935fe8 69%,
    #B262E1 100%
  );
`;

const LogoImg = styled.img`
  height: 55px;
  margin: 0 0 30px;
  width: auto;
  display: block;
  object-fit: contain;
  align-self: flex-start;
`;

const Wrapper = styled.div`
  max-width: 360px;
  width: 100%;
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