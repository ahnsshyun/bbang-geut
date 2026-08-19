import { useState, useEffect, useCallback } from "react";
import { dict } from "../i18n";

const STORAGE_KEY = "naranhi_selected_lang";

export function getCurrentLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "ja" || stored === "en" ? stored : "ko";
}

export function setCurrentLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  // 같은 탭 안에서도 변경을 알리기 위한 커스텀 이벤트
  window.dispatchEvent(new Event("langchange"));
}

export function useLang() {
  const [lang, setLang] = useState(getCurrentLang());

  useEffect(() => {
    const handleChange = () => setLang(getCurrentLang());
    window.addEventListener("langchange", handleChange);
    window.addEventListener("storage", handleChange); // 다른 탭 변경 감지용
    return () => {
      window.removeEventListener("langchange", handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const t = useCallback(
    (key) => dict[lang]?.[key] ?? dict.ko[key] ?? key,
    [lang]
  );

  return { lang, t };
}