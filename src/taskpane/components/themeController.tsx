// src/taskpane/components/themeController.tsx
import * as React from "react";

/** What the user can pick in Settings */
export type ThemeChoice = "system" | "light" | "dark";

/** Internally we also expose the effective mode after resolving "system" */
export type ColorMode = "light" | "dark";

type Ctx = {
  themeChoice: ThemeChoice;
  setThemeChoice: (c: ThemeChoice) => void;
};

const ThemeControllerContext = React.createContext<Ctx | undefined>(undefined);

const LS_KEY = "endoc:themeChoice";

function readInitialChoice(): ThemeChoice {
  try {
    const val = localStorage.getItem(LS_KEY) as ThemeChoice | null;
    if (val === "light" || val === "dark" || val === "system") return val;
  } catch {
    /* ignore */
  }
  return "system";
}

/** Resolve OS preference to a ColorMode */
function detectSystemMode(): ColorMode {
  try {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      return mql.matches ? "dark" : "light";
    }
  } catch {
    /* ignore */
  }
  return "light";
}

export function ThemeControllerProvider({ children }: { children: React.ReactNode }) {
  const [themeChoice, setThemeChoiceState] = React.useState<ThemeChoice>(readInitialChoice());
  const [systemMode, setSystemMode] = React.useState<ColorMode>(detectSystemMode());

  // Keep systemMode in sync with OS only when following "system"
  React.useEffect(() => {
    // Explicit return type fixes TS7030
    const noCleanup: undefined = undefined;

    if (themeChoice !== "system") {
      return noCleanup;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return noCleanup;
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemMode(e.matches ? "dark" : "light");

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => {
        mql.removeEventListener("change", handler);
      };
    }

    // Safari fallback
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

    return noCleanup;
  }, [themeChoice]);

  // Persist & reflect to <html> for consistent native form control rendering
  React.useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, themeChoice);
    } catch {
      /* ignore */
    }

    // compute effective mode for color-scheme hint
    const effective: ColorMode = themeChoice === "system" ? systemMode : themeChoice;

    // Helps built-in widgets pick the right colors in some hosts
    document.documentElement.style.setProperty("color-scheme", effective);

    // Optional: a data attribute you can use in CSS if needed
    document.documentElement.setAttribute("data-theme", themeChoice);
    document.documentElement.setAttribute("data-theme-effective", effective);

    // No cleanup needed; return void to satisfy TS
    return;
  }, [themeChoice, systemMode]);

  const setThemeChoice = React.useCallback((c: ThemeChoice) => {
    setThemeChoiceState(c);
  }, []);

  const value = React.useMemo<Ctx>(() => ({ themeChoice, setThemeChoice }), [themeChoice, setThemeChoice]);

  return (
    <ThemeControllerContext.Provider value={value}>
      {children}
    </ThemeControllerContext.Provider>
  );
}

export function useThemeController(): Ctx {
  const ctx = React.useContext(ThemeControllerContext);
  if (!ctx) throw new Error("useThemeController must be used within ThemeControllerProvider");
  return ctx;
}