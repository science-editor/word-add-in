// src/taskpane/components/AdvancedFilter.tsx
import React, { useEffect } from "react";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextField,
  Chip,
  IconButton,
  Autocomplete,
  Box,
  Stack,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";

const CONTROL_SIZE: "small" = "small";

/**
 * NOTE:
 * - No MUI Grid usage to avoid v1 vs v2 API type conflicts.
 * - Flex layout keeps all controls aligned, wrapped, and 40px tall.
 */
const AdvancedFilter = ({
  id,
  filterType,
  values,
  condition,
  closeFilter,
  updateAdvancedFilter,
}) => {
  const MIN = 1940;
  const MAX = new Date().getFullYear();
  const sliderValues = Array.isArray(values) && values.length === 2 ? values : [MIN, MAX];

  const handleFilterChange = (event: SelectChangeEvent) => {
    const newType = event.target.value as string;
    updateAdvancedFilter(id, "filterType", newType);
    updateAdvancedFilter(id, "values", []);
  };

  const handleConditionChange = (event: SelectChangeEvent) => {
    updateAdvancedFilter(id, "condition", event.target.value as string);
  };

  const handleValuesChange = (_event: any, newInputValues: any) => {
    updateAdvancedFilter(id, "values", newInputValues);
  };

  useEffect(() => {
    if (filterType === "publication_year_range") {
      updateAdvancedFilter(id, "values", [MIN, MAX]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const needsBool = filterType === "abstract_parsed" || filterType === "fullbody_parsed";
  const needsIsIsNot =
    filterType === "publication_year" ||
    filterType === "publication_year_range" ||
    filterType === "author_full_name" ||
    filterType === "author_given_name" ||
    filterType === "author_family_name" ||
    filterType === "doi";
  const needsIncludesExcludes = filterType === "title" || filterType === "venue";

  const needsValuesChips =
    filterType === "title" ||
    filterType === "venue" ||
    filterType === "publication_year" ||
    filterType === "author_full_name" ||
    filterType === "author_given_name" ||
    filterType === "author_family_name" ||
    filterType === "doi";

  // Enforce consistent 40px control height and 14px font across inputs/selects
  const controlSx = {
    "& .MuiInputBase-root": { height: 40 },
    "& .MuiInputBase-input": { fontSize: 14, pt: 0, pb: 0 },
    "& .MuiInputLabel-root": { fontSize: 14 },
  };

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: (t) => `1px dashed ${t.palette.divider}`,
      }}
    >
      {/* Row of controls, wraps cleanly on small widths */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {/* Type */}
        <Box sx={{ minWidth: 220, flex: "1 1 220px" }}>
          <FormControl fullWidth size={CONTROL_SIZE} sx={controlSx}>
            <InputLabel id={`filter-type-${id}`}>Advanced Filter</InputLabel>
            <Select
              labelId={`filter-type-${id}`}
              value={filterType}
              label="Advanced Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value="">No Filter</MenuItem>
              <MenuItem value="publication_year">Publication Year</MenuItem>
              <MenuItem value="publication_year_range">Publication Year Range</MenuItem>
              <MenuItem value="author_full_name">Author Full Name</MenuItem>
              <MenuItem value="author_given_name">Author Given Name</MenuItem>
              <MenuItem value="author_family_name">Author Family Name</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="venue">Venue</MenuItem>
              <MenuItem value="doi">DOI</MenuItem>
              <MenuItem value="abstract_parsed">Abstract Parsed</MenuItem>
              <MenuItem value="fullbody_parsed">Fullbody Parsed</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Condition */}
        {(needsIsIsNot || needsIncludesExcludes) && (
          <Box sx={{ minWidth: 160, flex: "0 1 160px" }}>
            <FormControl fullWidth size={CONTROL_SIZE} sx={controlSx}>
              <InputLabel id={`cond-${id}`}>Condition</InputLabel>
              <Select
                labelId={`cond-${id}`}
                value={condition}
                label="Condition"
                onChange={handleConditionChange}
              >
                {needsIsIsNot ? (
                  <>
                    <MenuItem value="true">IS</MenuItem>
                    <MenuItem value="false">IS NOT</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="true">INCLUDES</MenuItem>
                    <MenuItem value="false">EXCLUDES</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Boolean radio (True/False) */}
        {needsBool && (
          <Box sx={{ flex: "0 1 auto" }}>
            <FormControl size={CONTROL_SIZE}>
              <RadioGroup
                row
                name={`include-${id}`}
                value={condition}
                onChange={(e) =>
                  updateAdvancedFilter(id, "condition", (e.target as HTMLInputElement).value)
                }
              >
                <FormControlLabel value="true" control={<Radio size="small" />} label="True" />
                <FormControlLabel value="false" control={<Radio size="small" />} label="False" />
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        {/* Values (chips) */}
        {needsValuesChips && (
          <Box sx={{ minWidth: 220, flex: "1 1 300px" }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={values}
              onChange={handleValuesChange}
              clearIcon={false}
              fullWidth
              size={CONTROL_SIZE}
              sx={{ minWidth: 0, ...controlSx }}
              renderTags={(value, getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip key={option} label={option} variant="outlined" {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size={CONTROL_SIZE}
                  label="Values"
                  placeholder="Type and press Enter"
                />
              )}
            />
          </Box>
        )}

        {/* Remove button */}
        <Box sx={{ flex: "0 0 auto" }}>
          <IconButton
            aria-label="Remove filter"
            size="small"
            onClick={() => closeFilter(id)}
            sx={{ width: 32, height: 32, borderRadius: "50%" }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>

        {/* Year range slider (full width row) */}
        {filterType === "publication_year_range" && (
          <Box sx={{ flexBasis: "100%", mt: 0.5 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: "100%", px: 1 }}>
                <Slider
                  value={sliderValues}
                  onChange={handleValuesChange}
                  valueLabelDisplay="auto"
                  min={MIN}
                  max={MAX}
                  step={1}
                />
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdvancedFilter;