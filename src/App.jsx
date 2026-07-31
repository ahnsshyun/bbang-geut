import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnboardingWelcome from "./pages/OnboardingWelcome";
import OnboardingCheck from "./pages/OnboardingCheck";
import OnboardingReturn from "./pages/OnboardingReturn";
import OnboardingLang from "./pages/OnboardingLang";

import Home from "./pages/Home";
import Checkin from "./pages/Checkin";
import Guide from "./pages/Guide";
import Consult from "./pages/Consult";
import History from "./pages/History";

import "./App.css";
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from './styles/theme';

import MainLayout from "./components/MainLayout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingWelcome />} />
        <Route path="/onboarding/check" element={<OnboardingCheck />} />
        <Route path="/onboarding/return" element={<OnboardingReturn />} />
        <Route path="/onboarding/lang" element={<OnboardingLang />} />

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