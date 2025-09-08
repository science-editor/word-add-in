import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export function SettingsScreen({
  apiKey,
  setApiKey,
  onValidate,
  busy,
  problem,
  onResetOnboarding,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
  onValidate: () => void;
  busy: boolean;
  problem: string | null;
  onResetOnboarding: () => void;
}) {
  return (
    <Box sx={{ p: 2, maxWidth: 780, mx: "auto" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        Endoc Connection
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Paste your Endoc API key to enable search and Zotero features.
      </Typography>

      <Stack spacing={2.5}>
        {/* API key field */}
        <TextField
          label="Endoc API key"
          size="medium"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Endoc API key…"
          fullWidth
          sx={{
            "& .MuiInputBase-root": { height: 48 },
          }}
        />

        {/* Buttons: responsive row/column, consistent 48px height */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            variant="contained"
            onClick={onValidate}
            disabled={!apiKey || busy}
            sx={{
              height: 48,
              px: 2.5,
              textTransform: "none",
              fontWeight: 600,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {busy ? "Validating…" : "Validate connection"}
          </Button>

          <Button
            variant="outlined"
            onClick={onResetOnboarding}
            sx={{
              height: 48,
              px: 2.5,
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Show onboarding next time
          </Button>
        </Stack>

        {/* Problem feedback */}
        {problem && (
          <Alert severity="error">
            {problem}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}