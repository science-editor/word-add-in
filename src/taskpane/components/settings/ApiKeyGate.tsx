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
      <AlertTitle sx={{ fontWeight: 700 }}>
        {problem ? "Action required" : "Connect Endoc"}
      </AlertTitle>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mt: 1 }}
      >
        <TextField
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your Endoc API key"
          size="medium"
          fullWidth
          sx={{
            "& .MuiInputBase-root": { height: 48 },
          }}
        />

        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            onClick={onValidate}
            disabled={!apiKey.trim() || !!busy}
            sx={{ height: 48, px: 2.5, textTransform: "none", fontWeight: 600, width: { xs: "100%", sm: "auto" } }}
          >
            {busy ? "Checking…" : "Check connection"}
          </Button>
        </Box>
      </Stack>
    </Alert>
  );
}