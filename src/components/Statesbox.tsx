import React from 'react';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
];

export default function StateDropdown({ value, setValue }) {
    return (
        <FormControl fullWidth>
        <InputLabel id="state-select-label">State</InputLabel>
            <Select
                fullWidth
                labelId="state-select-label"
                value={value}
                label="State"
                onChange={(e) => setValue(e.target.value)}
            >
    {states.map((state) => (
        <MenuItem key={state} value={state}>
        {state}
        </MenuItem>
    ))}
    </Select>
    </FormControl>
);
}
