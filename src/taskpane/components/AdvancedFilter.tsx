import React, { useState } from "react";
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Slider } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

const AdvancedFilter = ({ handleAdvancedFilterValueChange }) => {

    /* +++++++++++++++++++++++++++++++++++++++++++++++ Filter Selection ++++++++++++++++++++++++++++++++++++++++++++++ */

    const [selectedFilter, setSelectedFilter] = useState('');

    const selectFilter = (event) => {
        const newSelectedFilter = event.target.value;
        setSelectedFilter(newSelectedFilter);
        setRadioValue('true');
        setInputValues([]);

        // Special case: When user selects Publication Year Range filter and doesn't manually change the year range, we have to explicitly update the filter like so
        if (newSelectedFilter === 'PublicationDate.Year_RANGE'){
            handleRangeSliderChange(event, rangeSliderValues)
            return
        }

        handleAdvancedFilterValueChange(newSelectedFilter);
    };

    /* +++++++++++++++++++++++++++++++++++++++++++++++ Radio/Booleans +++++++++++++++++++++++++++++++++++++++++++++++ */

    const [radioValue, setRadioValue] = useState('true');

    const handleRadioChange = (event) => {
        const newRadioValue = event.target.value;
        setRadioValue(newRadioValue);

        // Determine prefix based on radio/boolean selection and appendix if input values are provided
        const prefix = newRadioValue === 'true' ? '' : '!';
        let appendix = inputValues.length > 0 ? ':' + inputValues.join('|') : '';

        // Special case: the range slider values are never null. So we explicitly check if this filter is the currently selected one, and then add those values to the appendix
        if (selectedFilter === 'PublicationDate.Year_RANGE'){
            appendix = rangeSliderValues.length > 0 ? ':' + rangeSliderValues.join('..') : '';
        }

        handleAdvancedFilterValueChange(prefix + selectedFilter + appendix);
    };


    /* +++++++++++++++++++++++++++++++++++++++++++++++++++ Chips +++++++++++++++++++++++++++++++++++++++++++++++++++ */

    const [inputValues, setInputValues] = useState<string[]>([]);

    const handleChipsChange = ( _event: React.SyntheticEvent, newInputValues: string[] ) => {
        setInputValues(newInputValues);

        // Determine prefix based on radio/boolean selection and appendix if input values are provided
        const prefix = radioValue === 'true' ? '' : '!';
        const appendix = newInputValues.length > 0 ? ':' + newInputValues.join('|') : '';

        handleAdvancedFilterValueChange(prefix + selectedFilter + appendix);
    };



    /* ++++++++++++++++++++++++++++++++++++++++++++++++ Range Slider ++++++++++++++++++++++++++++++++++++++++++++++++ */

    const currentYear = new Date().getFullYear();
    const [rangeSliderValues, setRangeSliderValues] = useState([2000, currentYear]);

    const handleRangeSliderChange = (_event, newRangeSliderValues) => {
        setRangeSliderValues(newRangeSliderValues);

        // Determine prefix based on radio/boolean selection and appendix if input values are provided
        const prefix = radioValue === 'true' ? '' : '!';
        const appendix = newRangeSliderValues.length > 0 ? ':' + newRangeSliderValues.join('..') : '';

        // Both filters "Publication Year" and "Publication Year Range" are called "PublicationDate.Year" in the NLP backend.
        // To differentiate between them, I called the ladder "PublicationDate.Year_RANGE" in this frontend, which I now correct below for the backend
        const correctFilterName = "PublicationDate.Year"

        handleAdvancedFilterValueChange(prefix + correctFilterName + appendix);
    };

    return (
        <div style={{ display: 'flex'}}>
            <FormControl fullWidth sx={{ width: '25%', mr: 1 }}  >
                <InputLabel id="advanced-filter-label">Advanced Filter</InputLabel>
                <Select
                    labelId="advanced-filter-label"
                    id="advanced-filter"
                    value={selectedFilter}
                    label="Advanced Filter"
                    onChange={selectFilter}
                >
                    <MenuItem value="">No Filter</MenuItem>
                    <MenuItem value="PublicationDate.Year">Publication Year</MenuItem>
                    <MenuItem value="PublicationDate.Year_RANGE">Publication Year Range</MenuItem>
                    <MenuItem value="AvailableField:Content.Abstract_Parsed">Abstract Parsed</MenuItem>
                    <MenuItem value="AvailableField:Content.Fullbody_Parsed">Fullbody Parsed</MenuItem>
                </Select>
            </FormControl>

            {
                (
                    selectedFilter === "AvailableField:Content.Abstract_Parsed"
                    ||
                    selectedFilter === "AvailableField:Content.Fullbody_Parsed"
                )
                && (
                    <FormControl component="fieldset" fullWidth sx={{ width: '100%' }}>
                        <RadioGroup
                            aria-label="include-filter"
                            name="include-filter"
                            value={radioValue}
                            onChange={handleRadioChange}
                            row
                        >
                            <FormControlLabel value="true" control={<Radio />} label="True" />
                            <FormControlLabel value="false" control={<Radio />} label="False" />
                        </RadioGroup>
                    </FormControl>
                )
            }

            {
                selectedFilter === "PublicationDate.Year"
                && (
                    <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
                        <FormControl fullWidth sx={{ width: '105px' }}>
                            <InputLabel id="condition-label">Condition</InputLabel>
                            <Select
                                labelId="condition-label"
                                id="condition"
                                value={radioValue}
                                label="Condition"
                                onChange={handleRadioChange}
                            >
                                <MenuItem value="true">IS</MenuItem>
                                <MenuItem value="false">IS NOT</MenuItem>
                            </Select>
                        </FormControl>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={inputValues}
                            onChange={handleChipsChange}
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
                    </Box>
                )
            }

            {
                selectedFilter === "PublicationDate.Year_RANGE"
                && (
                    <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
                        <FormControl fullWidth sx={{ width: '105px' }}>
                            <InputLabel id="condition-label">Condition</InputLabel>
                            <Select
                                labelId="condition-label"
                                id="condition"
                                value={radioValue}
                                label="Condition"
                                onChange={handleRadioChange}
                            >
                                <MenuItem value="true">IS</MenuItem>
                                <MenuItem value="false">IS NOT</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{ width: '100%'}}>
                            <Slider
                                value={rangeSliderValues}
                                onChange={handleRangeSliderChange}
                                valueLabelDisplay="auto"
                                min={1940}
                                max={currentYear}
                                step={1}
                            />
                        </Box>
                    </Box>
                )
            }
        </div>
    );
};

export default AdvancedFilter;
