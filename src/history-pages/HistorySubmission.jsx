import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import HomeTheme from "../components/HomeTheme";
import HistoryTheme from "../components/HistoryTheme";
import { ShadowBox, NoticeBox, ToastBox } from "../components/Box";
import MainButton, { SubButton } from "../components/Button";
import { ConfirmationBox, HospitalAlertBox, StatCardRow, SymptomChangeList, RoutineDonutRow } from "../components/HistoryBox";

const STATS = [
  { key: "checkin", icon: "🤚", label: "체크인 기록", value: "3건", tone: "green" },
  { key: "symptom", icon: "📈", label: "증상 변화", value: "4건", tone: "purple" },
  { key: "routine", icon: "🔄", label: "루틴 이행률", value: "60%", tone: "orange" },
];

const SYMPTOM_CHANGES = [
  {
    key: "swelling",
    label: "부기",
    trend: "up",
    desc: "수술 당일보다 부기가 늘었어요. 초기 회복 과정에서 나타날 수 있으니, 병원 안내에 따라 냉찜질을 해주세요.",
  },
  {
    key: "pain",
    label: "통증",
    trend: "down",
    desc: "수술 당일보다 통증이 줄었어요. 현재처럼 처방약을 복용하고 무리하지 않도록 해주세요.",
  },
  {
    key: "bruising",
    label: "멍",
    trend: "same",
    desc: "이전 기록과 비교해 멍의 정도가 비슷해요. 색이나 범위가 갑자기 달라지는지 지켜봐 주세요.",
  },
  {
    key: "nasal",
    label: "코막힘",
    isNew: true,
    desc: "이번 기록에서 코막힘이 처음 확인됐어요. 코를 세게 풀거나 만지지 말고, 병원에서 안내받은 관리 방법을 따라주세요.",
  },
];

const ROUTINE_DAYS = [
  { key: "d0", dLabel: "D+0", dateLabel: "26.08.05", percent: 100 },
  { key: "d1", dLabel: "D+1", dateLabel: "26.08.06", percent: 60 },
  { key: "d2", dLabel: "D+2", dateLabel: "26.08.07", percent: 40 },
];

const HistorySubmission = () => {
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
          <Section>
            <SummaryTitle>회복 경과 기록지 (의료기관 제시용)</SummaryTitle>

            <SummaryList>
              <SummaryItem>
                <b>수술명</b> : 코성형(융비술) · 비주 연장술
              </SummaryItem>
              <SummaryItem>
                <b>수술내용</b> : 실리콘 보형물 삽입 및 자가진피를 이용한 비주 연장
              </SummaryItem>
              <SummaryItem>
                <b>수술기관</b> : 서울N성형외과의원 (Seoul, KR)
              </SummaryItem>
              <SummaryItem>
                <b>담당의</b> : KIM SEOJUN
              </SummaryItem>
              <SummaryItem>
                <b>수술일</b> : 2026.08.03
              </SummaryItem>
              <SummaryItem>
                <b>기록 기간</b> : 2026.08.03 ~ 2026.08.10
              </SummaryItem>
              <SummaryItem>
                <b>기록 내용</b> : 체크인 7건 · 사진 21컷 · 루틴 완주율 90%
              </SummaryItem>
            </SummaryList>
          </Section>

          <Section>
            <RecentHeaderRow>
              <RecentTitle>최근 3일</RecentTitle>
              <RecentDateRange>D+0 ~ D+2</RecentDateRange>
              <AiBadge>✨ AI 자동 정리</AiBadge>
            </RecentHeaderRow>

            <RecentSummaryBox>
              <RecentSummaryText>증상 · 자가 케어 정리됨</RecentSummaryText>
            </RecentSummaryBox>

        <StatCardRow stats={STATS} />
        <SymptomChangeList items={SYMPTOM_CHANGES} />
        <RoutineDonutRow days={ROUTINE_DAYS} />

            <NoticeBox>
              ※ 본 자료는 환자가 입력한 체크인 기록과 자가관리 이행 내역을 자동으로 정리한 참고 자료입니다.
              <br/>※ 환자가 입력한 자료는 원본 그대로 보관되며, 의료기관에 함께 제공됩니다.
              <br/>※ 본 자료는 의료진의 진단이나 의학적 소견을 대신하지 않습니다.
              <br/>※ 증상의 중증도나 정상 이상 여부를 자동으로 판단하지 않습니다.
            </NoticeBox>
          </Section>

          <ConfirmationBox
            items={["D+0 : 수술기록 및 프로토콜 등록", "D+2 : 자동 정리 문장 형식 확인"]}
            nextText="다음 갱신 예정 : D+5 부목 제거 내원 시"
          />

          <HospitalAlertBox>
            상담 요청을 보내면, <b>현재 회복 경과 기록</b>과 <b>귀국 후 관리 요약</b>이 의료기관에 함께 전달됩니다. 
            <br/>이후 기록이 추가되면, 의료진은 열람 시점의 최신 내용을 확인할 수 있습니다.
          </HospitalAlertBox>
        </ShadowBox>

        <SubButton type="button" onClick={handleSavePDF}>
          회복 경과 기록지 PDF 저장
        </SubButton>
        {showToast && <ToastBox>PDF를 기기에 저장했어요</ToastBox>}

        <MainButton type="button" onClick={handleSavePDF}>
          병원에 전달하기 →
        </MainButton>
        <NoticeText>상담 대화창으로 이동해 파일이 첨부됩니다.</NoticeText>

      </HistoryTheme>
    </HomeTheme>
  );
};

export default HistorySubmission;

/* ---------- styles ---------- */

const SummaryTitle = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 0 0 16px;
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

/* ---------- ai요약 ---------- */
const Section = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid ${COLORS.border};
  &:first-child {
    padding-top: 0;
  }
`;

const RecentHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const RecentTitle = styled.p`
  ${font("boldbody")}
  font-size: 15px;
  color: #111111;
  margin: 0;
`;

const RecentDateRange = styled.span`
  ${font("regbody")}
  color: ${COLORS.text_gray};
  flex: 1;
`;

const AiBadge = styled.span`
  ${font("boldbody")}
  font-size: 11px;
  color: ${COLORS.main};
  background: ${COLORS.background_lightpurple};
  padding: 5px 10px;
  border-radius: 20px;
  white-space: nowrap;
`;

const RecentSummaryBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  background: ${COLORS.background_lightpurple};
  border: 1px solid ${COLORS.sub};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
`;

const RecentSummaryText = styled.span`
  ${font("boldbody")}
  font-size: 13px;
  color: ${COLORS.main};
`;

const RecentNoticeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RecentNoticeItem = styled.p`
  ${font("regbody")}
  font-size: 11px;
  line-height: 1.6;
  color: ${COLORS.text_gray};
  margin: 0;
`;

const NoticeText = styled.p`
  ${font("regbody")}
  font-size: 11px;
  line-height: 1.6;
  color: ${COLORS.text_gray};
  margin: 0;
`;