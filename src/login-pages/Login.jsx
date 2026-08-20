import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import COLORS from "../styles/colors";
import FONTS, { font } from "../styles/fonts";
import Layout, { Content, Spacer } from "../components/Layout";
import LoginTheme from "../components/Theme/LoginTheme";
import { NoticeBox, ErrorBox } from "../components/Box/Box";
import Button from "../components/Button";
import { useLang } from "../hooks/useLang";

import { loginPatient, saveAuthSession } from "../api/auth";
import { getCurrentLang } from "../hooks/useLang";


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
  const { t } = useLang();
  const selectedLang = getCurrentLang();
  const [patientId, setPatientId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState({ patientId: "", birthDate: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      nextErrors.patientId = t("patientIdRequired");
    } else if (!PATIENT_ID_REGEX.test(patientId.trim())) {
      nextErrors.patientId = t("patientIdInvalid");
    }
    if (!birthDate.trim()) {
      nextErrors.birthDate = t("birthDateRequired");
    } else if (!isValidBirthDate(birthDate.trim())) {
      nextErrors.birthDate = t("birthDateInvalid");
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
      const serverMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.error?.message;

      if (err.response?.status === 401 || err.response?.status === 404) {
        setFormError(serverMessage || t("loginFail401"));
      } else {
        setFormError(serverMessage || t("loginFailGeneric"));
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
              {t("loginTitleLine1")}
              <br />
              {t("loginTitleLine2")}
            </>
          }
          desc={t("loginDesc")}
        />

        <Form onSubmit={handleSubmit} noValidate>
          <Field>
            <FieldLabel htmlFor="patientId">{t("patientIdLabel")}</FieldLabel>
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
              <FieldHint>{t("patientIdHint")}</FieldHint>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="birthDate">{t("birthDateLabel")}</FieldLabel>
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
              <FieldHint>{t("birthDateHint")}</FieldHint>
            )}
          </Field>

          {formError && <ErrorBox>{formError}</ErrorBox>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("submitting") : t("loginButton")}
          </Button>
        </Form>

        <Spacer />

        <NoticeBox>
          {t("noticeLine1")}
          <br />
          {t("noticeLine2")}
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