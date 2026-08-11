import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";

import OnboardingPersonal from "./pages/OnboardingPersonal";
import OnboardingComplete from "./pages/OnboardingComplete";
import OnboardingWelcome from "./pages/OnboardingWelcome";
import OnboardingIntake from "./pages/OnboardingIntake";
import PrescriptionCapture from "./pages/PrescriptionCapture";
import OnboardingCheck from "./pages/OnboardingCheck";
import OnboardingReturn from "./pages/OnboardingReturn";
import OnboardingLang from "./pages/OnboardingLang";

import Home from "./pages/Home";
import Checkin from "./pages/Checkin";
import Guide from "./pages/Guide";
import Consult from "./pages/Consult";
import History from "./pages/History";

import "./App.css";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyle } from "./styles/theme";

import MainLayout from "./components/MainLayout";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* 진입 · 로그인 */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />

          {/* 온보딩
              현재 로그인 성공 시 /onboarding/intake로 바로 이동하도록 되어 있어서
              /onboarding/welcome은 라우트만 살아있고 흐름상 연결은 안 돼 있어요.
              필요 없으면 이 줄 지우셔도 됩니다. */}
          <Route path="/onboarding/personal" element={<OnboardingPersonal />} />
          <Route path="/onboarding/complete" element={<OnboardingComplete />} />
          <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
          <Route path="/onboarding/intake" element={<OnboardingIntake />} />
          <Route path="/onboarding/prescription" element={<PrescriptionCapture />} />
          <Route path="/onboarding/check" element={<OnboardingCheck />} />
          <Route path="/onboarding/return" element={<OnboardingReturn />} />
          <Route path="/onboarding/lang" element={<OnboardingLang />} />

          {/* 메인 탭 (하단 네비 등 공통 레이아웃 적용) */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/checkin" element={<Checkin />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/consult" element={<Consult />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;