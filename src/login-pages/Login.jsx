import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/LoginTheme";
import { NoticeBox, ErrorBox } from "../components/Box";
import Button from "../components/Button";

import { loginPatient, saveAuthSession } from "../api/auth";

const PATIENT_ID_REGEX = /^[A-Z]{2}-\d{4}-\d{4}$/;
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
  if (date > new Date()) return false;
  return true;
}

// 스플래시 화면 언어 선택값(ko/ja/en) → 서버가 받는 lang(ko/ja)으로 변환
// TODO: 스플래시에 English 옵션이 있는데 서버 명세는 ja/ko만 허용해요.
// English를 고른 환자는 어떤 값으로 보내야 하는지 백엔드와 확인 필요.
// 지금은 임시로 en도 ko로 보냅니다.
function toServerLang(clientLang) {
  if (clientLang === "ja") return "ja";
  return "ko";
}

const Login = () => {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState({ patientId: "", birthDate: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      nextErrors.patientId = "12자리 코드를 입력해 주세요.";
    }
    if (!birthDate.trim()) {
      nextErrors.birthDate = "생년월일을 입력해 주세요.";
    } else if (!isValidBirthDate(birthDate.trim())) {
      nextErrors.birthDate = "YYYYMMDD 8자리, 여권 기재 생년월일 기준으로 입력해 주세요.";
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
      const data = await loginPatient({
        patientCode: patientId.trim(),
        dob: birthDate.trim(),
        lang: toServerLang(selectedLang),
      });

      saveAuthSession(data);
      navigate("/onboarding/intake");
    } catch (err) {
      // TODO: 실제 에러 응답 형식(필드명)이 확정되면 아래 우선순위 맞춰서 조정
      const serverMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.error;

      if (err.response?.status === 401 || err.response?.status === 404) {
        setFormError(
          serverMessage || "환자 ID 또는 생년월일이 일치하지 않습니다. 다시 확인해 주세요."
        );
      } else {
        setFormError(serverMessage || "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Content>
        <LoginTheme
          title={
            <>
              병원에서 받은
              <br />
              환자 ID로 시작합니다.
            </>
          }
          desc={"수술 안내 시 받은 ID와 생년월일을 입력하면\n병원이 등록해 둔 수술 정보가 이 기기로 바로 들어옵니다."}
        />

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
              <FieldHint $error>{errors.patientId}</FieldHint>
            ) : (
              <FieldHint>안내문에 있는 12자리 코드</FieldHint>
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
              <FieldHint $error>{errors.birthDate}</FieldHint>
            ) : (
              <FieldHint>
                YYYYMMDD ㆍ여권 기재 생년월일 기준
              </FieldHint>
            )}
          </Field>

          {formError && <ErrorBox>{formError}</ErrorBox>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "확인 중..." : "로그인"}
          </Button>
        </Form>

        <Spacer />

        <NoticeBox>
          ID를 받지 못했다면 수술 병원에 문의해 주세요.
          <br />병원이 등록한 환자만 이용할 수 있습니다.
        </NoticeBox>
      </Content>
    </Layout>
  );
};

export default Login;


const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 30px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FieldLabel = styled.label`
  ${font("body")}
  color: ${COLORS.text_gray};
`;

const TextInput = styled.input`
  ${font("semibody")}
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${({ $hasError }) => ($hasError ? COLORS.error : "#E5E5EA")};
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${COLORS.main};
  }
`;

const FieldHint = styled.p`
  ${font("regbody")}
  color: ${({ $error }) => ($error ? COLORS.error : COLORS.text_gray)};
  margin: 0;
`;