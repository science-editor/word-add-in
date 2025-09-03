// src/taskpane/components/discover/DiscoverScreen.tsx
import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";

import { SemanticSearchInput } from "../panel/SemanticSearchInput";
import KeywordFilter from "../KeywordFilter";
import SearchResultsPanel from "../SearchResultsPanel";
import { AdvancedFilterState, Paper } from "../../types";
import { SkeletonList } from "./SkeletonList";
import { FiltersDrawer, FiltersLauncher } from "./FiltersDrawer";

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
    <Box sx={{ p: 2, mx: "auto" }}>
      {!apiKeyPresent && (
        <Alert
          severity="warning"
          sx={{ mb: 2, "& .MuiAlert-message": { width: "100%" } }}
          action={
            <Button color="inherit" size="small" onClick={goToSettings}>
              Go to Settings
            </Button>
          }
        >
          You need to connect Endoc with an API key before searching.
        </Alert>
      )}

      {/* Search input + controls */}
      <Box sx={{ display: "grid", gap: 2 }}>
        <SemanticSearchInput
          value={searchTerm}
          onChange={(v) => setSearchTerm(v)}
          setTouched={setTouched}
          minWords={5}
          showHintIfShort
        />

        <KeywordFilter selectedKeywords={keywords} onKeywordsChange={setKeywords} />

        {/* Filters launcher just above the Search button; badge sits next to text */}
        <FiltersLauncher count={advancedFilters.length} onOpen={() => setFiltersOpen(true)} />

        {/* Full-width Search button, but same control height */}
        <Button
          variant="contained"
          size="small"
          onClick={() => onRunSearch(searchTerm)}
          disabled={!apiKeyPresent || loading || !searchTerm}
          sx={{
            height: 40,                 // ← same height as inputs
            width: "100%",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <>
          <Box sx={{ width: "100%", mt: 3 }}>
            <LinearProgress />
          </Box>
          <Divider sx={{ my: 3 }} />
          <SkeletonList rows={6} />
        </>
      )}

      {!loading && results && (
        <Box sx={{ mt: 3 }}>
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