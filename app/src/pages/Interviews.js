import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Grid, MenuItem, Select, InputLabel, FormControl, Fade, InputAdornment, Divider, Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

// Sample interview data
const interviewsData = [
    {
        id: 1,
        name: 'Interview A',
        date: '2024-09-12',
        startTime: '09:00',
        endTime: '10:00',
        department: 'Software Development',
        conductedBy: 'Alice Johnson',
        interviewees: [
            {
                id: 'I001',
                fullName: 'John Doe',
                email: 'john@doe.com',
                contact: '123-456-7890',
                startTime: '09:00',
                endTime: '09:30',
                imageUrl: '/path-to-image1.jpg'
            },
            {
                id: 'I002',
                fullName: 'Jane Smith',
                email: 'jane@smith.com',
                contact: '987-654-3210',
                startTime: '09:30',
                endTime: '10:00',
                imageUrl: '/path-to-image2.jpg'
            }
        ],
        status: 'Ongoing',
    },
    {
        id: 2,
        name: 'Interview B',
        date: '2024-09-15',
        startTime: '10:30',
        endTime: '11:30',
        department: 'Marketing',
        conductedBy: 'Bob Lee',
        interviewees: [
            {
                id: 'I003',
                fullName: 'Alex Johnson',
                email: 'alex@johnson.com',
                contact: '234-567-8901',
                startTime: '10:30',
                endTime: '11:00',
                imageUrl: '/path-to-image3.jpg'
            }
        ],
        status: 'Upcoming',
    },
];

// Custom styles for the status dot
const BlinkingDot = styled(FiberManualRecordIcon)(({ status }) => ({
    color: status === 'Ongoing' ? '#4caf50' : status === 'Finished' ? '#f44336' : '#ff9800',
    fontSize: '14px',
    animation: 'blinking 1.5s infinite',
    '@keyframes blinking': {
        '0%': { opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0 },
    },
}));

