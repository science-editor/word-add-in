// src/taskpane/components/KeywordFilter.tsx
import React, { useState, SyntheticEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { KEYWORD_SUGGESTIONS } from "../schemas.js";

interface ChipAutocompleteProps {
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}
interface KeywordSuggestionsData {
  keywordSuggestions: { status: string; message: string; response: string[] };
}
interface KeywordSuggestionsVars {
  keyword: string;
}

export default function KeywordFilter({
  selectedKeywords,
  onKeywordsChange,
}: ChipAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const [fetchKeywordSuggestions, { loading, error }] = useLazyQuery<
    KeywordSuggestionsData,
    KeywordSuggestionsVars
  >(KEYWORD_SUGGESTIONS, {
    fetchPolicy: "network-only",
    onCompleted: ({ keywordSuggestions }) => {
      setSuggestions(Array.from(new Set(keywordSuggestions.response)));
    },
    onError: (err) => console.error("Keyword suggestions error:", err),
  });

  const handleInputChange = (_e: SyntheticEvent, v: string) => {
    setInputValue(v);
    v ? fetchKeywordSuggestions({ variables: { keyword: v } }) : setSuggestions([]);
  };

  const handleValueChange = (_e: SyntheticEvent, v: string[]) => {
    onKeywordsChange(v);
  };

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const next = Array.from(new Set([...selectedKeywords, inputValue.trim()]));
      onKeywordsChange(next);
      setInputValue("");
      setSuggestions([]);
    }
  };

  const isOpen = Boolean(inputValue && suggestions.length > 0);

  return (
    <Autocomplete
      multiple
      id="keyword-filter"
      options={suggestions}
      value={selectedKeywords}
      onChange={handleValueChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      filterSelectedOptions
      loading={loading}
      open={isOpen}
      loadingText=""
      noOptionsText=""
      popupIcon={null}
      size="small"          // ← unified size
      fullWidth
      sx={{
        minWidth: 0,
        "& .MuiInputBase-root": { height: 40 },         // same height
        "& .MuiInputBase-input": { fontSize: 14, pt: 0, pb: 0 },
        "& .MuiInputLabel-root": { fontSize: 14 },
      }}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip key={option} variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          label="Keyword Filter"
          placeholder={selectedKeywords.length > 0 ? "" : "Constrain your search with keywords"}
          error={!!error}
          helperText={error ? error.message : ""}
          onKeyDown={handleEnter}
        />
      )}
    />
  );
}