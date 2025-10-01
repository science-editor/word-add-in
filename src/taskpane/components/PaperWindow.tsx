// src/taskpane/components/PaperWindow.tsx
import * as React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DOIChip from "./DOIChip";
import GoogleScholarChip from "./GoogleScholarChip";

const ZOTERO_RED = "#CC2936";
const ZOTERO_ICON_URL =
  "https://raw.githubusercontent.com/science-editor/word-add-in/refs/heads/main/assets/zotero-icon.ico";

const RHYTHM = 1.25;
const H_GAP = 0.75;
const CONTROL_MIN_HEIGHT = 48;

type Props = {
  expandedPaper: any | null;
  setExpandedPaper: (p: any | null) => void;
  handleClickZoteroBtn: (p: any) => Promise<any> | any;
};

export default function PaperWindow({
  expandedPaper,
  setExpandedPaper,
  handleClickZoteroBtn,
}: Props) {
  const [adding, setAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => {
    setAdding(false);
    setAdded(false);
  }, [expandedPaper]);

  const onAdd = async () => {
    if (!expandedPaper) return;
    setAdding(true);
    try {
      await handleClickZoteroBtn(expandedPaper);
      setAdded(true);
    } finally {
      setAdding(false);
    }
  };

  const hasYear =
    expandedPaper?.year !== undefined &&
    expandedPaper?.year !== null &&
    expandedPaper?.year !== "";

  return (
    <Dialog
      open={Boolean(expandedPaper)}
      onClose={() => setExpandedPaper(null)}
      fullWidth
      maxWidth="md"
      scroll="body"
      PaperProps={{
        elevation: 0,
        sx: {
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1.5,
        },
      }}
    >
      {/* Minimal title bar */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          aria-label="Close"
          size="small"
          onClick={() => setExpandedPaper(null)}
          sx={{ width: 36, height: 36 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Header */}
      <DialogContent sx={{ pt: 2, pb: 1 }}>
        {/* Every child below respects a single vertical rhythm */}
        <Stack spacing={RHYTHM}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ lineHeight: 1.25, whiteSpace: "pre-wrap" }}
          >
            {expandedPaper?.title || ""}
          </Typography>

          {added ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<CheckCircleIcon sx={{ color: "success.main" }} />}
              sx={{
                height: CONTROL_MIN_HEIGHT,
                alignSelf: "flex-start",
                textTransform: "none",
                fontWeight: 600,
                color: "success.main",
                borderColor: "success.main",
                "&:hover": {
                  borderColor: "success.main",
                  backgroundColor: "rgba(46,125,50,0.08)",
                },
              }}
            >
              Added to Zotero
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              onClick={onAdd}
              disabled={adding}
              startIcon={
                adding ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <img
                    src={ZOTERO_ICON_URL}
                    alt=""
                    width={16}
                    height={16}
                    style={{ display: "block" }}
                  />
                )
              }
              sx={{
                height: CONTROL_MIN_HEIGHT,
                alignSelf: "flex-start",
                textTransform: "none",
                fontWeight: 600,
                color: ZOTERO_RED,
                borderColor: ZOTERO_RED,
                "&:hover": {
                  borderColor: ZOTERO_RED,
                  backgroundColor: "rgba(204,41,54,0.06)",
                },
              }}
            >
              {adding ? "Adding…" : "Add to Zotero"}
            </Button>
          )}

          {/* Meta */}
          <Typography variant="body2" color="text.secondary">
            {expandedPaper?.authors?.length ? (
              <>
                <strong>Authors:</strong>{" "}
                {expandedPaper.authors
                  .map((a: any) => `${a?.FamilyName}, ${a?.GivenName?.[0]}.`)
                  .join(" ")}
              </>
            ) : (
              <em>Authors not available</em>
            )}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Venue:</strong>{" "}
            {expandedPaper?.venue || <em>Not available</em>}
          </Typography>

          {hasYear && (
            <Typography variant="body2" color="text.secondary">
              <strong>Year:</strong> {expandedPaper?.year}
            </Typography>
          )}

          {/* Chips group: same vertical rhythm to siblings; tighter horizontal gap within */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              // exact vertical rhythm between wrapped rows
              rowGap: (t) => t.spacing(RHYTHM),
              // tighter horizontal spacing when side-by-side
              columnGap: (t) => t.spacing(H_GAP),
            }}
          >
            <DOIChip paper={expandedPaper} />
            <GoogleScholarChip paper={expandedPaper} />
          </Box>
        </Stack>
      </DialogContent>

      {/* Divider with the same rhythm above/below sections */}
      <Divider sx={{ my: RHYTHM }} />

      {/* Abstract */}
      <DialogContent sx={{ py: 0 }}>
        <Stack spacing={RHYTHM}>
          <Typography variant="subtitle2">Abstract</Typography>
          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
            {expandedPaper?.abstract || "Abstract not available for this paper."}
          </Typography>
        </Stack>
      </DialogContent>

      <Divider sx={{ my: RHYTHM }} />

      {/* Full text */}
      <DialogContent sx={{ py: 0, pb: 2 }}>
        <Stack spacing={RHYTHM}>
          <Typography variant="subtitle2">Full text</Typography>
          <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
            {expandedPaper?.fullPaper || "Full body not available for this paper."}
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}