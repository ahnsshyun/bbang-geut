import { useEffect, useState } from "react";
import styled from "styled-components";
import COLORS from "../../styles/colors";
import FONTS, { font } from "../../styles/fonts";

import { HomeIcon, CameraIcon, RecordIcon, HospitalIcon } from "../Icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../../hooks/useLang";
import { getNotifications } from "../../api/notifications";

const Wrapper = styled.div`
  min-height: 100vh;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${COLORS.background};
`;

/* ============================================================
   상단 고정 배너
============================================================ */
const TopBanner = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  box-sizing: border-box;
  width: 100%;
  padding: 20px 28px;
  background: linear-gradient(135deg, ${COLORS.background_lightpurple}, #B4A7FF);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 11px;
`;

const BannerTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BannerTitle = styled.p`
  ${font("boldbody")}
  font-size: 22px;
  color: ${COLORS.main};
  margin: 0;
`;

const BannerText = styled.p`
  ${font("regbody")}
  color: ${COLORS.greey};
  margin: 0;
`;

const AlertButtonWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const AlertButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const UnreadDot = styled.span`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${COLORS.error};
  border: 1.5px solid #ffffff;
`;

/* ============================================================
   본문 
============================================================ */
const Body = styled.main`
  flex: 1;
  box-sizing: border-box;
  padding: 20px 20px 100px; /* 하단바 높이만큼 여유 padding-bottom */
  overflow-y: auto;
`;

/* ============================================================
   하단 고정 탭바 
============================================================ */
const BarWrapper = styled.nav`
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 448px; /* 480px - 좌우 16px씩 */
  z-index: 10;
  height: 64px;
  box-sizing: border-box;
  padding: 0 12px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.6),
    inset 0 -1px 1px rgba(255, 255, 255, 0.1),
    0 8px 24px rgba(80, 60, 180, 0.15);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.1) 40%,
      rgba(255, 255, 255, 0) 60%
    );
    pointer-events: none;
  }
`;

const TabItem = styled.button`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  background: none;
  cursor: pointer;
`;

const ActiveIndicator = styled.span`
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  border-radius: 2px;
  background: ${COLORS.main};
`;

const TabIcon = styled.span`
  font-size: 22px;
  opacity: ${({ $active }) => ($active ? 1 : 0.35)};
  filter: ${({ $active }) => ($active ? "none" : "grayscale(40%)")};
  transition: opacity 0.15s ease;
`;

const TabLabel = styled.span`
  ${font("regbody")}
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? COLORS.main : "#bbbbbb")};
`;

const HomeTheme = ({ bannerTitle = "나란히", onBellClick, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useLang();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getNotifications({ lang })
      .then((data) => {
        if (cancelled) return;
        const unread = (data.items ?? []).some((item) => item.unread);
        setHasUnread(unread);
      })
      .catch(() => {
        // 알림 조회 실패는 화면 이용에 지장 없도록 조용히 무시
      });

    return () => {
      cancelled = true;
    };
  }, [location.pathname, lang]);

  const DEFAULT_TABS = [
    { key: "home", Icon: HomeIcon, label: t("tabHome"), path: "/home" },
    { key: "checkin", Icon: CameraIcon, label: t("tabCheckin"), path: "/checkin/photo" },
    { key: "history", Icon: RecordIcon, label: t("tabRecord"), path: "/history", matchPaths: ["/history/submission", "/home-country"] },
    { key: "hospital", Icon: HospitalIcon, label: t("tabHospital"), path: "/hospital" },
  ];

  const tabs = DEFAULT_TABS.map((tab) => ({
    ...tab,
    active:
      tab.key === "history"
        ? location.pathname.startsWith("/history") || location.pathname === "/home-country"
        : location.pathname === tab.path,
    onClick: () => navigate(tab.path),
  }));

  return (
    <Wrapper>
      <TopBanner>
        <BannerTitleGroup>
          <BannerTitle>{bannerTitle}</BannerTitle>
          <BannerText>{t("bannerSubtitle")}</BannerText>
        </BannerTitleGroup>
        <AlertButtonWrap>
          <AlertButton onClick={() => navigate("/notification")} aria-label={t("notificationTitle")}>
            🔔
          </AlertButton>
          {hasUnread && <UnreadDot />}
        </AlertButtonWrap>
      </TopBanner>

      <Body>{children}</Body>

      {tabs.length > 0 && (
        <BarWrapper>
          {tabs.map((tab) => (
            <TabItem key={tab.key} onClick={tab.onClick}>
              {tab.active && <ActiveIndicator />}
              <TabIcon $active={tab.active}>
                <tab.Icon active={tab.active} />
              </TabIcon>
              <TabLabel $active={tab.active}>{tab.label}</TabLabel>
            </TabItem>
          ))}
        </BarWrapper>
      )}
    </Wrapper>
  );
};

export default HomeTheme;