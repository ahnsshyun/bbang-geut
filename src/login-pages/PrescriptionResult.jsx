import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { NoticeBox, PromptBox, PromptDesc, DrugBox } from "../components/Box";
import Button, { SubButton } from "../components/Button";

const REGULAR_DRUGS = [
  { id: "hurromox", badge: "항생제", name: "후로목스정", ingredient: "세프카펜피복실염산염정 100mg", amount: "1정", frequency: "3회", duration: "6일", instruction: "매 식후 30분 경구 복용" },
  { id: "loxpen", badge: "소염진통제", name: "록스펜정", ingredient: "록스프로펜나트륨수화물정 60mg", amount: "1정", frequency: "3회", duration: "6일", instruction: "매 식후 30분 경구 복용" },
  { id: "doransamin", badge: "지혈·부기", name: "도란사민캡슐", ingredient: "트라넥삼산캡슐 250mg", amount: "1캡슐", frequency: "3회", duration: "6일", instruction: "매 식후 30분 경구 복용" },
  { id: "mucosta", badge: "위 보호제", name: "무코스타정", ingredient: "레바미피드정 100mg", amount: "1정", frequency: "3회", duration: "6일", instruction: "매 식후 30분 경구 복용" },
];

const PRN_DRUG = {
  id: "tylenol",
  badge: "소염진통제",
  name: "타이레놀정",
  ingredient: "아세트아미노펜정 500mg",
  amount: "1~2정",
  frequency: "최대 4회",
  duration: "4일",
  instruction: "⚠️통증 시 4시간 간격 경구 복용",
};

const PrescriptionResult = () => {
  const navigate = useNavigate();

  const handleRetake = () => navigate("/onboarding/prescription/capture");

  const handleSave = () => {
    // TODO: 백엔드 API 연동 — 처방 DB 저장 API 호출로 교체
    const summary = {
      firstDrugName: REGULAR_DRUGS[0]?.name ?? "",
      regularCount: REGULAR_DRUGS.length,
      dailyFreq: REGULAR_DRUGS[0]?.frequency ?? "",
      totalDays: REGULAR_DRUGS[0]?.duration ?? "",
      prnCount: PRN_DRUG ? 1 : 0,
    };
    localStorage.setItem("naranhi_prescription_registered", "true");
    localStorage.setItem("naranhi_prescription_summary", JSON.stringify(summary));
    navigate("/onboarding/check");
  };

  return (
    <Layout>
      <Content>
        <LoginTheme
          step="STEP 1/3 · 자료 수신"
          title="처방 정보를 확인해주세요"
          desc={
            <>
              처방전에서 <b>약물명 · 1회 투약량 · 1일 투약 횟수 · 총 투약 일수</b>
              를 읽었어요.
            </>
          }
        />

        <PromptBox>
          <CapturedPhoto />
          <PromptDesc>⚠️다른 정보가 있다면 다시 촬영해 주세요.</PromptDesc>
        </PromptBox>

        <SectionHeading>🟢 정기 복용약 {REGULAR_DRUGS.length}종</SectionHeading>

        {REGULAR_DRUGS.map((drug) => (
          <DrugBox
            key={drug.id}
            badge={drug.badge}
            name={drug.name}
            ingredient={drug.ingredient}
            amount={drug.amount}
            frequency={drug.frequency}
            duration={drug.duration}
            instruction={drug.instruction}
          />
        ))}

        <SectionHeading>🟡 필요시 약 1종</SectionHeading>

<DrugBox
  badge={PRN_DRUG.badge}
  name={PRN_DRUG.name}
  ingredient={PRN_DRUG.ingredient}
  amount={PRN_DRUG.amount}
  frequency={PRN_DRUG.frequency}
  duration={PRN_DRUG.duration}
  instruction={PRN_DRUG.instruction}
  asNeeded
/>

<Spacer/>

        <NoticeBox>
          <b>정기 복용약</b>은 홈 화면에 복약 체크표가 만들어져요.
          <br />
          <b>필요시 약</b>은 체크 항목으로 만들지 않고 목록으로만 보관해요.
          <br />
          ☎️ 투약 관련 문의는 병원으로 연락 주세요.
        </NoticeBox>

        <ButtonGroup>
          <Button type="button" onClick={handleSave}>
            네, 맞아요 · 처방 정보 저장
          </Button>
          <SubButton type="button" onClick={handleRetake}>
            다시 촬영하기
          </SubButton>
        </ButtonGroup>
      </Content>
    </Layout>
  );
};

export default PrescriptionResult;

/* ---------- styles ---------- */

const CapturedPhoto = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 12px;
  background: #e0e0e0; /* TODO: 실제 촬영된 이미지로 교체 예정, 지금은 플레이스홀더 */
`;

const SectionHeading = styled.p`
  ${font("boldbody")}
  font-size: 14px;
  margin: 24px 0 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
`;