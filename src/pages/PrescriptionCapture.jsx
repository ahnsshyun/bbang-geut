import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";

// TODO(백엔드 연동 시 제거): 처방전 OCR 결과 목업
// 실제 구현 시 카메라로 촬영한 이미지를 OCR 엔진에 전달하고,
// 아래와 동일한 스키마(약품명 · 1회 투약량 · 1일 투여횟수 · 총 투약일수 · 용법 · 정기/필요시)로 응답받아야 함
const MOCK_HOSPITAL = {
  name: "서울 N성형외과의원",
  address: "서울특별시 강남구 OO대로 000, N빌딩 5층",
  tel: "02-000-0000",
  fax: "02-000-0001",
  issueDate: "2026. 08. 03.",
};

const MOCK_PATIENT_DOC = {
  name: "사토 유이 (SATO YUI)",
  birthDate: "1994. 05. 12. (여)",
  patientId: "NR-2608-0417",
  nationality: "일본(JAPAN) · 여권 TZ1234***",
  doctor: "김서준",
};

const MOCK_DOC_ROWS = [
  { no: 1, name: "세프카펜피복실염산염정 100mg", dose: "1정", freq: "3회", days: "6일", usage: "매 식후 30분 경구 복용" },
  { no: 2, name: "록스프로펜나트륨수화물정 60mg", dose: "1정", freq: "3회", days: "6일", usage: "매 식후 30분 경구 복용" },
  { no: 3, name: "트라넥삼산캡슐 250mg", dose: "1캡슐", freq: "3회", days: "6일", usage: "매 식후 30분 경구 복용" },
  { no: 4, name: "레바미피드정 100mg", dose: "1정", freq: "3회", days: "6일", usage: "매 식후 30분 경구 복용" },
  { no: 5, name: "아세트아미노펜정 500mg", dose: "1~2정", freq: "필요 시 최대 4회", days: "4일", usage: "통증 시 4시간 간격 경구 복용 (돈복)" },
];

const REGULAR_DRUGS = [
  {
    id: "hurromox",
    category: "항생제",
    categoryToken: "categoryOrange",
    name: "후로목스정",
    generic: "(세프카펜피복실염산염정 100mg)",
    perDose: "1정",
    perDay: "3회",
    duration: "6일",
    usage: "매 식후 30분 경구 복용",
  },
  {
    id: "loxpen",
    category: "소염진통제",
    categoryToken: "primary",
    name: "록스펜정",
    generic: "(록스프로펜나트륨수화물정 60mg)",
    perDose: "1정",
    perDay: "3회",
    duration: "6일",
    usage: "매 식후 30분 경구 복용",
  },
  {
    id: "doransamin",
    category: "지혈·부기",
    categoryToken: "categoryBlue",
    name: "도란사민캡슐",
    generic: "(트라넥삼산캡슐 250mg)",
    perDose: "1캡슐",
    perDay: "3회",
    duration: "6일",
    usage: "매 식후 30분 경구 복용",
  },
  {
    id: "mucosta",
    category: "위 보호제",
    categoryToken: "muted",
    name: "무코스타정",
    generic: "(레바미피드정 100mg)",
    perDose: "1정",
    perDay: "3회",
    duration: "6일",
    usage: "매 식후 30분 경구 복용",
  },
];

const PRN_DRUG = {
  id: "tylenol",
  category: "소염진통제",
  categoryToken: "primary",
  name: "타이레놀정",
  generic: "(아세트아미노펜정 500mg)",
  perDose: "1~2정",
  perDay: "최대 4회",
  duration: "4일",
  warning: "⚠️통증 시 4시간 간격 경구 복용",
};

const SCAN_STEPS = ["처방전 인식", "의약품 항목 5건 추출", "정기 복용 · 필요시 복용 구분"];

