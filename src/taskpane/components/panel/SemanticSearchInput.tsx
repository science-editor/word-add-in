// src/taskpane/components/panel/SemanticSearchInput.tsx
import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import Tooltip from "@mui/material/Tooltip";

export function SemanticSearchInput({
  value,
  onChange,
  setTouched,
  minWords = 5,
  showHintIfShort = true,
}: {
  value: string;
  onChange: (v: string) => void;
  setTouched?: (b: boolean) => void;
  minWords?: number;
  showHintIfShort?: boolean;
}) {
  const words = React.useMemo(() => value.trim().split(/\s+/).filter(Boolean), [value]);
  const isShort = showHintIfShort && words.length > 0 && words.length < minWords;

  return (
    <TextField
      id="semantic-search"
      label="Semantic search"
      placeholder="Type a natural-language query…"
      fullWidth
      size="small"               // ← unified size
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setTouched?.(true)}
      helperText={isShort ? "Tip: ~5+ words can improve results (optional)." : undefined}
      FormHelperTextProps={{ sx: { mt: 0.5, lineHeight: 1.25, fontSize: 12 } }}
      InputProps={{
        endAdornment: isShort ? (
          <InputAdornment position="end">
            <Tooltip title="Longer queries often improve relevance, but it’s optional.">
              <TipsAndUpdatesOutlinedIcon fontSize="small" sx={{ opacity: 0.85 }} />
            </Tooltip>
          </InputAdornment>
        ) : undefined,
      }}
      sx={{
        // Force consistent 40px input height like other controls
        "& .MuiInputBase-root": { height: 40 },
        "& .MuiInputBase-input": { fontSize: 14, pt: 0, pb: 0 },
        "& .MuiInputLabel-root": { fontSize: 14 },
      }}
    />
  );
}