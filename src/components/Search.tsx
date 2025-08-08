import React, { useState } from 'react';
import {
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    InputLabel,
    FormControl
} from '@mui/material';
import Grid from "@mui/material/Grid";
import StateDropdown from "./Statesbox.tsx";
import Countrybox from "./countrybox.tsx";
import {Alert} from "@mui/material";
import uri from "../../private/Uri.tsx";


const CategoryFilterDropdown = ({ values, setValues }) => {
    const handleToggle = (key) => {
        setValues({ ...values, [key]: !values[key] });
    };

    const labels = {
        democratic: 'Democratic',
        sudbury: 'Sudbury',
        hsCoOp: 'Homeschool Co-Op',
        montessori: 'Montessori',
        vcfirm: 'Educational VC Firm',
        consulting: 'Consulting',
        public: 'Public',
        slidingscale: 'Sliding Scale Tuition',
        sas: 'Started By A School Starter',
        alc: 'ALC',
        AEROMember: 'AERO Member',
        online: 'Online',
        inPerson: 'In Person',
        college: 'College/University',
        highSchool: 'High School',
        middle: 'Middle School',
        elementary: 'Elementary',
        accredited: 'Accredited',
        scholaships: 'Scholaships',
        hsHybrid: 'Homeschool Hybrid Options',
        nature: 'Nature-Based',
    };

    return (
        <FormControl fullWidth>
            <InputLabel>Select Categories</InputLabel>
            <Select
                fullWidth
                multiple
                value={Object.keys(values).filter((key) => values[key])}
                renderValue={(selected) => selected.map((key) => labels[key]).join(', ')}
                label="Select Categories"
            >
                {Object.keys(labels).map((key) => (
                    <MenuItem key={key} value={key} onClick={() => handleToggle(key)}>
                        <Checkbox checked={values[key]} />
                        <ListItemText primary={labels[key]} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default function Search() {
    const [categoryValues, setCategoryValues] = useState({
        democratic: false,
        sudbury: false,
        hsCoOp: false,
        montessori: false,
        vcfirm: false,
        consulting: false,
        public: false,
        slidingscale: false,
        sas: false,
        alc: false,
        AEROMember: false,
        online: false,
        inPerson: false,
        college: false,
        highSchool: false,
        middle: false,
        elementary: false,
        accredited: false,
        scholarships: false,
        hsHybrid: false,
        nature: false,
    });
    const [attendanceRequired, setAttendanceRequired] = useState("");
    const [results, setResults] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function searchData() {
        const searchOptions = {
            ...categoryValues,
            state: selectedState,
            attendanceRequired: attendanceRequired === "" ? null : attendanceRequired === "true",
            country: selectedCountry
        };
        fetch(uri(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(searchOptions),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.error || "Network response was not ok");
                    });
                }
                return response.json();
            })
            .then((data) => {
                const parsedBody = JSON.parse(data.body);

                if (parsedBody.error) {
                    setErrorMessage(parsedBody.error);
                    setResults([]);
                    return;
                }

                if (!Array.isArray(parsedBody)) {
                    throw new Error("Unexpected response format");
                }

                setErrorMessage("");

                const sortedData = parsedBody.sort((a, b) => Number(b.active_member) - Number(a.active_member));
                setResults(sortedData);
            })
            .catch((error) => {
                setErrorMessage(error.message || "Fetch error");
                setResults([]);
            });

    }

    return (
        <div className="App">

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {errorMessage && (
                <Alert severity="error"
                       style={{ width: 800, justifyContent: "center"}}
                       variant={"filled"} sx={{ my: 2 }}
                        onClose={() => setErrorMessage("")}
                >
                    {errorMessage}
                </Alert>
            )}
            </div>

            <Grid container={true} spacing={2} justifyContent={"center"} direction="columns"
                  sx={{ width: "100%", maxWidth: 800, margin: "0 auto", flexWrap: "wrap" }}
            >
                <Grid item xs={12} md={4} sx={{ flex: 1, minWidth: 0 }}>
                    <CategoryFilterDropdown values={categoryValues} setValues={setCategoryValues}/>
                </Grid>

                <Grid item sx={{ flex: 1, minWidth: 0 }} xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Attendance Required</InputLabel>
                        <Select
                            fullWidth
                            value={attendanceRequired}
                            onChange={(e) => setAttendanceRequired(e.target.value)}
                            label="Attendance Required"
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sx={{ flex: 1, minWidth: 0 }} xs={12} md={4}>
                    <StateDropdown value={selectedState} setValue={setSelectedState} />
                </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center" sx={{ width: "100%", maxWidth: 800, margin: "1rem auto 0" }}>
                <Grid item xs={12} sx={{ flex: 1, minWidth: 0 }}>
                    <Countrybox value={selectedCountry} setValue={setSelectedCountry} />
                </Grid>
            </Grid>

            <Grid container spacing={2} justifyContent="center" sx={{ width: "100%", maxWidth: 800, margin: "1rem auto 0" }}>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={searchData} fullWidth>
                        Search
                    </Button>
                </Grid>
            </Grid>


            <Grid container={true} spacing={2} sx={{ width: "100%", mt: 2 }} justifyContent="center">
                <Grid item xs={12} md={10}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="results table">
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>Name</b></TableCell>
                                    <TableCell align="right"><b>Website</b></TableCell>
                                    <TableCell align="right"><b>Address</b></TableCell>
                                    <TableCell align="right"><b>Phone Number</b></TableCell>
                                    <TableCell align="right"><b>Email</b></TableCell>
                                    <TableCell align="right"><b>Tuition</b></TableCell>
                                    <TableCell align="right"><b>Attendance Required</b></TableCell>
                                    <TableCell align="right"><b>Scholarships?</b></TableCell>
                                    <TableCell align="right"><b>Categories</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((row) => (
                                    <TableRow key={row.name} sx={{ backgroundColor: row.active_member ? "lightblue" : "white"}}>
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell align="right">
                                            <a href={row.website} target="_blank" rel="noopener noreferrer">
                                                {row.website}
                                            </a>
                                        </TableCell>
                                        <TableCell align="right">{row.address}, {row.city}, {row.state}, {row.postCode}, {row.country}</TableCell>
                                        <TableCell align="right">{row.phone}</TableCell>
                                        <TableCell align="right">
                                            <a href={`mailto:${row.email}`}>
                                                {row.email}
                                            </a>
                                        </TableCell>
                                        <TableCell align="right">${row.tMin} - ${row.tMax}</TableCell>
                                        <TableCell align="right"> {row.attendanceRequired ? "Yes" : "No"}</TableCell>
                                        <TableCell align="right"> {row.scholaships === "Unknown" ? "Unknown" : row.scholaships ? "Yes" : "No"}</TableCell>
                                        <TableCell align="right">{row.categories.join(", ")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

        </div>
    );
}
