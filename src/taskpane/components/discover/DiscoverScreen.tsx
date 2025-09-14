// src/taskpane/components/discover/DiscoverScreen.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { SemanticSearchInput } from "../panel/SemanticSearchInput";
import KeywordFilter from "../KeywordFilter";
import SearchResultsPanel from "../SearchResultsPanel";
import { AdvancedFilterState, Paper as PaperType } from "../../types";
import { SkeletonList } from "./SkeletonList";
import { FiltersModal } from "./FiltersModal";

const PAD = 2;
const CONTROL_MIN_HEIGHT = 48;

export function DiscoverScreen({
  apiKeyPresent,
  goToSettings,
  searchTerm,
  setSearchTerm,
  setTouched,
  keywords,
  setKeywords,
  advancedFilters,
  onAddFilter,
  onRemoveFilter,
  onUpdateFilter,
  onRunSearch,
  loading,
  results,
  onReadPaper,
  onAddToZotero,
}: {
  apiKeyPresent: boolean;
  goToSettings: () => void;

  searchTerm: string;
  setSearchTerm: (v: string) => void;
  setTouched: (b: boolean) => void;

  keywords: string[];
  setKeywords: (k: string[]) => void;

  advancedFilters: AdvancedFilterState[];
  onAddFilter: () => void;
  onRemoveFilter: (id: string) => void;
  onUpdateFilter: (id: string, key: keyof AdvancedFilterState, val: any) => void;

  onRunSearch: (term: string) => void;

  loading: boolean;
  results: PaperType[] | null;

  onReadPaper: (p: PaperType) => void;
  onAddToZotero: (p: PaperType) => void;
}) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const hasResults = Boolean(results && results.length > 0);
  const showEmpty = !loading && !hasResults;

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
      {/* No API key — warning card with warning background */}
      {!apiKeyPresent && (
        <Box sx={{ mt: PAD + 1, mb: PAD + 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: (t) => `1px solid ${t.palette.warning.main}`,
              borderRadius: 1.5,
              textAlign: "center",
              bgcolor: (t) =>
                t.palette.mode === "dark"
                  ? "rgba(255,193,7,0.1)"
                  : "rgba(255,193,7,0.12)",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                mx: "auto",
                mb: 1.5,
                display: "grid",
                placeItems: "center",
                color: "#fff",
                bgcolor: (t) => t.palette.warning.main,
              }}
            >
              <WarningAmberOutlinedIcon />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Connect Endoc to search
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", mb: 2 }}>
              Add your Endoc API key to enable search and Zotero features.
            </Typography>

            <Button
              variant="contained"
              color="warning"
              fullWidth
              onClick={goToSettings}
              sx={{
                height: CONTROL_MIN_HEIGHT,
                textTransform: "none",
                fontWeight: 600,
                maxWidth: 360,
                mx: "auto",
              }}
            >
              Go to Settings
            </Button>
          </Paper>
        </Box>
      )}

      {/* Controls */}
      <Box sx={{ display: "grid", gap: PAD }}>
        <SemanticSearchInput
          value={searchTerm}
          onChange={(v) => setSearchTerm(v)}
          setTouched={setTouched}
          minWords={5}
          showHintIfShort
        />

        <KeywordFilter selectedKeywords={keywords} onKeywordsChange={setKeywords} />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => setFiltersOpen(true)}
            startIcon={<FilterListOutlinedIcon fontSize="small" />}
            color="primary"
            variant="text"
            size="small"
            disableRipple
            disableFocusRipple
            sx={{
              px: 0,
              py: 0,
              height: "auto",
              minHeight: "auto",
              lineHeight: 1.5,
              fontWeight: 600,
              textTransform: "none",
              color: "primary.main",
              alignSelf: "flex-start",
              "& .MuiButton-startIcon": { mr: 1, ml: 0 },
              "&:hover": { backgroundColor: "transparent" },
              "&:active": { backgroundColor: "transparent" },
              "& .MuiTouchRipple-root": { display: "none" },
            }}
          >
            Advanced Filters
            {advancedFilters.length ? ` (${advancedFilters.length})` : ""}
          </Button>
        </Box>

        <Button
          variant="contained"
          onClick={() => onRunSearch(searchTerm)}
          disabled={!apiKeyPresent || loading || !searchTerm}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" sx={{ mr: -0.5 }} /> : null
          }
          sx={{
            height: CONTROL_MIN_HEIGHT,
            width: "100%",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? "Searching…" : "Search"}
        </Button>
      </Box>

      {/* Results area */}
      {loading ? (
        <Box sx={{ mt: PAD + 1 }}>
          <SkeletonList rows={6} />
        </Box>
      ) : hasResults ? (
        <Box sx={{ mt: PAD + 1 }}>
          <SearchResultsPanel
            foundPapers={results || []}
            handleClickReadPaper={onReadPaper}
            handleClickZoteroBtn={onAddToZotero}
          />
        </Box>
      ) : showEmpty ? (
        <Box sx={{ mt: PAD + 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 1.5,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                mx: "auto",
                mb: 1.5,
                display: "grid",
                placeItems: "center",
                color: "primary.main",
                bgcolor: (t) =>
                  t.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              }}
            >
              <ManageSearchOutlinedIcon />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              No Results
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Try a more descriptive query, add or remove keywords, or refine with advanced
              filters.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={() => setFiltersOpen(true)}
                startIcon={<FilterListOutlinedIcon />}
                sx={{ height: CONTROL_MIN_HEIGHT, textTransform: "none", fontWeight: 600 }}
              >
                Open Advanced Filters
              </Button>
              <Button
                variant="text"
                size="medium"
                onClick={() => onRunSearch(searchTerm)}
                disabled={!apiKeyPresent || !searchTerm}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Retry Search
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : null}

      <FiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={advancedFilters}
        onAdd={onAddFilter}
        onRemove={onRemoveFilter}
        onUpdate={onUpdateFilter}
      />
    </Box>
  );
}