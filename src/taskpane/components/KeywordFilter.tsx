// Libraries
import React, { useState, SyntheticEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";

// Local
import { KEYWORD_SUGGESTIONS } from "../schemas.js";

// Props: parent passes selected keywords and a callback to update them
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

export default function KeywordFilter({
                                          selectedKeywords,
                                          onKeywordsChange,
                                      }: ChipAutocompleteProps) {
    // suggestions & inputValue remain internal
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

    const handleInputChange = (
        _event: SyntheticEvent,
        newInputValue: string
    ) => {
        setInputValue(newInputValue);
        if (newInputValue) {
            fetchKeywordSuggestions({ variables: { keyword: newInputValue } });
        } else {
            setSuggestions([]);
        }
    };

    const handleValueChange = (
        _event: SyntheticEvent,
        newValue: string[]
    ) => {
        onKeywordsChange(newValue);
    };

    const handleEnter = (event) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            const newKeywords = Array.from(
                new Set([...selectedKeywords, inputValue.trim()])
            );
            onKeywordsChange(newKeywords);
            setInputValue('');
            setSuggestions([]);
        }
    }

    // Only open if suggestions exist
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
            renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                    <Chip
                        key={option}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                    />
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
