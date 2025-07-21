import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const AdvancedFilter = ({handleAdvancedFilterValueChange} ) => {

    const [selectedFilter, setSelectedFilter] = React.useState('');

    const selectFilter = (event) => {
        // Update Selected Filter
        const newSelectedFilter = event.target.value;
        setSelectedFilter(newSelectedFilter);

        // Update state array in parent component
        handleAdvancedFilterValueChange(newSelectedFilter);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Advanced Filter</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFilter}
                label="Advanced Filter"
                onChange={selectFilter}
            >
                <MenuItem value={"AvailableField:Content.Abstract_Parsed"}>Abstract Parsed</MenuItem>
                <MenuItem value={""}>No Filter</MenuItem>
            </Select>
        </FormControl>
    )
}

export default AdvancedFilter;