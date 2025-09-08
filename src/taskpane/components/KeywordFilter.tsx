// Libraries
import React, { useState, SyntheticEvent, KeyboardEvent } from "react";
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

const CONTROL_MIN_HEIGHT = 48; // match all inputs/buttons

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

  const handleEnter = (event: KeyboardEvent) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const newKeywords = Array.from(new Set([...selectedKeywords, inputValue.trim()]));
      onKeywordsChange(newKeywords);
      setInputValue("");
      setSuggestions([]);
      event.preventDefault();
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
      size="small"
      fullWidth
      sx={{
        minWidth: 0,
        // Make the control line up in height with text fields/buttons,
        // but allow it to get taller when chips wrap.
        "& .MuiInputBase-root": {
          minHeight: CONTROL_MIN_HEIGHT,
          alignItems: "center",
        },
        // Ensure the chips don’t get clipped when they wrap.
        "& .MuiAutocomplete-inputRoot": {
          paddingTop: 0.5,
          paddingBottom: 0.5,
        },
        "& .MuiChip-root": {
          margin: "2px",
        },
      }}
      renderTags={(value, getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip key={option} variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          label="Keyword filter"
          placeholder={selectedKeywords.length > 0 ? "" : "Constrain your search with keywords"}
          error={!!error}
          helperText={error ? error.message : ""}
          onKeyDown={handleEnter}
          // keep label/input font sizes aligned with other fields
          InputLabelProps={{ sx: { fontSize: 14 } }}
          inputProps={{ ...params.inputProps, "aria-label": "Keyword filter" }}
        />
      )}
    />
  );
}