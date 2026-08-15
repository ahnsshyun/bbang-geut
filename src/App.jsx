import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./login-pages/Splash";
import Login from "./login-pages/Login";

import OnboardingIntake from "./login-pages/OnboardingIntake";
import PrescriptionCapture from "./login-pages/PrescriptionCapture";
import PrescriptionResult from "./login-pages/PrescriptionResult";

import OnboardingCheck from "./login-pages/OnboardingCheck";
import OnboardingPersonal from "./login-pages/OnboardingPersonal";
import OnboardingComplete from "./login-pages/OnboardingComplete";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./home-pages/Home";
import Schedule from "./home-pages/Schedule";
import Notification from "./home-pages/Notification";

import CheckinPhoto from "./checkin-pages/CheckinPhoto";
import CheckinStatus from "./checkin-pages/CheckinStatus";
import CheckinComplete from "./checkin-pages/CheckinComplete";

import History from "./history-pages/History";
import HistorySubmission from "./history-pages/HistorySubmission";
import HomeCountry from "./history-pages/HomeCountry";

import Hospital from "./hospital-pages/Hospital";

function App() {
  return (
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
          <Route path="/onboarding/intake" element={<OnboardingIntake />} />
          <Route path="/onboarding/prescription/capture" element={<PrescriptionCapture />} />
          <Route path="/onboarding/prescription/result" element={<PrescriptionResult />} />
          
          <Route path="/onboarding/check" element={<OnboardingCheck />} />
          <Route path="/onboarding/personal" element={<OnboardingPersonal />} />
          <Route path="/onboarding/complete" element={<OnboardingComplete />} />

          {/* 메인 탭 */}
          <Route path="/home" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/notification" element={<Notification />} />
          
          <Route path="/checkin/photo" element={<CheckinPhoto />} />
          <Route path="/checkin/status" element={<CheckinStatus />} />
          <Route path="/checkin/complete" element={<CheckinComplete />} />

          <Route path="/history" element={<History />} />
          <Route path="/history/submission" element={<HistorySubmission />} />
          <Route path="/home-country" element={<HomeCountry />} />

          <Route path="/hospital" element={<Hospital />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;