const Interviews = () => {
    const [open, setOpen] = useState(false);
    const [intervieweeModalOpen, setIntervieweeModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedInterviewee, setSelectedInterviewee] = useState(null);
    const [filteredInterviewees, setFilteredInterviewees] = useState([]);
    const [intervieweeSearch, setIntervieweeSearch] = useState('');
    const [filteredInterviews, setFilteredInterviews] = useState(interviewsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Calculate interview statistics
    const totalInterviews = interviewsData.length;
    const ongoingInterviews = interviewsData.filter(interview => interview.status === 'Ongoing').length;
    const upcomingInterviews = interviewsData.filter(interview => interview.status === 'Upcoming').length;
    const finishedInterviews = interviewsData.filter(interview => interview.status === 'Finished').length;

    // Handle row click to open the interview modal
    const handleRowClick = (params) => {
        setSelectedInterview(params.row);
        setFilteredInterviewees(params.row.interviewees);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedInterviewee(null);
        setIntervieweeModalOpen(false);
    };

    // Handle interviewee row click to open detailed interviewee modal
    const handleIntervieweeRowClick = (interviewee) => {
        setSelectedInterviewee(interviewee);
        setIntervieweeModalOpen(true);
    };

    // Filter interviews by search term and status
    useEffect(() => {
        let filtered = interviewsData.filter((interview) =>
            interview.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.conductedBy.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (statusFilter) {
            filtered = filtered.filter((interview) => interview.status === statusFilter);
        }

        setFilteredInterviews(filtered);
    }, [searchTerm, statusFilter]);

    // Handle search for interviewees inside the modal
    useEffect(() => {
        if (selectedInterview) {
            let filtered = selectedInterview.interviewees.filter(interviewee =>
                interviewee.fullName.toLowerCase().includes(intervieweeSearch.toLowerCase()) ||
                interviewee.email.toLowerCase().includes(intervieweeSearch.toLowerCase()) ||
                interviewee.contact.includes(intervieweeSearch)
            );
            setFilteredInterviewees(filtered);
        }
    }, [intervieweeSearch, selectedInterview]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Interview Name', width: 150 },
        { field: 'date', headerName: 'Date', width: 120 },
        { field: 'startTime', headerName: 'Start Time', width: 120, renderCell: (params) => formatTime(params.value) },
        { field: 'endTime', headerName: 'End Time', width: 120, renderCell: (params) => formatTime(params.value) },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'conductedBy', headerName: 'Conducted By', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BlinkingDot status={params.value} />
                    <Typography sx={{ marginLeft: 1 }}>{params.value}</Typography>
                </Box>
            ),
        },
    ];

    // Format time to AM/PM
    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const formattedHour = hour % 12 || 12;
        const period = hour >= 12 ? 'PM' : 'AM';
        return `${formattedHour}:${minute} ${period}`;
    };

    // Chart.js data for interview status
    const chartData = {
        labels: ['Ongoing', 'Upcoming', 'Finished'],
        datasets: ongoingInterviews || upcomingInterviews || finishedInterviews ? [
            {
                label: 'Interviews Status',
                data: [ongoingInterviews, upcomingInterviews, finishedInterviews],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
        ] : [{ label: 'No Data', data: [], backgroundColor: [] }]
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 4 }}>
                Interviews Overview
            </Typography>

            {/* Animated Counters */}
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
                        <Typography variant="h6">Total Interviews</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007aff' }}>
                            <CountUp end={totalInterviews} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
                        <Typography variant="h6">Upcoming Interviews</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                            <CountUp end={upcomingInterviews} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
                        <Typography variant="h6">Ongoing Interviews</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                            <CountUp end={ongoingInterviews} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
                        <Typography variant="h6">Finished Interviews</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                            <CountUp end={finishedInterviews} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* Search Bar and Filter by Status */}
            <Box sx={{ marginBottom: 3, backgroundColor: '#fff', padding: 2, borderRadius: 2,}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            label="Search by Interview Name or Conducted By"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Upcoming">Upcoming</MenuItem>
                                <MenuItem value="Finished">Finished</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Interviews DataGrid */}
            <DataGrid
                rows={filteredInterviews}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={handleRowClick}
                sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}
            />

            {/* Interview Status Chart */}
            <Box sx={{ marginTop: 4 }}>
                <Paper sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Interviews Status Overview
                    </Typography>
                    <Box sx={{ height: '250px', width: '100%' }}>
                        <Line data={chartData} />
                    </Box>
                </Paper>
            </Box>

            {/* Interview Details Modal */}
            {selectedInterview && (
                <Modal open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Fade in={open}>
                        <Paper sx={{ padding: 4, width: '90%', maxHeight: '80vh', overflowY: 'auto', maxWidth: '900px' }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Interview Details
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography><strong>Interview Name:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedInterview.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>Date:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedInterview.date}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>Department:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedInterview.department}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>Conducted By:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedInterview.conductedBy}</Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                                Interviewees
                            </Typography>

                            {/* Search for interviewees */}
                            <TextField
                                fullWidth
                                label="Search Interviewees"
                                variant="outlined"
                                value={intervieweeSearch}
                                onChange={(e) => setIntervieweeSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ marginBottom: 2 }}
                            />

                            {/* Interviewees Information Table */}
                            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Interviewee Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone No</TableCell>
                                            <TableCell>Start Time</TableCell>
                                            <TableCell>End Time</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredInterviewees.map((interviewee) => (
                                            <TableRow key={interviewee.id} onClick={() => handleIntervieweeRowClick(interviewee)} hover>
                                                <TableCell>{interviewee.id}</TableCell>
                                                <TableCell>{interviewee.fullName}</TableCell>
                                                <TableCell>{interviewee.email}</TableCell>
                                                <TableCell>{interviewee.contact}</TableCell>
                                                <TableCell>{interviewee.startTime}</TableCell>
                                                <TableCell>{interviewee.endTime}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                                <Button onClick={handleClose} variant="contained" color="primary">
                                    Close
                                </Button>
                            </Box>
                        </Paper>
                    </Fade>
                </Modal>
            )}

            {/* Detailed Interviewee Modal */}
            {selectedInterviewee && (
                <Modal open={intervieweeModalOpen} onClose={() => setIntervieweeModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Fade in={intervieweeModalOpen}>
                        <Paper sx={{ padding: 4, width: '90%', maxHeight: '80vh', overflowY: 'auto', maxWidth: '500px' }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Interviewee Information
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />

                            {/* Interviewee Information */}
                            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                                <Avatar alt={selectedInterviewee.fullName} src={selectedInterviewee.imageUrl} sx={{ width: 80, height: 80, margin: 'auto' }} />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography><strong>Full Name:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedInterviewee.fullName}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography><strong>Email:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedInterviewee.email}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography><strong>Phone No:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedInterviewee.contact}</Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                                <Button onClick={() => setIntervieweeModalOpen(false)} variant="contained" color="primary">
                                    Close
                                </Button>
                            </Box>
                        </Paper>
                    </Fade>
                </Modal>
            )}
        </Box>
    );
};

export default Interviews;
