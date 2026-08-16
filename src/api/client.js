import axios from "axios";

// .env(.env.local 등)에 VITE_API_BASE_URL=https://... 형태로 넣어주세요.
// vite는 VITE_ 접두사가 붙은 환경변수만 import.meta.env로 노출합니다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  // 배포 전에 반드시 잡아야 하는 설정 누락이라 콘솔에 크게 남깁니다.
  // eslint-disable-next-line no-console
  console.warn(
    "[api] VITE_API_BASE_URL이 설정되지 않았습니다. .env 파일을 확인하세요."
  );
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 요청 나갈 때마다 access 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const access = localStorage.getItem("naranhi_access_token");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// 401 응답을 받으면 refresh 토큰으로 한 번 자동 재발급 시도 후 원래 요청 재시도.
// 동시에 여러 요청이 401을 받아도 refresh는 한 번만 실행되도록 큐로 처리.
let isRefreshing = false;
let waitingQueue = [];

function flushQueue(error, newAccessToken = null) {
  waitingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newAccessToken);
  });
  waitingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // 이미 다른 요청이 refresh 중이면, 그 결과를 기다렸다가 재시도
        return new Promise((resolve, reject) => {
          waitingQueue.push({ resolve, reject });
        }).then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem("naranhi_refresh_token");
        if (!refresh) throw error;

        // refresh는 인터셉터 무한루프를 피하려고 별도 axios 인스턴스로 호출
        const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refresh,
        });

        localStorage.setItem("naranhi_access_token", data.access);
        flushQueue(null, data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        // refresh도 만료/실패 → 세션 정리 후 로그인 화면으로
        localStorage.removeItem("naranhi_access_token");
        localStorage.removeItem("naranhi_refresh_token");
        localStorage.removeItem("naranhi_patient");
        localStorage.removeItem("naranhi_surgery_id");
        localStorage.removeItem("naranhi_care_status");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;