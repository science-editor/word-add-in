// src/taskpane/components/TutotrialWindow.tsx
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  TextField,
  Link,
  Divider,
} from "@mui/material";

type CloseReason =
  | "backdropClick"
  | "escapeKeyDown"
  | "iconButton"
  | "programmatic"
  | undefined;

interface TutorialWindowProps {
  showTutorialWindow: boolean;
  // IMPORTANT: parent should mark onboarding as complete on ANY reason
  closeTutorialWindow: (reason?: CloseReason) => void;
  apiKey: string;
  handleApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CONTROL_MIN_HEIGHT = 48;

export default function TutorialWindow({
  showTutorialWindow,
  closeTutorialWindow,
  apiKey,
  handleApiKeyChange,
}: TutorialWindowProps) {
  const endocURL = "https://endoc.ethz.ch/";
  const zoteroDownloadURL = "https://www.zotero.org/download/";

  // Shared image style
  const imgSx = {
    borderRadius: 1,
    boxShadow: (t: any) =>
      t.palette.mode === "dark" ? "0 2px 10px rgba(0,0,0,0.6)" : "0 2px 10px rgba(0,0,0,0.12)",
    maxWidth: "100%",
    height: "auto",
    display: "block",
  };

  return (
    <Dialog
      open={Boolean(showTutorialWindow)}
      onClose={(_evt, reason) => closeTutorialWindow(reason as CloseReason)}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        elevation: 0,
        sx: {
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1.5,
        },
      }}
    >
      {/* Title matches Advanced Filters modal style */}
      <DialogTitle sx={{ fontWeight: 700 }}>Set up your Word Add-in</DialogTitle>

      {/* Body with section dividers for clarity & consistency */}
      <DialogContent dividers sx={{ pt: 2 }}>
        {/* Section: Get your API key */}
        <Stack spacing={1.5}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Get your API key
          </Typography>

          <Typography variant="body2" color="text.secondary">
            1. Create a free{" "}
            <Link href={endocURL} target="_blank" rel="noopener noreferrer">
              Endoc
            </Link>{" "}
            account or log in to your existing one.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            2. Go to <strong>Account Settings</strong>, and generate a new API key or use an existing
            one.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mt: 0.5,
            }}
          >
            <Box component="img"
              src="https://raw.githubusercontent.com/science-editor/word-add-in/main/assets/tutorial_account_settings.png"
              alt="Account Settings"
              sx={imgSx}
            />
            <Box component="img"
              src="https://raw.githubusercontent.com/science-editor/word-add-in/main/assets/tutorial_api_key.png"
              alt="Generate API Key"
              sx={imgSx}
            />
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ pt: 0.5 }}
          >
            <Typography variant="body2" sx={{ minWidth: { sm: 130 }, fontWeight: 500 }}>
              3. Save your key:
            </Typography>
            <TextField
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Endoc API key…"
              size="medium"
              fullWidth
              InputLabelProps={{ shrink: false }}
              sx={{ "& .MuiInputBase-root": { height: CONTROL_MIN_HEIGHT } }}
            />
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Section: Connect to Zotero */}
        <Stack spacing={1.5}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Connect to Zotero
          </Typography>

          <Typography variant="body2" color="text.secondary">
            1. Go to{" "}
            <Link href={endocURL} target="_blank" rel="noopener noreferrer">
              Endoc
            </Link>{" "}
            and navigate to your <strong>Account Settings</strong>.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            2. Connect your Zotero account to Endoc.
          </Typography>

          <Box
            component="img"
            src="https://raw.githubusercontent.com/science-editor/word-add-in/main/assets/tutorial_zotero.png"
            alt="Connect to Zotero"
            sx={{ ...imgSx, maxWidth: 520 }}
          />

          <Typography variant="body2" color="text.secondary">
            3. You can now add papers to your Zotero collection directly from the Word add-in.
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Section: Access your Endoc Zotero collection */}
        <Stack spacing={1.5}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Access your Endoc Zotero collection
          </Typography>

          <Typography variant="body2" color="text.secondary">
            1. If you haven’t already, install{" "}
            <Link href={zoteroDownloadURL} target="_blank" rel="noopener noreferrer">
              Zotero
            </Link>
            . It comes with the Zotero Word plugin.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            2. Open the Zotero application on your computer.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            3. In Word, go to the <strong>Zotero</strong> tab and click <strong>Add/Edit Citation</strong>.
          </Typography>

          <Box
            component="img"
            src="https://raw.githubusercontent.com/science-editor/word-add-in/main/assets/tutorial_zotero_plugin.png"
            alt="Zotero in Word"
            sx={{ ...imgSx, maxWidth: 520 }}
          />

          <Typography variant="body2" color="text.secondary">
            4. Select one of the papers in your Endoc Word Add-in collection to cite it in your document.
          </Typography>

          <Box
            component="img"
            src="https://raw.githubusercontent.com/science-editor/word-add-in/main/assets/tutorial_zotero_collection.png"
            alt="Cite from Zotero collection"
            sx={{ ...imgSx, maxWidth: 720 }}
          />
        </Stack>
      </DialogContent>

      {/* Bottom action row, same rhythm/height as FiltersModal */}
      <DialogActions
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          onClick={() => closeTutorialWindow("programmatic")}
          variant="contained"
          sx={{ textTransform: "none", fontWeight: 600, height: CONTROL_MIN_HEIGHT }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}