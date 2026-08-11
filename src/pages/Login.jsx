import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import Title from "../components/Title";
import Button from "../components/Button";

// TODO(백엔드 연동 시 제거): 프로토타입 검증용 목업 계정
// 명세서 예시 케이스(사토 유이, 코성형·D+0=2026-08-03) 기준 값
const MOCK_PATIENTS = [{ patientId: "NR-2608-0417", birthDate: "19940512" }];

// 환자 ID: 병원 발급 12자리 코드 (예: NR-2608-0417)
const PATIENT_ID_REGEX = /^[A-Z]{2}-\d{4}-\d{4}$/;
// 생년월일: YYYYMMDD 8자리 (여권 기재 생년월일 기준)
const BIRTH_DATE_REGEX = /^\d{8}$/;

function isValidBirthDate(value) {
  if (!BIRTH_DATE_REGEX.test(value)) return false;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));

  if (month < 1 || month > 12) return false;

  const date = new Date(year, month - 1, day);
  const isRealCalendarDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealCalendarDate) return false;
  if (date > new Date()) return false; // 미래 날짜 불가

  return true;
}

const Login = () => {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState({ patientId: "", birthDate: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 스플래시 화면에서 저장한 언어 선택값. 한국어면 배너 숨김.
  const selectedLang =
    typeof window !== "undefined" ? localStorage.getItem("naranhi_lang") : null;

  const handlePatientIdChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPatientId(value);
    if (errors.patientId) setErrors((prev) => ({ ...prev, patientId: "" }));
    if (formError) setFormError("");
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
    setBirthDate(value);
    if (errors.birthDate) setErrors((prev) => ({ ...prev, birthDate: "" }));
    if (formError) setFormError("");
  };

  const validate = () => {
    const nextErrors = { patientId: "", birthDate: "" };

    if (!patientId.trim()) {
      nextErrors.patientId = "환자 ID를 입력해 주세요.";
    } else if (!PATIENT_ID_REGEX.test(patientId.trim())) {
      nextErrors.patientId = "예: NR-2608-0417 형식의 12자리 코드를 입력해 주세요.";
    }

    if (!birthDate.trim()) {
      nextErrors.birthDate = "생년월일을 입력해 주세요.";
    } else if (!isValidBirthDate(birthDate.trim())) {
      nextErrors.birthDate =
        "YYYYMMDD 8자리, 여권 기재 생년월일 기준으로 입력해 주세요.";
    }

    setErrors(nextErrors);
    return !nextErrors.patientId && !nextErrors.birthDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // TODO: 백엔드 API 연동
      // - 아래 목업 대조 로직을 제거하고
      //   POST /api/auth/login { patientId, birthDate } 호출로 교체
      // - 성공 시 서버가 내려주는 세션/토큰 저장 + 온보딩 완료 여부에 따라 분기
      // - 실패(ID·생년월일 불일치, 미등록 환자) 시 서버 에러 메시지를 formError에 반영
      await new Promise((resolve) => setTimeout(resolve, 400));

      const matched = MOCK_PATIENTS.find(
        (p) => p.patientId === patientId.trim() && p.birthDate === birthDate.trim()
      );

      if (!matched) {
        setFormError("환자 ID 또는 생년월일이 일치하지 않습니다. 다시 확인해 주세요.");
        return;
      }

      console.log("[Login] 목업 로그인 성공:", matched);
      navigate("/onboarding/intake");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Content>
        <Title>
          병원에서 받은
          <br />
          환자 ID로 시작합니다.
        </Title>

        <Desc>
          따로 가입하지 않아요. 수술 안내 시 받은 ID와 생년월일만 입력하면
          병원이 등록해 둔 수술 정보가 이 기기로 바로 들어옵니다.
        </Desc>

        {selectedLang && selectedLang !== "ko" && (
          <LangBanner>
            선택한 언어 {selectedLang === "ja" ? "日本語" : "English"} — 이
            프로토타입은 본문을 한국어로 표시합니다.
          </LangBanner>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Field>
            <FieldLabel htmlFor="patientId">환자 ID</FieldLabel>
            <TextInput
              id="patientId"
              $hasError={!!errors.patientId}
              type="text"
              inputMode="text"
              value={patientId}
              onChange={handlePatientIdChange}
              maxLength={12}
              autoComplete="off"
            />
            {errors.patientId ? (
              <FieldError>{errors.patientId}</FieldError>
            ) : (
              <FieldHint>수술 안내문에 있는 12자리 코드</FieldHint>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="birthDate">생년월일</FieldLabel>
            <TextInput
              id="birthDate"
              $hasError={!!errors.birthDate}
              type="text"
              inputMode="numeric"
              value={birthDate}
              onChange={handleBirthDateChange}
              maxLength={8}
              autoComplete="off"
            />
            {errors.birthDate ? (
              <FieldError>{errors.birthDate}</FieldError>
            ) : (
              <FieldHint>
                YYYYMMDD ㆍ여권 기재 생년월일 기준
                <br />
                (2000년 1월 1일 → 20000101)
              </FieldHint>
            )}
          </Field>

          {formError && <FormError>{formError}</FormError>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "확인 중..." : "로그인"}
          </Button>
        </Form>

        <Spacer />

        <HelpBox>
          ID를 받지 못했다면 수술 병원 국제진료팀에 문의해 주세요. 나란히는
          환자를 병원에 연결·소개하지 않으며, 병원이 이미 등록한 환자만
          이용할 수 있습니다.
        </HelpBox>
      </Content>
    </Layout>
  );
};

export default Login;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  text-align: left;
`;

const Desc = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 12px 0 0;
`;

const LangBanner = styled.div`
  margin-top: 12px;
  font-size: 11px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.primaryHover};
  background: ${({ theme }) => theme.colors.primaryLight};
  border-radius: 10px;
  padding: 10px 12px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 28px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FieldLabel = styled.label`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  font-size: 14px;
  border-radius: ${({ theme }) => theme.radius.button};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.border};
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FieldHint = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const FieldError = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.danger};
  margin: 0;
`;

const FormError = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: 8px;
  padding: 8px 12px;
  text-align: center;
  margin: 0;
`;

const Spacer = styled.div`
  flex: 1;
  min-height: 24px;
`;

const HelpBox = styled.div`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textLight};
`;