const PrescriptionCapture = () => {
  const navigate = useNavigate();
  // step: 'capture' | 'scanning' | 'result'
  const [step, setStep] = useState("capture");

  useEffect(() => {
    if (step !== "scanning") return undefined;

    // 명세서 5. 프로토타입 한계: "촬영 후 1.3초 지연 뒤 고정된 샘플 결과 반환"
    const timer = setTimeout(() => setStep("result"), 1300);
    return () => clearTimeout(timer);
  }, [step]);

  const handleCapture = () => {
    // TODO: 백엔드 API 연동
    // - 실제 카메라 촬영(getUserMedia 등) 붙이는 자리
    // - 촬영된 이미지를 OCR 엔진으로 전달
    setStep("scanning");
  };

  const handleRetake = () => setStep("capture");

  const handleSave = () => {
    // TODO: 백엔드 API 연동
    // - 처방 DB 저장 API 호출로 교체
    // - 아래 localStorage는 백엔드/전역 상태 없이 온보딩 화면 간 값 전달용 임시 처리
    const summary = {
      firstDrugName: REGULAR_DRUGS[0]?.name ?? "",
      regularCount: REGULAR_DRUGS.length,
      dailyFreq: REGULAR_DRUGS[0]?.perDay ?? "",
      totalDays: REGULAR_DRUGS[0]?.duration ?? "",
      prnCount: PRN_DRUG ? 1 : 0,
    };
    localStorage.setItem("naranhi_prescription_registered", "true");
    localStorage.setItem("naranhi_prescription_summary", JSON.stringify(summary));
    navigate("/onboarding/intake");
  };

  if (step === "capture") {
    return (
      <Layout>
        <Content>
          <StepBadge>STEP 1/3 · 처방 정보 등록</StepBadge>
          <Title>처방전을 촬영해주세요</Title>
          <Desc>
            병원에서 받은 환자보관용 처방전을 프레임 안에 맞춰주세요.
            <br />
            추출은 이 기기 안에서 끝나고, 사진 원본은 어디에도 전송되지
            않습니다.
          </Desc>

          <CameraFrame />

          <ShutterArea>
            <ShutterButton type="button" onClick={handleCapture} aria-label="처방전 촬영" />
            <ShutterCaption>처방전 촬영 1장이면 충분해요</ShutterCaption>
          </ShutterArea>

          <BackButton type="button" onClick={() => navigate("/onboarding/intake")}>
            뒤로
          </BackButton>
        </Content>
      </Layout>
    );
  }

  if (step === "scanning") {
    return (
      <Layout>
        <Content>
          <StepBadge>STEP 1/3 · 처방 정보 등록</StepBadge>
          <Title>처방전을 읽고 있어요</Title>
          <Desc>
            약물명 · 1회 투약량 · 1일 투약 횟수 · 총 투약 일수를 확인하고
            있어요
          </Desc>

          <CameraFrame />

          <ScanStatusCard>
            <ScanStatusList>
              {SCAN_STEPS.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ScanStatusList>
          </ScanStatusCard>
        </Content>
      </Layout>
    );
  }

  // step === 'result'
  return (
    <Layout>
      <Content>
        <StepBadge>STEP 1/3 · 처방 정보 확인</StepBadge>
        <Title>약 정보를 확인해주세요</Title>
        <Desc>
          처방전에서 <b>약물명 · 1회 투약량 · 1일 투약 횟수 · 총 투약 일수</b>
          를 읽었어요.
          <br />
          다른 정보가 있다면 다시 촬영해 주세요.
        </Desc>

        <DocCard>
          <DocCardHeader>
            <DocCardHeaderLeft>🖼 촬영한 처방전</DocCardHeaderLeft>
            <RetakeLink type="button" onClick={handleRetake}>
              다시 촬영 &gt;
            </RetakeLink>
          </DocCardHeader>

          <DocPreview>
            <DocHospitalName>{MOCK_HOSPITAL.name}</DocHospitalName>
            <DocHospitalMeta>
              {MOCK_HOSPITAL.address} · 대표전화 {MOCK_HOSPITAL.tel} · 팩스{" "}
              {MOCK_HOSPITAL.fax}
            </DocHospitalMeta>
            <DocTitleRow>처 방 전</DocTitleRow>
            <DocSubTitleRow>(환자 보관용 사본)</DocSubTitleRow>

            <DocInfoGrid>
              <DocInfoItem>
                <span>성명</span>
                <b>{MOCK_PATIENT_DOC.name}</b>
              </DocInfoItem>
              <DocInfoItem>
                <span>생년월일</span>
                <b>{MOCK_PATIENT_DOC.birthDate}</b>
              </DocInfoItem>
              <DocInfoItem>
                <span>등록번호</span>
                <b>{MOCK_PATIENT_DOC.patientId}</b>
              </DocInfoItem>
              <DocInfoItem>
                <span>국적</span>
                <b>{MOCK_PATIENT_DOC.nationality}</b>
              </DocInfoItem>
              <DocInfoItem>
                <span>처방의료인</span>
                <b>{MOCK_PATIENT_DOC.doctor}</b>
              </DocInfoItem>
              <DocInfoItem>
                <span>발급 연월일</span>
                <b>{MOCK_HOSPITAL.issueDate}</b>
              </DocInfoItem>
            </DocInfoGrid>

            <DocTable>
              <thead>
                <tr>
                  <th>순번</th>
                  <th>약품명(성분명)</th>
                  <th>1회 투약량</th>
                  <th>1일 투여횟수</th>
                  <th>총 투약일수</th>
                  <th>용법</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DOC_ROWS.map((row) => (
                  <tr key={row.no}>
                    <td>{row.no}</td>
                    <td>{row.name}</td>
                    <td>{row.dose}</td>
                    <td>{row.freq}</td>
                    <td>{row.days}</td>
                    <td>{row.usage}</td>
                  </tr>
                ))}
              </tbody>
            </DocTable>
          </DocPreview>
        </DocCard>

        <SectionHeading>
          <Dot $color="primary" />
          정해진 시간에 복용해야 하는 약 {REGULAR_DRUGS.length}종
        </SectionHeading>

        {REGULAR_DRUGS.map((drug) => (
          <DrugCard key={drug.id}>
            <CategoryTag $token={drug.categoryToken}>{drug.category}</CategoryTag>
            <DrugNameRow>
              <DrugName>{drug.name}</DrugName>
              <DrugGeneric>{drug.generic}</DrugGeneric>
            </DrugNameRow>
            <DrugStatsRow>
              <DrugStat>
                <StatLabel>한 번에</StatLabel>
                <StatValue>{drug.perDose}</StatValue>
              </DrugStat>
              <DrugStat>
                <StatLabel>하루</StatLabel>
                <StatValue>{drug.perDay}</StatValue>
              </DrugStat>
              <DrugStat>
                <StatLabel>기간</StatLabel>
                <StatValue>{drug.duration}</StatValue>
              </DrugStat>
            </DrugStatsRow>
            <DrugUsage>{drug.usage}</DrugUsage>
          </DrugCard>
        ))}

        <SectionHeading>
          <Dot $color="categoryOrange" />
          필요시 약 1종
        </SectionHeading>

        <DrugCard $warn>
          <CategoryTag $token={PRN_DRUG.categoryToken}>
            {PRN_DRUG.category}
          </CategoryTag>
          <DrugNameRow>
            <DrugName>{PRN_DRUG.name}</DrugName>
            <DrugGeneric>{PRN_DRUG.generic}</DrugGeneric>
          </DrugNameRow>
          <DrugStatsRow>
            <DrugStat>
              <StatLabel>한 번에</StatLabel>
              <StatValue>{PRN_DRUG.perDose}</StatValue>
            </DrugStat>
            <DrugStat>
              <StatLabel>하루</StatLabel>
              <StatValue>{PRN_DRUG.perDay}</StatValue>
            </DrugStat>
            <DrugStat>
              <StatLabel>기간</StatLabel>
              <StatValue>{PRN_DRUG.duration}</StatValue>
            </DrugStat>
          </DrugStatsRow>
          <DrugUsage>{PRN_DRUG.warning}</DrugUsage>
        </DrugCard>

        <SummaryBox>
          정기 복용약 {REGULAR_DRUGS.length}종의 복약 시작일은 2026.08.03 ·
          마지막 날 2026.08.08로, 홈 화면에 하루 3회 복약 체크표가
          만들어집니다. 필요시 약은 체크 항목으로 만들지 않고 목록으로만
          보관해요.
          <br />
          투약 관련 문의는 병원으로 연락 주세요.
        </SummaryBox>

        <FootNote>
          요양기관기호 · 질병분류기호 · 의사면허번호 · 교부번호 등 처방약과
          관련 없는 정보는 읽지 않았어요
        </FootNote>

        <SaveButton type="button" onClick={handleSave}>
          네, 맞아요 · 처방 정보 저장
        </SaveButton>
        <RetakeButton type="button" onClick={handleRetake}>
          다시 촬영하기
        </RetakeButton>
      </Content>
    </Layout>
  );
};

