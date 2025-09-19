// src/taskpane/components/settings/SettingsScreen.tsx
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
  Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useThemeController, ThemeChoice } from "../themeController";
import TutorialWindow from "../TutorialWindow";

type Props = {
  apiKey: string;
  setApiKey: (v: string) => void;
  problem: string | null;
  onValidate?: () => void;
  busy?: boolean;
};

const PAD = 2;
const CONTROL_H = 48;

export default function SettingsScreen({
  apiKey,
  setApiKey,
  problem,
  onValidate,
  busy,
}: Props) {
  const { themeChoice, setThemeChoice } = useThemeController();
  const [tutorialOpen, setTutorialOpen] = React.useState(false);

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
      {/* Header */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        Settings
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Manage your Endoc connection, appearance, and onboarding.
      </Typography>

      <Stack spacing={2.5}>
        {/* Connection */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 1.5,
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Endoc Connection
            </Typography>

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

            {problem && <Alert severity="error">{problem}</Alert>}

            {/* Optional save button (if provided by parent) */}
            {onValidate && (
              <Button
                variant="contained"
                onClick={onValidate}
                disabled={!apiKey || !!busy}
                sx={{
                  height: CONTROL_H,
                  textTransform: "none",
                  fontWeight: 600,
                  width: "100%",
                }}
              >
                {busy ? "Saving…" : "Save"}
              </Button>
            )}

            {/* Quick setup guide — outlined, full-width, same height */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<InfoOutlinedIcon />}
              onClick={() => setTutorialOpen(true)}
              sx={{
                height: CONTROL_H,
                textTransform: "none",
                fontWeight: 600,
                width: "100%",
              }}
            >
              Quick setup guide
            </Button>
          </Stack>
        </Paper>

        {/* Appearance */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: 1.5,
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
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
                sx={{
                  "& .MuiInputBase-root": { height: CONTROL_H },
                  "& .MuiSelect-select": { display: "flex", alignItems: "center" },
                }}
              >
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      </Stack>

      {/* Tutorial modal */}
      <TutorialWindow
        showTutorialWindow={tutorialOpen}
        closeTutorialWindow={() => setTutorialOpen(false)}
        apiKey={apiKey}
        handleApiKeyChange={(e) => setApiKey(e.target.value)}
      />
    </Box>
  );
}