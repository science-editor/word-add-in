import * as React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

import TutorialWindow from "./TutotrialWindow";
import PaperWindow from "./PaperWindow";
import SearchResultsPanel from "./SearchResultsPanel";
import KeywordFilter from "./KeywordFilter";

import { HeaderBar } from "./panel/HeaderBar";
import { SemanticSearchInput } from "./panel/SemanticSearchInput";
import { FiltersSection } from "./panel/FiltersSection";
import Onboarding from "./Onboarding";

import { useEndocApi } from "../hooks/useEndocApi";
import { AdvancedFilterState, Paper } from "../types";
import { initialAdvancedFilter } from "../utils/filters";

const ONBOARDING_DISMISSED_KEY = "endoc.onboardingDismissed";

/* ------------------------------ UI bits ------------------------------ */

const SearchButton = ({
  disabled,
  onClick,
  needsApiKey,
  label = "Search",
}: {
  disabled: boolean;
  onClick: () => void;
  needsApiKey: boolean;
  label?: string;
}) => {
  if (needsApiKey) {
    return (
      <Tooltip
        title={"Add a valid Endoc API Key in the settings section before performing searches."}
        componentsProps={{ tooltip: { sx: { fontSize: "1.2rem", lineHeight: 1.4 } } }}
      >
        <button className="search-btn" onClick={onClick} disabled>
          {label}
        </button>
      </Tooltip>
    );
  }
  return (
    <button className="search-btn" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

/* ------------------------------ Panel ------------------------------ */

const Panel = ({
  apiKey,
  handleApiKeyChange,
}: {
  apiKey: string;
  handleApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { search, loadPaperContent, addToZotero } = useEndocApi();

  // UI state
  const [showTutorialWindow, setShowTutorialWindow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState[]>([
    initialAdvancedFilter(),
  ]);

  // Onboarding state: shown only on very first run, not tied to API key anymore.
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  // Data state
  const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
  const [expandedPaper, setExpandedPaper] = useState<Paper | null>(null);
  const [loadingBar, setLoadingBar] = useState(false);

  // Derived validity for the semantic input
  const wordCount = useMemo(
    () => searchTerm.trim().split(/\s+/).filter(Boolean).length,
    [searchTerm]
  );
  const [touchedSemantic, setTouchedSemantic] = useState(false);
  const invalidSemantic = touchedSemantic && wordCount > 0 && wordCount < 5;

  // Events
  const onOpenSettings = useCallback(() => setShowTutorialWindow(true), []);
  const onCloseSettings = useCallback(
    /* accept reason if you wired it from TutorialWindow; we don’t need it here */
    (_reason?: "backdropClick" | "escapeKeyDown" | "iconButton" | "programmatic") => {
      setShowTutorialWindow(false);
      // NOTE: do NOT toggle onboarding here; onboarding is controlled only by Get Started.
    },
    []
  );

  const onAddFilter = useCallback(
    () => setAdvancedFilters((prev) => [...prev, initialAdvancedFilter()]),
    []
  );
  const onRemoveFilter = useCallback(
    (id: string) => setAdvancedFilters((prev) => prev.filter((f) => f.id !== id)),
    []
  );
  const onUpdateFilter = useCallback(
    (id: string, key: keyof AdvancedFilterState, val: any) =>
      setAdvancedFilters((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: val } : f))),
    []
  );

  const runSearch = useCallback(
    async (term: string) => {
      try {
        setFoundPapers(null);
        setLoadingBar(true);
        const papers = await search(term, keywords, advancedFilters);
        setFoundPapers(papers);
      } catch (err: any) {
        console.error("GraphQL Error:", err);
        toast.error(err?.message || "Failed to retrieve papers.", {
          icon: <span role="img" aria-label="warning">⚠️</span>,
        });
      } finally {
        setLoadingBar(false);
      }
    },
    [search, keywords, advancedFilters]
  );

  const onQuickSearch = useCallback(
    (docText: string) => {
      setSearchTerm(docText);
      runSearch(docText);
    },
    [runSearch]
  );

  const onReadPaper = useCallback(
    async (paper: Paper) => {
      try {
        const enriched = await loadPaperContent(paper);
        setExpandedPaper(enriched);
      } catch (err: any) {
        console.error("Error loading paper content:", err);
        toast.error("Failed to load paper content.", {
          icon: <span role="img" aria-label="warning">⚠️</span>,
        });
      }
    },
    [loadPaperContent]
  );

  const onAddToZotero = useCallback(
    async (paper: Paper) => {
      try {
        const result = await addToZotero(paper);
        if (result?.status === "success") {
          toast.success("Paper succesfully added to your Zotero Library.", {
            icon: <span role="img" aria-label="warning">✅️</span>,
          });
        } else {
          toast.error(
            "Paper could not be added because your Zotero Account ist not connected to your Endoc Account.",
            { icon: <span role="img" aria-label="warning">⚠️</span> }
          );
        }
      } catch {
        toast.error("Failed to add paper to Zotero.", {
          icon: <span role="img" aria-label="warning">⚠️</span>,
        });
      }
    },
    [addToZotero]
  );

  // Pull-to-search via localStorage bridge
  useEffect(() => {
    const handleStorageChange = () => {
      const newSearchTerm = localStorage.getItem("searchTerm") || "";
      if (newSearchTerm) {
        setSearchTerm(newSearchTerm);
        localStorage.removeItem("searchTerm");
        runSearch(newSearchTerm);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [runSearch]);

  /* ----------------------- Onboarding visibility -----------------------
     Show onboarding only until the user presses “Get started” once.
     Do NOT tie it to API key presence anymore to avoid the loop.
  ---------------------------------------------------------------------- */
  const showOnboarding = !onboardingDismissed;

  const handleGetStarted = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_DISMISSED_KEY, "1");
    } catch { /* ignore */ }
    setOnboardingDismissed(true);
    setShowTutorialWindow(true); // jump to setup dialog
  }, []);

  return (
    <>
      {/* Onboarding first-run screen */}
      {showOnboarding ? (
        <Onboarding onGetStarted={handleGetStarted} />
      ) : (
        <>
          {/* Normal app UI */}
          <div className="root">
            <HeaderBar
              apiKey={apiKey}
              onOpenSettings={onOpenSettings}
              onQuickSearch={onQuickSearch}
            />

            <div className="search-container">
              <SemanticSearchInput
                value={searchTerm}
                onChange={(v) => setSearchTerm(v)}
                invalid={invalidSemantic}
                setTouched={setTouchedSemantic}
              />

              <KeywordFilter selectedKeywords={keywords} onKeywordsChange={setKeywords} />

              <FiltersSection
                filters={advancedFilters}
                onAdd={onAddFilter}
                onClose={onRemoveFilter}
                onUpdate={onUpdateFilter}
              />

              <SearchButton
                needsApiKey={!apiKey.trim()}
                disabled={!apiKey.trim() || loadingBar || !searchTerm || invalidSemantic}
                onClick={() => runSearch(searchTerm)}
              />
            </div>

            {loadingBar && (
              <Box sx={{ width: "100%", mt: "15px" }}>
                <LinearProgress />
              </Box>
            )}

            <SearchResultsPanel
              foundPapers={foundPapers || []}
              handleClickReadPaper={onReadPaper}
              handleClickZoteroBtn={onAddToZotero}
            />
          </div>
        </>
      )}

      {/* Shared modals */}
      <TutorialWindow
        showTutorialWindow={showTutorialWindow}
        closeTutorialWindow={onCloseSettings}
        apiKey={apiKey}
        handleApiKeyChange={handleApiKeyChange}
      />
      <PaperWindow
        expandedPaper={expandedPaper}
        setExpandedPaper={setExpandedPaper}
        handleClickZoteroBtn={onAddToZotero}
      />
    </>
  );
};

export default Panel;