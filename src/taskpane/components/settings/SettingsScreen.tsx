import * as React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useThemeController, ThemeChoice } from "../themeController";

type Props = {
  apiKey: string;
  setApiKey: (v: string) => void;
  problem: string | null;
  onResetOnboarding: () => void;
  onValidate?: () => void;
  busy?: boolean;
};

const PAD = 2;
const CONTROL_H = 48;

export function SettingsScreen({
  apiKey,
  setApiKey,
  problem,
  onResetOnboarding,
  onValidate,
  busy,
}: Props) {
  const { themeChoice, setThemeChoice } = useThemeController();

  return (
      <Box
        sx={{
          pt: 1,
          px: PAD,
          pb: PAD,
          maxWidth: 780,
          mx: "auto",
        }}
      >

      {/* Connection */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        Endoc Connection
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Paste your Endoc API key to enable search and Zotero features.
      </Typography>

      <Stack spacing={2.5}>
        <TextField
          label="Endoc API key"
          placeholder="Enter your Endoc API key…"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          fullWidth
          size="medium"
          InputLabelProps={{ shrink: true }}
          sx={{ "& .MuiInputBase-root": { height: CONTROL_H } }}
        />

        {/* Optional primary action (kept if your Panel still passes onValidate/busy) */}
        {onValidate && (
          <Button
            variant="contained"
            onClick={onValidate}
            disabled={!apiKey || !!busy}
            sx={{ height: CONTROL_H, textTransform: "none", fontWeight: 600, width: { xs: "100%", sm: "auto" } }}
          >
            {busy ? "Saving…" : "Save"}
          </Button>
        )}

        {problem && <Alert severity="error">{problem}</Alert>}

        <Button
          variant="outlined"
          onClick={onResetOnboarding}
          sx={{ height: CONTROL_H, textTransform: "none", width: { xs: "100%", sm: "auto" } }}
        >
          Show onboarding next time
        </Button>

        {/* Appearance */}
        <Box sx={{ pt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Appearance
          </Typography>
          <FormControl fullWidth size="medium">
            <InputLabel shrink id="appearance-mode-label">
              Theme
            </InputLabel>
            <Select
              labelId="appearance-mode-label"
              value={themeChoice}
              onChange={(e) => setThemeChoice(e.target.value as ThemeChoice)}
              label="Theme"
              displayEmpty
              sx={{ "& .MuiInputBase-root, & .MuiSelect-select": { height: CONTROL_H } }}
            >
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Box>
  );
}

export default SettingsScreen;