export default PrescriptionCapture;

/* ---------- styles ---------- */

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  text-align: left;
`;

const StepBadge = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 8px;
`;

const Desc = styled.p`
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 10px 0 24px;
`;

const CameraFrame = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.placeholderBg};
`;

const ShutterArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 28px 0;
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0 8px ${({ theme }) => theme.colors.primarySoft}55; }
  50% { box-shadow: 0 0 0 12px ${({ theme }) => theme.colors.primarySoft}88; }
`;

const ShutterButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  animation: ${glow} 1.8s ease-in-out infinite;
`;

const ShutterCaption = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const BackButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.button};
  cursor: pointer;
`;

const ScanStatusCard = styled.div`
  margin-top: 20px;
  padding: 18px 20px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const ScanStatusList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textBody};
`;

const DocCard = styled.div`
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  overflow: hidden;
`;

const DocCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 700;
`;

const DocCardHeaderLeft = styled.span`
  color: ${({ theme }) => theme.colors.textBody};
`;

const RetakeLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const DocPreview = styled.div`
  padding: 16px;
  font-size: 11px;
`;

const DocHospitalName = styled.p`
  font-weight: 800;
  font-size: 12px;
  margin: 0 0 4px;
`;

const DocHospitalMeta = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 0 12px;
  font-size: 10px;
`;

