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
    // Reset state when paper changes
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
        <Stack spacing={1.25}>
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

          <Typography variant="body2" color="text.secondary">
            <strong>Year:</strong>{" "}
            {expandedPaper?.year ?? <em>Not available</em>}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ pt: 0.5, flexWrap: "wrap" }}>
            <DOIChip paper={expandedPaper} />
            <GoogleScholarChip paper={expandedPaper} />
          </Stack>
        </Stack>
      </DialogContent>

      <Divider />

      {/* Abstract */}
      <DialogContent sx={{ py: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
          Abstract
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
          {expandedPaper?.abstract || "Abstract not available for this paper."}
        </Typography>
      </DialogContent>

      <Divider />

      {/* Full text */}
      <DialogContent sx={{ py: 2, pb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
          Full text
        </Typography>
        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
          {expandedPaper?.fullPaper || "Full body not available for this paper."}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}