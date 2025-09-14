// src/taskpane/components/discover/DiscoverScreen.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import { SemanticSearchInput } from "../panel/SemanticSearchInput";
import KeywordFilter from "../KeywordFilter";
import SearchResultsPanel from "../SearchResultsPanel";
import { AdvancedFilterState, Paper } from "../../types";
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
  results: Paper[] | null;

  onReadPaper: (p: Paper) => void;
  onAddToZotero: (p: Paper) => void;
}) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  return (
    <Box sx={{ p: PAD, maxWidth: 780, mx: "auto" }}>
      {!apiKeyPresent && (
        <Alert severity="warning" sx={{ mb: PAD, "& .MuiAlert-message": { width: "100%" } }}>
          You need to connect Endoc with an API key before searching.
          <Box sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              onClick={goToSettings}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Go to Settings
            </Button>
          </Box>
        </Alert>
      )}

      <Box sx={{ display: "grid", gap: PAD }}>
        <SemanticSearchInput
          value={searchTerm}
          onChange={(v) => setSearchTerm(v)}
          setTouched={setTouched}
          minWords={5}
          showHintIfShort
        />

        <KeywordFilter selectedKeywords={keywords} onKeywordsChange={setKeywords} />

        {/* Advanced filters launcher — truly minimal (no container height/shape) */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => setFiltersOpen(true)}
            startIcon={<FilterListOutlinedIcon fontSize="small" />}
            color="primary"
            variant="text"
            size="small"
            aria-label="Open advanced filters"
            disableRipple
            disableFocusRipple
            sx={{
              // Make it behave like inline text:
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
            Advanced filters
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
            width: "100%",
            textTransform: "none",
            fontWeight: 600
          }}
        >
          {loading ? "Searching…" : "Search"}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ mt: PAD + 1 }}>
          <SkeletonList rows={6} />
        </Box>
      ) : results ? (
        <Box sx={{ mt: PAD + 1 }}>
          <SearchResultsPanel
            foundPapers={results || []}
            handleClickReadPaper={onReadPaper}
            handleClickZoteroBtn={onAddToZotero}
          />
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