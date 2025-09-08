import * as React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import { TabbedShell, TabKey } from "./shell/TabbedShell";
import Onboarding from "./Onboarding";
import { DiscoverScreen } from "./discover/DiscoverScreen";
import { SettingsScreen } from "./settings/SettingsScreen";
import PaperWindow from "./PaperWindow";

import { useEndocApi } from "../hooks/useEndocApi";
import { AdvancedFilterState, Paper } from "../types";
import { initialAdvancedFilter } from "../utils/filters";

/** Match App.tsx logic for GraphQL URL */
const isLocalDev =
  typeof window !== "undefined" && /^https:\/\/localhost:\d+$/i.test(window.location.origin);
const GRAPHQL_URL = isLocalDev
  ? "https://localhost:3001/proxy"
  : "https://endoc.ethz.ch/graphql";

const ONBOARDING_DISMISSED_KEY = "endoc.onboardingDismissed";

export default function Panel({
  apiKey,
  handleApiKeyChange,
}: {
  apiKey: string;
  handleApiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { search, loadPaperContent, addToZotero } = useEndocApi();

  // NAV
  const [tab, setTab] = useState<TabKey>("discover");

  // Onboarding
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const showOnboarding = !onboardingDismissed && !apiKey?.trim();

  const dismissOnboarding = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_DISMISSED_KEY, "1");
    } catch {}
    setOnboardingDismissed(true);
    setTab("settings"); // guide straight to Settings
  }, []);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState[]>([
    initialAdvancedFilter(),
  ]);
  const [foundPapers, setFoundPapers] = useState<Paper[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedPaper, setExpandedPaper] = useState<Paper | null>(null);

  // Semantic input validity
  const wordCount = useMemo(
    () => searchTerm.trim().split(/\s+/).filter(Boolean).length,
    [searchTerm]
  );
  const [touchedSemantic, setTouchedSemantic] = useState(false);

  // Filter handlers
  const onAddFilter = useCallback(() => {
    setAdvancedFilters((prev) => [...prev, initialAdvancedFilter()]);
  }, []);
  const onRemoveFilter = useCallback((id: string) => {
    setAdvancedFilters((prev) => prev.filter((f) => f.id !== id));
  }, []);
  const onUpdateFilter = useCallback(
    (id: string, key: keyof AdvancedFilterState, val: any) => {
      setAdvancedFilters((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: val } : f)));
    },
    []
  );

  // Run search
  const onRunSearch = useCallback(
    async (term: string) => {
      setFoundPapers(null);
      setLoading(true);
      try {
        const papers = await search(term, keywords, advancedFilters);
        setFoundPapers(papers);
      } catch (err: any) {
        console.error(err);
        toast.error(err?.message || "Failed to retrieve papers.");
      } finally {
        setLoading(false);
      }
    },
    [search, keywords, advancedFilters]
  );

  // Read paper
  const onReadPaper = useCallback(
    async (paper: Paper) => {
      try {
        const enriched = await loadPaperContent(paper);
        setExpandedPaper(enriched);
      } catch {
        toast.error("Failed to load paper content.");
      }
    },
    [loadPaperContent]
  );

  // Zotero
  const onAddToZotero = useCallback(
    async (paper: Paper) => {
      try {
        const result = await addToZotero(paper);
        if (result?.status === "success") {
          toast.success("Added to Zotero.");
        } else {
          toast.error("Zotero not connected in Endoc account.");
        }
      } catch {
        toast.error("Failed to add to Zotero.");
      }
    },
    [addToZotero]
  );

  // Validate key (only from Settings)
  const [checkBusy, setCheckBusy] = useState(false);
  const [keyProblem, setKeyProblem] = useState<string | null>(null);

  const validateKey = useCallback(async () => {
    if (!apiKey?.trim()) {
      setKeyProblem("API key is required.");
      return;
    }
    setCheckBusy(true);
    setKeyProblem(null);
    try {
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ query: "query { __typename }" }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }
      toast.success("Endoc connected.");
    } catch (e: any) {
      console.error("Key validation failed:", e);
      setKeyProblem(e?.message || "Validation failed.");
    } finally {
      setCheckBusy(false);
    }
  }, [apiKey]);

  // Storage bridge remains
  useEffect(() => {
    const handleStorageChange = () => {
      const newSearchTerm = localStorage.getItem("searchTerm") || "";
      if (newSearchTerm) {
        setSearchTerm(newSearchTerm);
        localStorage.removeItem("searchTerm");
        onRunSearch(newSearchTerm);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [onRunSearch]);

  // Onboarding first
  if (showOnboarding) {
    return <Onboarding onGetStarted={dismissOnboarding} />;
  }

  const apiKeyPresent = !!apiKey?.trim();

  return (
    <>
      <TabbedShell value={tab} onChange={setTab}>
        {tab === "discover" && (
          <DiscoverScreen
            apiKeyPresent={apiKeyPresent}
            goToSettings={() => setTab("settings")}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setTouched={setTouchedSemantic}
            keywords={keywords}
            setKeywords={setKeywords}
            advancedFilters={advancedFilters}
            onAddFilter={onAddFilter}
            onRemoveFilter={onRemoveFilter}
            onUpdateFilter={onUpdateFilter}
            onRunSearch={onRunSearch}
            loading={loading}
            results={foundPapers}
            onReadPaper={onReadPaper}
            onAddToZotero={onAddToZotero}
          />
        )}
        
        {tab === "settings" && (
          <SettingsScreen
            apiKey={apiKey}
            setApiKey={(v) => handleApiKeyChange({ target: { value: v } } as any)}
            onValidate={validateKey}
            busy={checkBusy}
            problem={keyProblem}
            onResetOnboarding={() => {
              localStorage.removeItem(ONBOARDING_DISMISSED_KEY);
              toast.info("Onboarding will show next time you open the add-in.");
            }}
          />
        )}
      </TabbedShell>

      <PaperWindow
        expandedPaper={expandedPaper}
        setExpandedPaper={setExpandedPaper}
        handleClickZoteroBtn={onAddToZotero}
      />
    </>
  );
}