import React, { useEffect } from "react";
import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Slider } from "@mui/material";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const AdvancedFilter = ({id, filterType, values, condition, closeFilter, updateAdvancedFilter}) => {
    const MIN = 1940;
    const MAX = new Date().getFullYear();
    const sliderValues = values.length === 2 ? values : [MIN, MAX];

    const handleFilterChange = (event) => {
        const newSelectedFilterType = event.target.value;
        updateAdvancedFilter(id, "filterType", newSelectedFilterType);
        updateAdvancedFilter(id, "values", []);
    }

    const handleConditionChange = (event) => {
        const newConditionValue = event.target.value;
        updateAdvancedFilter(id, "condition", newConditionValue);
    }

    const handleValuesChange = (_event, newInputValues) => {
        updateAdvancedFilter(id, "values", newInputValues);
    }

    // When user selects the publication year range slider, pass the default values to parent component, in case user doesn't adjust the slider
    useEffect( () => {
        if (filterType === 'publication_year_range'){
            updateAdvancedFilter(id, "values", [MIN, MAX]);
        }
    }, [filterType])

    return (
        <div style={{ display: 'flex'}}>
            <FormControl fullWidth sx={{ width: '40%', mr: 1 }}  >
                <InputLabel id="advanced-filter-label">Advanced Filter</InputLabel>
                <Select
                    labelId="advanced-filter-label"
                    id="advanced-filter"
                    value={filterType}
                    label="Advanced Filter"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">No Filter</MenuItem>
                    <MenuItem value="publication_year">Publication Year</MenuItem>
                    <MenuItem value="publication_year_range">Publication Year Range</MenuItem>
                    <MenuItem value="abstract_parsed">Abstract Parsed</MenuItem>
                    <MenuItem value="fullbody_parsed">Fullbody Parsed</MenuItem>
                </Select>
            </FormControl>

            {
                (
                    filterType === "abstract_parsed"
                    ||
                    filterType === "fullbody_parsed"
                )
                && (
                    <FormControl component="fieldset" fullWidth sx={{ width: '100%'}}>
                        <RadioGroup
                            aria-label="include-filter"
                            name="include-filter"
                            value={condition}
                            onChange={handleConditionChange}
                            row
                        >
                            <FormControlLabel value="true" control={<Radio />} label="True" />
                            <FormControlLabel value="false" control={<Radio />} label="False" />
                        </RadioGroup>
                    </FormControl>
                )
            }

            {
                (
                    filterType === "publication_year"
                    ||
                    filterType === "publication_year_range"
                )
                && (
                    <FormControl fullWidth sx={{ width: '105px', mr: 1 }}>
                        <InputLabel id="condition-label">Condition</InputLabel>
                        <Select
                            labelId="condition-label"
                            id="condition"
                            value={condition}
                            label="Condition"
                            onChange={handleConditionChange}
                        >
                            <MenuItem value="true">IS</MenuItem>
                            <MenuItem value="false">IS NOT</MenuItem>
                        </Select>
                    </FormControl>
                )
            }

            {
                (
                    filterType === "publication_year"
                    ||
                    filterType === "NEXT FILTER TYPE HERE"
                )
                && (
                    <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={values}
                        onChange={handleValuesChange}
                        clearIcon={false}
                        fullWidth
                        sx={{ width: '100%' }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
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
                                label="Values"
                                placeholder="Type and press Enter"
                            />
                        )}
                    />
                )
            }

            {
                filterType === "publication_year_range"
                && (
                    <Box sx={{ width: '100%', mr: 1, ml: 1, alignContent: 'center'}}>
                        <Slider
                            value={sliderValues}
                            onChange={handleValuesChange}
                            valueLabelDisplay="auto"
                            min={MIN}
                            max={MAX}
                            step={1}
                        />
                    </Box>
                )
            }

            <IconButton
                aria-label="Close Filter"
                size="small"
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%"
                }}
                onClick={() => closeFilter(id)}
            >
                <CloseIcon fontSize="inherit" />
            </IconButton>
        </div>
    )
}

export default AdvancedFilter;