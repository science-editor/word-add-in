// src/taskpane/components/discover/DiscoverScreen.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { SemanticSearchInput } from "../panel/SemanticSearchInput";
import KeywordFilter from "../KeywordFilter";
import SearchResultsPanel from "../SearchResultsPanel";
import { AdvancedFilterState, Paper } from "../../types";
import { SkeletonList } from "./SkeletonList";
import { FiltersDrawer, FiltersLauncher } from "./FiltersDrawer";

const PAD = 2; // 16px if theme.spacing(2)=16
const CONTROL_MIN_HEIGHT = 48; // unify perceived control height

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
              color="inherit"
              size="medium"
              fullWidth
              onClick={goToSettings}
              sx={{ minHeight: CONTROL_MIN_HEIGHT, textTransform: "none", fontWeight: 600 }}
            >
              Go to Settings
            </Button>
          </Box>
        </Alert>
      )}

      {/* Search input + controls (gap equals outer padding for consistency) */}
      <Box sx={{ display: "grid", gap: PAD }}>
        <SemanticSearchInput
          value={searchTerm}
          onChange={(v) => setSearchTerm(v)}
          setTouched={setTouched}
          minWords={5}
          showHintIfShort
        />

        <KeywordFilter selectedKeywords={keywords} onKeywordsChange={setKeywords} />

        {/* Compact entry for advanced filters */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <FiltersLauncher count={advancedFilters.length} onOpen={() => setFiltersOpen(true)} />
        </Box>

        {/* Full-width search button with inline spinner */}
        <Button
          variant="contained"
          size="medium"
          onClick={() => onRunSearch(searchTerm)}
          disabled={!apiKeyPresent || loading || !searchTerm}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" sx={{ mr: -0.5 }} /> : null
          }
          sx={{
            width: "100%",
            textTransform: "none",
            fontWeight: 600,
            minHeight: CONTROL_MIN_HEIGHT,
          }}
        >
          {loading ? "Searching…" : "Search"}
        </Button>
      </Box>

      {/* Loading state: skeleton cards */}
      {loading && (
        <Box sx={{ mt: PAD }}>
          <SkeletonList rows={6} />
        </Box>
      )}

      {!loading && results && (
        <Box sx={{ mt: PAD }}>
          <SearchResultsPanel
            foundPapers={results || []}
            handleClickReadPaper={onReadPaper}
            handleClickZoteroBtn={onAddToZotero}
          />
        </Box>
      )}

      {/* Side drawer for filters */}
      <FiltersDrawer
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