import * as React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import Tooltip from "@mui/material/Tooltip";

const CONTROL_MIN_HEIGHT = 48;
const CONTROL_FONT_SIZE = 14;

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
      size="medium"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => setTouched?.(true)}
      // keep label small & static (no jump)
      InputLabelProps={{ shrink: true }}
      // unified visual height + font size
      sx={{
        "& .MuiInputBase-root": { minHeight: CONTROL_MIN_HEIGHT, fontSize: CONTROL_FONT_SIZE },
        "& .MuiInputBase-input": { py: 1 }, // comfortable vertical padding
      }}
      helperText={
        isShort ? "Tip: ~5+ words can improve results (optional)." : undefined
      }
      FormHelperTextProps={{ sx: { mt: 0.5, lineHeight: 1.2 } }}
      InputProps={{
        endAdornment: isShort ? (
          <InputAdornment position="end">
            <Tooltip title="Longer queries often improve relevance, but it’s optional.">
              <TipsAndUpdatesOutlinedIcon fontSize="small" sx={{ opacity: 0.85 }} />
            </Tooltip>
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}