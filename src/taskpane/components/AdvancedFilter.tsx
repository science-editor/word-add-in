import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  Chip,
  Slider,
  IconButton,
  Autocomplete,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  id: string;
  filterType: string;
  values: any[];
  condition: string;
  closeFilter: (id: string) => void;
  updateAdvancedFilter: (id: string, key: string, val: any) => void;
};

const PAD = 2; 
const CONTROL_MIN_HEIGHT = 48;
const MIN_YEAR = 1940;
const MAX_YEAR = new Date().getFullYear();

export default function AdvancedFilter({
  id,
  filterType,
  values,
  condition,
  closeFilter,
  updateAdvancedFilter,
}: Props) {
  const range =
    Array.isArray(values) && values.length === 2
      ? (values as number[])
      : [MIN_YEAR, MAX_YEAR];

  const singleYear =
    Array.isArray(values) && typeof values[0] === "number"
      ? (values[0] as number)
      : MAX_YEAR;

  const onTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    updateAdvancedFilter(id, "filterType", next);
    if (next === "publication_year_range") {
      updateAdvancedFilter(id, "values", [MIN_YEAR, MAX_YEAR]);
    } else if (next === "publication_year") {
      updateAdvancedFilter(id, "values", [MAX_YEAR]);
    } else {
      updateAdvancedFilter(id, "values", []);
    }
  };

  const onConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdvancedFilter(id, "condition", e.target.value);
  };

  const onBooleanChange = (_e: React.ChangeEvent<HTMLInputElement>, val: string) => {
    updateAdvancedFilter(id, "condition", val);
  };

  const onValuesChipsChange = (_e: any, newVals: string[]) => {
    updateAdvancedFilter(id, "values", newVals);
  };

  const onRangeChange = (_: Event, newVal: number | number[]) => {
    if (Array.isArray(newVal)) updateAdvancedFilter(id, "values", newVal);
  };

  const onSingleYearChange = (_: Event, newVal: number | number[]) => {
    if (!Array.isArray(newVal)) updateAdvancedFilter(id, "values", [newVal]);
  };

  const needsBool =
    filterType === "abstract_parsed" || filterType === "fullbody_parsed";

  const needsIsIsNot =
    filterType === "publication_year" ||
    filterType === "publication_year_range" ||
    filterType === "author_full_name" ||
    filterType === "author_given_name" ||
    filterType === "author_family_name" ||
    filterType === "doi";

  const needsIncludesExcludes =
    filterType === "title" || filterType === "venue";

  const showChips =
    filterType === "title" ||
    filterType === "venue" ||
    filterType === "author_full_name" ||
    filterType === "author_given_name" ||
    filterType === "author_family_name" ||
    filterType === "doi";

  return (
    <Box
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 1.25,
        p: 1.5,
        backgroundColor: (t) => t.palette.background.paper,
        width: "100%",
      }}
    >
      <Stack spacing={PAD}>
        {/* Row 1: Filter type select + close button */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            select
            SelectProps={{ native: true }}
            label="Filter By"
            value={filterType}
            onChange={onTypeChange}
            size="medium"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiInputBase-root": { minHeight: CONTROL_MIN_HEIGHT } }}
          >
            <option value=""></option>
            <option value="publication_year">Publication Year</option>
            <option value="publication_year_range">Publication Year Range</option>
            <option value="author_full_name">Author Full Name</option>
            <option value="author_given_name">Author Given Name</option>
            <option value="author_family_name">Author Family Name</option>
            <option value="title">Title</option>
            <option value="venue">Venue</option>
            <option value="doi">DOI</option>
            <option value="abstract_parsed">Abstract Parsed</option>
            <option value="fullbody_parsed">Fullbody Parsed</option>
          </TextField>

          <IconButton
            aria-label="Remove filter"
            size="small"
            onClick={() => closeFilter(id)}
            sx={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>

        {/* Row 2: Condition */}
        {(needsIsIsNot || needsIncludesExcludes) && (
          <TextField
            select
            SelectProps={{ native: true }}
            label="Condition"
            value={condition}
            onChange={onConditionChange}
            size="medium"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiInputBase-root": { minHeight: CONTROL_MIN_HEIGHT } }}
          >
            <option value=""></option>
            {needsIsIsNot ? (
              <>
                <option value="true">IS</option>
                <option value="false">IS NOT</option>
              </>
            ) : (
              <>
                <option value="true">INCLUDES</option>
                <option value="false">EXCLUDES</option>
              </>
            )}
          </TextField>
        )}

        {needsBool && (
          <FormControl
            component="fieldset"
            sx={{
              minHeight: CONTROL_MIN_HEIGHT,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <RadioGroup row value={condition} onChange={onBooleanChange}>
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel value="false" control={<Radio />} label="False" />
            </RadioGroup>
          </FormControl>
        )}

        {/* Row 3: Values */}
        {showChips && (
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={Array.isArray(values) ? values : []}
            onChange={onValuesChipsChange}
            clearIcon={false}
            fullWidth
            renderTags={(vals: readonly string[], getTagProps) =>
              vals.map((option: string, index: number) => (
                <Chip
                  key={option}
                  label={option}
                  variant="outlined"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="medium"
                label="Values"
                placeholder="Value OR Values"
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiInputBase-root": { minHeight: CONTROL_MIN_HEIGHT } }}
              />
            )}
          />
        )}

        {/* Row 4: Sliders */}
        {filterType === "publication_year" && (
          <Box sx={{ px: 1 }}>
            <Slider
              value={singleYear}
              onChange={onSingleYearChange}
              valueLabelDisplay="auto"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
            />
          </Box>
        )}

        {filterType === "publication_year_range" && (
          <Box sx={{ px: 1 }}>
            <Slider
              value={range}
              onChange={onRangeChange}
              valueLabelDisplay="auto"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}