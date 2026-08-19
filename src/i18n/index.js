import { theme } from "./theme.i18n";
import { home } from "./home.i18n";
import { checkin } from "./checkin.i18n";
import { onboarding } from "./onboarding.i18n";
import { schedule } from "./schedule.i18n";
import { login } from "./login.i18n";
import { history } from "./history.i18n";
import { hospital } from "./hospital.i18n";
import { notification } from "./notification.i18n";
import { splash } from "./splash.i18n";

function merge(...parts) {
  return {
    ko: Object.assign({}, ...parts.map((p) => p.ko)),
    ja: Object.assign({}, ...parts.map((p) => p.ja)),
  };
}

export const dict = merge(theme, home, schedule, checkin, splash, login, onboarding, notification, history, hospital);