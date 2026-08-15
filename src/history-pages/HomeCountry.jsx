import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import HomeTheme from "../components/HomeTheme";
import HistoryTheme from "../components/HistoryTheme";
import { ShadowBox, NoticeBox, ToastBox } from "../components/Box";
import { SubButton } from "../components/Button";

const HomeCountry = () => {
  const [showToast, setShowToast] = useState(false);
  const handleSavePDF = () => {
    // TODO: 백엔드 연동 — PDF 생성/저장
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <HomeTheme bannerTitle="나란히">
      <HistoryTheme returnDDay={17} dateLabel="2026.08.20">

        <ShadowBox>
<SummaryTitle>施術記録サマリー（医療機関提示用）</SummaryTitle>

<SummaryList>
  <SummaryItem>
    <b>施術</b>：鼻形成術（シリコンインプラント挿入＋自家真皮移植による鼻柱延長）1回目
  </SummaryItem>
  <SummaryItem>
    <b>施術日</b>：2026-08-03／現在D+4
  </SummaryItem>
  <SummaryItem>
    <b>施術機関</b>：ソウルN美容外科クリニック（Seoul, KR）+82-2-000-0000
  </SummaryItem>
  <SummaryItem>
    <b>担当医</b>：KIM SEOJUN（院長）
  </SummaryItem>
  <SummaryItem>
    <b>経過</b>：チェックイン記録に基づく自動要約（D+0〜D+4）
  </SummaryItem>
  <SummaryItem>
    <b>注意</b>：D+28まで飲酒・喫煙および顔をかがめる行為を回避／D+60まで眼鏡の常用を回避／D+90までサウナ・温泉を回避
  </SummaryItem>
  <SummaryItem>
    <b>次回受診</b>：D+30 遠隔経過診察（予定）
  </SummaryItem>
</SummaryList>

<NoticeText>
  ※ 本資料は診断書ではなく、患者の記録に基づく情報提供資料です。
    診断・処方は現地医療機関の判断に従ってください。
</NoticeText>
        </ShadowBox>

        <NoticeBox>
          PDF로 저장해 가져가면, 귀국 후 병원 방문 시 의료진이 시술 내용과 회복 경과를 정확하게 확인할 수 있어요.
        </NoticeBox>

        <SubButton type="button" onClick={handleSavePDF}>
          귀국용 요약 PDF 저장
        </SubButton>
        {showToast && <ToastBox>PDF를 기기에 저장했어요</ToastBox>}
      </HistoryTheme>
    </HomeTheme>
  );
};

export default HomeCountry;

/* ---------- styles ---------- */

const SummaryTitle = styled.p`
  ${font("body")}
  color: #111111;
  margin: 0 0 20px;
`;

const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
`;

const SummaryItem = styled.p`
  ${font("regbody")}
  font-size: 13px;
  line-height: 1.6;
  color: #111111;
  margin: 0;

  b {
    ${font("boldbody")}
    font-size: 13px;
  }
`;

const NoticeText = styled.p`
  ${font("regbody")}
  line-height: 1.6;
  color: ${COLORS.text_gray};
  margin: 30px 0px 0px 0px;
`;

