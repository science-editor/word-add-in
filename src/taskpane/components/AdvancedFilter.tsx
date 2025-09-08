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
const SPACING = 2; // 16px if your theme.spacing(2) = 16px

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

  // Consistent min height but allow growth
  const controlSx = {
    "& .MuiInputBase-root": { minHeight: 48 },
    "& .MuiInputBase-input": { fontSize: 14 },
    "& .MuiInputLabel-root": { fontSize: 14 },
  };

  return (
    <Box
      sx={{
        p: SPACING,
        borderRadius: 1,
        border: (t) => `1px dashed ${t.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        spacing={SPACING}
        alignItems="flex-start"
        flexWrap="wrap"
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

        {/* Boolean radio */}
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

        {/* Values */}
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
              sx={controlSx}
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
      </Stack>

      {/* Year range slider */}
      {filterType === "publication_year_range" && (
        <Box sx={{ mt: SPACING }}>
          <Slider
            value={sliderValues}
            onChange={handleValuesChange}
            valueLabelDisplay="auto"
            min={MIN}
            max={MAX}
            step={1}
          />
        </Box>
      )}
    </Box>
  );
};

export default AdvancedFilter;