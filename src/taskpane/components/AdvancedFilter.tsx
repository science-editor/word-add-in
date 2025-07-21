import React, { useState } from "react";
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import TextField from "@mui/material/TextField";

const AdvancedFilter = ({ handleAdvancedFilterValueChange }) => {
    const [selectedFilter, setSelectedFilter] = useState('');
    const [radioValue, setRadioValue] = useState('true');
    const [inputValues, setInputValues] = useState('');

    const selectFilter = (event) => {
        const value = event.target.value;
        setSelectedFilter(value);
        setRadioValue('true');
        setInputValues('');

        handleAdvancedFilterValueChange(value);
    };

    const handleRadioChange = (event) => {
        const value = event.target.value;
        setRadioValue(value);

        // Determine prefix based on radio selection
        const prefix = value === 'true' ? '' : '!';
        const appendix = inputValues ? ':' + inputValues : '';

        handleAdvancedFilterValueChange(prefix + selectedFilter + appendix);
    };

    const handleInputChange = (event) => {
        const newInputValues = event.target.value;
        setInputValues(newInputValues);

        // Determine prefix based on radio selection
        const prefix = radioValue === 'true' ? '' : '!';
        const appendix = newInputValues ? ':' + newInputValues : '';

        handleAdvancedFilterValueChange(prefix + selectedFilter + appendix);
    }

    return (
        <>
            <FormControl fullWidth>
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
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <RadioGroup
                            aria-label="include-filter"
                            name="include-filter"
                            value={radioValue}
                            onChange={handleRadioChange}
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
                    <>
                        <FormControl>
                            <InputLabel id="condition-label">Advanced Filter</InputLabel>
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
                        <TextField
                            id="inputValues"
                            label="Values"
                            variant="outlined"
                            value={inputValues}
                            onChange={handleInputChange}
                        />
                    </>
                )
            }
        </>
    );
};

export default AdvancedFilter;
