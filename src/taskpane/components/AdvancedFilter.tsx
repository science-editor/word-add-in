import React, { useState } from "react";
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

const AdvancedFilter = ({ handleAdvancedFilterValueChange }) => {
    const [selectedFilter, setSelectedFilter] = useState('');
    const [radioValue, setRadioValue] = useState('true');
    const [inputValues, setInputValues] = useState<string[]>([]);

    const selectFilter = (event) => {
        const value = event.target.value;
        setSelectedFilter(value);
        setRadioValue('true');
        setInputValues([]);

        handleAdvancedFilterValueChange(value);
    };

    const handleRadioChange = (event) => {
        const newRadioValue = event.target.value;
        setRadioValue(newRadioValue);

        // Determine prefix based on radio selection and appendix if input values are provided
        const prefix = newRadioValue === 'true' ? '' : '!';
        const appendix = inputValues.length > 0 ? ':' + inputValues.join('|') : '';

        handleAdvancedFilterValueChange(prefix + selectedFilter + appendix);
    };


    const handleTagsChange = ( _event: React.SyntheticEvent, newTags: string[] ) => {
        setInputValues(newTags);

        // Determine prefix based on radio selection and appendix if input values are provided
        const prefix = radioValue === 'true' ? '' : '!';
        const appendix = newTags.length > 0 ? ':' + newTags.join('|') : '';

        handleAdvancedFilterValueChange(prefix + selectedFilter + appendix);
    };

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
                            onChange={handleTagsChange}
                            clearIcon={false}
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
                                    label="Add Tags"
                                    placeholder="Type and press Enter"
                                />
                            )}
                        />
                    </>
                )
            }
        </>
    );
};

export default AdvancedFilter;
