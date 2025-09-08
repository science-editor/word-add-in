import { createTheme } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

export function makeMuiTheme(mode: ColorMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#3b82f6",
      },
      background: {
        default: mode === "dark" ? "#0b1220" : "#ffffff",
        paper: mode === "dark" ? "#0f172a" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#e5e7eb" : "#0f172a",
        secondary: mode === "dark" ? "#cbd5e1" : "#475569",
      },
      divider: mode === "dark" ? "#1f2a44" : "#e2e8f0",
    },
    typography: {
      fontSize: 14,
      h4: { fontSize: "1.6rem", fontWeight: 700 },
      h5: { fontSize: "1.25rem", fontWeight: 700 },
      body1: { fontSize: "0.95rem" },
      body2: { fontSize: "0.9rem" },
      button: { textTransform: "none" },
      fontFamily: `'Inter', 'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif`,
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { boxShadow: "none" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}
