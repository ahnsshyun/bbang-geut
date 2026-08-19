import axios from "axios";
import { getCurrentLang } from "../hooks/useLang";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const access = localStorage.getItem("naranhi_access_token");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  // 쿼리 파라미터로만 언어 전달 (헤더 방식은 CORS 문제로 제거)
  config.params = { ...config.params, lang: getCurrentLang() };

  return config;
});


export default apiClient;