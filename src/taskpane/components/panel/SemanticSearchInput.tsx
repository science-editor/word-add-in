import * as React from "react";
import TextField from "@mui/material/TextField";

export function SemanticSearchInput({
  value,
  onChange,
  invalid,
  setTouched,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  setTouched: (b: boolean) => void;
}) {
  return (
    <TextField
      variant="outlined"
      label="Semantic Search"
      placeholder="Semantic discovery - Your text will be used to rank the filtered papers"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setTouched(true)}
      size="small"
      fullWidth
      error={invalid}
      helperText={invalid ? "Provide at least 5 terms" : ""}
    />
  );
}