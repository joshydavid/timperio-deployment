import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import dayjs from "dayjs";
import "./i18n";

import LocaleData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import WeekDay from "dayjs/plugin/weekday";

dayjs.extend(WeekDay);
dayjs.extend(LocaleData);
dayjs.extend(LocalizedFormat);

const container = document.getElementById("root");
// eslint-disable-next-line
const root = createRoot(container!);
root.render(
  // <React.StrictMode>
    <React.Suspense fallback={null}>
      <App />
    </React.Suspense>
  // </React.StrictMode>,
);
