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
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Endoc Connection
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Paste your Endoc API key to enable search and Zotero features.
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 520 }}>
        <TextField
          label="Endoc API key"
          size="small"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Endoc API key…"
          fullWidth
        />

        <Box>
          <Button
            variant="contained"
            onClick={onValidate}
            disabled={!apiKey || busy}
            sx={{ textTransform: "none", mr: 1 }}
          >
            {busy ? "Validating…" : "Validate connection"}
          </Button>
          <Button
            variant="outlined"
            onClick={onResetOnboarding}
            sx={{ textTransform: "none" }}
          >
            Show onboarding next time
          </Button>
        </Box>

        {problem && (
          <Alert severity="error">
            {problem}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}