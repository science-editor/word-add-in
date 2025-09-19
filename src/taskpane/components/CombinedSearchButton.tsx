import * as React from "react";
import {
  ButtonGroup,
  Button,
  CircularProgress,
  Divider,
  Tooltip,
} from "@mui/material";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";

type Props = {
  searchTerm: string;
  setSearchTerm: (t: string) => void;
  onRunSearch: (t: string) => void;
  loading?: boolean;
  disabled?: boolean;
  height?: number;
};

export default function CombinedSearchButton({
  searchTerm,
  setSearchTerm,
  onRunSearch,
  loading = false,
  disabled = false,
  height = 48,
}: Props) {
  const handleQuickSearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;

    try {
      await Word.run(async (context) => {
        const body = context.document.body;
        body.load("text");
        await context.sync();

        const text = (body.text || "").trim();
        if (!text) return;

        setSearchTerm(text);
        onRunSearch(text);
      });
    } catch (err) {
      console.error("Quick search failed:", err);
    }
  };

  return (
    <ButtonGroup
      fullWidth
      sx={{
        "& .MuiButton-root": {
          height,
          textTransform: "none",
          fontWeight: 600,
          whiteSpace: "nowrap",
        },
      }}
    >
      {/* Left: Quick Search */}
      <Tooltip title="Use the document text as search input">
        <Button
          variant="contained"
          color="primary"
          onClick={handleQuickSearch}
          disabled={disabled || loading}
          startIcon={<DocumentScannerOutlinedIcon fontSize="small" />}
          sx={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            flex: 1,
          }}
        >
          Quick search
        </Button>
      </Tooltip>

      {/* Divider between buttons */}
      <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

      {/* Right: Normal Search */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => onRunSearch(searchTerm)}
        disabled={disabled || loading || !searchTerm}
        startIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" sx={{ mr: -0.5 }} />
          ) : null
        }
        sx={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          flex: 1,
        }}
      >
        {loading ? "Searching…" : "Search"}
      </Button>
    </ButtonGroup>
  );
}