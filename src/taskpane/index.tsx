import * as React from "react";
import { createRoot } from "react-dom/client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { makeMuiTheme, ColorMode } from "./theme";

import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";

import App from "./components/App";

import {
  ThemeControllerProvider,
  useThemeController,
  ThemeChoice,
} from "./components/themeController";


const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;

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

function ThemeRoot(): JSX.Element {
  const { themeChoice } = useThemeController(); // "system" | "light" | "dark"
  const [systemMode, setSystemMode] = React.useState<ColorMode>(detectInitialMode());

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

    if (typeof mql.addListener === "function") {
      mql.addListener(handler);
      return () => {
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

Office.onReady(() => {
  root?.render(<Index />);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    root?.render(<NextApp />);
  });
}