// Libraries
import React, { useState, SyntheticEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

// Local
import { KEYWORD_SUGGESTIONS } from "../schemas.js";

interface ChipAutocompleteProps {
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

interface KeywordSuggestionsData {
  keywordSuggestions: {
    status: string;
    message: string;
    response: string[];
  };
}

interface KeywordSuggestionsVars {
  keyword: string;
}

const CONTROL_MIN_HEIGHT = 48;
const CONTROL_FONT_SIZE = 14;

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
      const options = Array.from(new Set(keywordSuggestions.response));
      setSuggestions(options);
    },
    onError: (err) => {
      console.error("Keyword suggestions error:", err);
    },
  });

  const handleInputChange = (_event: SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    if (newInputValue) {
      fetchKeywordSuggestions({ variables: { keyword: newInputValue } });
    } else {
      setSuggestions([]);
    }
  };

  const handleValueChange = (_event: SyntheticEvent, newValue: string[]) => {
    onKeywordsChange(newValue);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const newKeywords = Array.from(new Set([...selectedKeywords, inputValue.trim()]));
      onKeywordsChange(newKeywords);
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
      fullWidth
      // Unify base height & font-size; chips will expand when present (that’s OK)
      sx={{
        "& .MuiInputBase-root": { minHeight: CONTROL_MIN_HEIGHT, fontSize: CONTROL_FONT_SIZE },
        "& .MuiInputBase-input": { py: 1 },
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
          size="medium"
          label="Keyword Filter"
          placeholder={selectedKeywords.length > 0 ? "" : "Constrain your search with keywords"}
          // keep label small & static
          InputLabelProps={{ shrink: true }}
          error={!!error}
          helperText={error ? error.message : undefined}
          onKeyDown={handleEnter}
        />
      )}
    />
  );
}