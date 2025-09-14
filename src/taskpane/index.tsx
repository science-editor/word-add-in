import * as React from "react";
import { createRoot } from "react-dom/client";

// MUI theming
import { ThemeProvider, CssBaseline } from "@mui/material";
import { makeMuiTheme, ColorMode } from "./theme";

// Fluent UI theming
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";

import App from "./components/App";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// ✅ correct path (file is under components/)
import {
  ThemeControllerProvider,
  useThemeController,
  ThemeChoice,
} from "./components/themeController";

/* global document, Office, module, require, HTMLElement */

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

/** Decide dark or light based on system preference (always returns). */
function detectInitialMode(): ColorMode {
  try {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      return mql.matches ? "dark" : "light";
    }
  } catch {
    // ignore
  }
  return "light";
}

/** Inner wire-up: follow System/Light/Dark selection and provide both MUI + Fluent themes. */
function ThemeRoot(): JSX.Element {
  const { themeChoice } = useThemeController(); // "system" | "light" | "dark"
  const [systemMode, setSystemMode] = React.useState<ColorMode>(detectInitialMode());

  // Only listen when following system
  React.useEffect((): void | (() => void) => {
    if (themeChoice !== "system") return;

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemMode(e.matches ? "dark" : "light");

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    // Safari legacy fallback
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof mql.addListener === "function") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mql.addListener(handler);
      return () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mql.removeListener(handler);
      };
    }
    return;
  }, [themeChoice]);

  const mode: ColorMode =
    themeChoice === "system" ? systemMode : (themeChoice as Exclude<ThemeChoice, "system">);

  const muiTheme = React.useMemo(() => makeMuiTheme(mode), [mode]);
  const fluentTheme = mode === "dark" ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={fluentTheme}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <App />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="auto"
        />
      </ThemeProvider>
    </FluentProvider>
  );
}

function Index(): JSX.Element {
  return (
    <ThemeControllerProvider>
      <ThemeRoot />
    </ThemeControllerProvider>
  );
}

/* Render application after Office initializes */
Office.onReady(() => {
  root?.render(<Index />);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root?.render(<NextApp />);
  });
}