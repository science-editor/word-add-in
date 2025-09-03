import * as React from "react";
import { Alert, AlertTitle, Box, Button, Stack, TextField } from "@mui/material";

export function ApiKeyGate({
  apiKey,
  onChange,
  onValidate,
  busy,
  problem,
}: {
  apiKey: string;
  onChange: (val: string) => void;
  onValidate: () => void;
  busy?: boolean;
  problem?: string | null;
}) {
  return (
    <Alert severity={problem ? "error" : "info"} sx={{ mb: 2 }}>
      <AlertTitle>{problem ? "Action required" : "Connect Endoc"}</AlertTitle>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
        <TextField
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your Endoc API key"
          size="small"
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          onClick={onValidate}
          disabled={!apiKey.trim() || !!busy}
        >
          {busy ? "Checking…" : "Check connection"}
        </Button>
      </Stack>
    </Alert>
  );
}