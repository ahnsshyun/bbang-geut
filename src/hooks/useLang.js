import { dict } from "../i18n";

const STORAGE_KEY = "naranhi_selected_lang";

export function getCurrentLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "ja" || stored === "en" ? stored : "ko";
}

export function setCurrentLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function useLang() {
  const lang = getCurrentLang();
  const t = (key) => dict[lang]?.[key] ?? dict.ko[key] ?? key;
  return { lang, t };
}