const DocTitleRow = styled.p`
  text-align: center;
  font-weight: 800;
  letter-spacing: 0.3em;
  margin: 0;
`;

const DocSubTitleRow = styled.p`
  text-align: center;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 2px 0 14px;
`;

const DocInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  margin-bottom: 14px;
`;

const DocInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    color: ${({ theme }) => theme.colors.textLight};
    font-size: 10px;
  }

  b {
    font-size: 11px;
  }
`;

const DocTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5px;

  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 6px 4px;
    text-align: center;
  }

  th {
    background: ${({ theme }) => theme.colors.surfaceMuted};
    font-weight: 700;
  }
`;

const SectionHeading = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  margin: 24px 0 12px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $color }) =>
    $color === "categoryOrange"
      ? theme.colors.categoryOrange.text
      : theme.colors.primary};
`;

const DrugCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: 16px;
  margin-bottom: 12px;
  background: ${({ theme, $warn }) =>
    $warn ? theme.colors.warnBg : "#ffffff"};
`;

const CategoryTag = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.badge};
  margin-bottom: 10px;
  background: ${({ theme, $token }) => {
    if ($token === "categoryOrange") return theme.colors.categoryOrange.bg;
    if ($token === "categoryBlue") return theme.colors.categoryBlue.bg;
    if ($token === "muted") return theme.colors.surfaceMuted;
    return theme.colors.primaryLight;
  }};
  color: ${({ theme, $token }) => {
    if ($token === "categoryOrange") return theme.colors.categoryOrange.text;
    if ($token === "categoryBlue") return theme.colors.categoryBlue.text;
    if ($token === "muted") return theme.colors.textLight;
    return theme.colors.primary;
  }};
`;

const DrugNameRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const DrugName = styled.span`
  font-size: 15px;
  font-weight: 800;
`;

const DrugGeneric = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const DrugStatsRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 10px;
`;

const DrugStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const StatValue = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const DrugUsage = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const SummaryBox = styled.div`
  margin-top: 8px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textBody};
`;

const FootNote = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 12px 0 24px;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.button};
  cursor: pointer;
  margin-bottom: 10px;
`;

const RetakeButton = styled.button`
  width: 100%;
  padding: 16px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.button};
  cursor: pointer;
  margin-bottom: 24px;
`;