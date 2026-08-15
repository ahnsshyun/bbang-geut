import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import plane from "../assets/plane.svg";

const TABS = [
  { key: "checkin", label: "체크인 기록", path: "/history" },
  { key: "submission", label: "제출용 기록", path: "/history/submission" },
];

/**
 * props:
 * - returnDDay: 귀국일까지 남은 일수 (음수면 D-n, 0이면 "오늘")
 * - dateLabel: 날짜 텍스트 (예: "2026.08.20")
 * - onPrepareClick: "본국 병원에 보여줄 자료 준비하기" 버튼 클릭 핸들러
 * - children: 선택된 탭 페이지 내용
 */
const HistoryTheme = ({ returnDDay, dateLabel, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isToday = returnDDay <= 0;
  const bannerTitle = isToday ? "오늘 귀국합니다" : `귀국까지 D-${returnDDay}`;

  return (
    <Wrapper>
      <Banner>
        <BannerTitleRow>
          <BannerTitle>{bannerTitle}</BannerTitle>
          <PlaneIcon src={plane} alt="비행기" />
        </BannerTitleRow>

        <PrepareButton 
        type="button" onClick={() => navigate("/home-country")}
        $active={location.pathname === "/home-country"}>
          본국 병원에 보여줄 자료 준비하기 →
        </PrepareButton>
      </Banner>

      <HistoryTabRow>
        {TABS.map((tab) => (
          <HistoryTabButton
            key={tab.key}
            type="button"
            $active={location.pathname === tab.path}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </HistoryTabButton>
        ))}
      </HistoryTabRow>

      <Body>{children}</Body>
    </Wrapper>
  );
};

export default HistoryTheme;

/* ---------- styles ---------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Banner = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  border-radius: 11px;
  border: 1px solid ${COLORS.sub};
  background: linear-gradient(180deg, ${COLORS.sub}, #90AFF8);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const BannerTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BannerTitle = styled.p`
  ${font("boldbody")}
  font-size: 16px;
  color: #111111;
  margin: 10px 0px 15px 10px;
`;

const PrepareButton = styled.button`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: none;
  border-radius: 15px;
  ${font("boldbody")}
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  background: ${({ $active }) => ($active ? COLORS.sub : "rgba(255, 255, 255, 0.3)")};
  color: ${({ $active }) => ($active ? COLORS.main : COLORS.main)};
  backdrop-filter: ${({ $active }) => ($active ? "none" : "blur(2px)")};
  -webkit-backdrop-filter: ${({ $active }) => ($active ? "none" : "blur(2px)")};
  box-shadow: ${({ $active }) =>
    $active
      ? `inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 0 2px ${COLORS.sub}`
      : "inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(80, 60, 180, 0.1)"};
  transform: ${({ $active }) => ($active ? "scale(0.97)" : "scale(1)")};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${({ $active }) =>
      $active
        ? "none"
        : `linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.45) 0%,
            rgba(255, 255, 255, 0.08) 40%,
            rgba(255, 255, 255, 0) 60%
          )`};
    pointer-events: none;
  }
`;

const HistoryTabRow = styled.div`
  display: flex;
  gap: 8px;

`;

const HistoryTabButton = styled.button`
  flex: 1;
  padding: 8px 0;
  border: 0.4px solid ${({ $active }) => ($active ? COLORS.sub : COLORS.border)};
  border-radius: 11px;
  background: ${({ $active }) => ($active ? COLORS.background_lightpurple : "rgba(255, 255, 255, 0.1)")};
  ${font("boldbody")}
  color: ${({ $active }) => ($active ? COLORS.main : COLORS.text_gray)};
  cursor: pointer;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlaneIcon = styled.img`
  width: 30px;
  height: 30px;
`;