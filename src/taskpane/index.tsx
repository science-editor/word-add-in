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

function Index(): JSX.Element {
  const [mode, setMode] = React.useState<ColorMode>(detectInitialMode());

  // Listen for OS theme changes (make return type explicit for TS)
  React.useEffect((): void | (() => void) => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return; // void
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setMode(e.matches ? "dark" : "light");

    // Modern browsers
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => {
        mql.removeEventListener("change", handler);
      };
    }

    // Fallback (older Safari types)
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

    // If neither API exists, do nothing (void)
    return;
  }, []);

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