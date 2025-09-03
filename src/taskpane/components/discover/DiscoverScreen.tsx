import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";

import { SemanticSearchInput } from "../panel/SemanticSearchInput";
import KeywordFilter from "../KeywordFilter";
import { FiltersSection } from "../panel/FiltersSection";
import SearchResultsPanel from "../SearchResultsPanel";
import { AdvancedFilterState, Paper } from "../../types";
import { SkeletonList } from "./SkeletonList";

export function DiscoverScreen({
  apiKeyPresent,
  goToSettings,
  searchTerm,
  setSearchTerm,
  invalidSemantic,
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
  invalidSemantic: boolean;
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
  return (
    <Box sx={{ p: 2 }}>
      {!apiKeyPresent && (
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            "& .MuiAlert-message": { width: "100%" },
          }}
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
          invalid={invalidSemantic}
          setTouched={setTouched}
        />

        <KeywordFilter selectedKeywords={keywords} onKeywordsChange={setKeywords} />

        <FiltersSection
          filters={advancedFilters}
          onAdd={onAddFilter}
          onClose={onRemoveFilter}
          onUpdate={onUpdateFilter}
        />

        <Button
          variant="contained"
          onClick={() => onRunSearch(searchTerm)}
          disabled={!apiKeyPresent || loading || !searchTerm || invalidSemantic}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Search
        </Button>
      </Box>

      {loading && (
        <>
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress />
          </Box>
          <Divider sx={{ my: 2 }} />
          <SkeletonList rows={6} />
        </>
      )}

      {!loading && results && (
        <Box sx={{ mt: 2 }}>
          <SearchResultsPanel
            foundPapers={results || []}
            handleClickReadPaper={onReadPaper}
            handleClickZoteroBtn={onAddToZotero}
          />
        </Box>
      )}
    </Box>
  );
}