// 하단 탭이 있는 모든 페이지가 공유하는 레이아웃
import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";

const TABS = [
  { path: "/home", icon: "📅", label: "오늘" },
  { path: "/guide", icon: "✨", label: "AI 가이드" },
  { path: "/checkin", icon: "📋", label: "체크인" },
  { path: "/history", icon: "📄", label: "기록" },
  { path: "/consult", icon: "🏥", label: "문의" },
];

const LANGUAGES = [
  { code: "ko", flag: "🇰🇷", label: "KO" },
  { code: "en", flag: "🇺🇸", label: "EN" },
  { code: "ja", flag: "🇯🇵", label: "JA" },
];

const AppLayout = () => {
  // 임시 언어 상태 — 나중에 교체
    const [langIdx, setLangIdx] = useState(0);
    const currentLang = LANGUAGES[langIdx];
  
    const cycleLang = () => {
      setLangIdx((prev) => (prev + 1) % LANGUAGES.length);
    };

  return (
    <Outer>
      <Phone>
        <TopBar>
          <Time>9:41</Time>
          <LangBadge onClick={cycleLang}>
            {currentLang.flag} {currentLang.label}
          </LangBadge>
        </TopBar>

        <Screen>
          <Outlet />
        </Screen>
        <TabBar>
          {TABS.map(({ path, icon, label }) => (
            <TabItem key={path} to={path}>
              <TabIcon>{icon}</TabIcon>
              <TabLabel>{label}</TabLabel>
            </TabItem>
          ))}
        </TabBar>
      </Phone>
    </Outer>
  );
};

export default AppLayout;

const Outer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f7fb;
`;

const Phone = styled.div`
  width: 380px;
  height: 720px;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadow.card};
  overflow: hidden;
`;

const Screen = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const TabBar = styled.div`
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  padding: 8px 4px;
`;

const TabItem = styled(NavLink)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
  color: ${({ theme }) => theme.colors.textLight};

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabIcon = styled.span`
  font-size: 15px;
  line-height: 1;
`;

const TabLabel = styled.span`
  font-size: 9.5px;
  font-weight: 700;
`;


const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 6px;
  background: ${({ theme }) => theme.colors.background};
`;

const Time = styled.b`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSub};
`;

const LangBadge = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryHover};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.badge};
  padding: 3px 10px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;