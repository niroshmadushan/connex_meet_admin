import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Grid, MenuItem, Select, InputLabel, FormControl, Fade, InputAdornment, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add'; // Import Add Icon
import { styled } from '@mui/system';
import CountUp from 'react-countup'; // For animated counters
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // For chart rendering
import AddSessionForm from '../components/AddSessionForm'; // Import AddSessionForm component

// Sample session data
const sessionsData = [
    {
        id: 1,
        name: 'Session A',
        date: '2024-09-12',
        startTime: '09:00',
        endTime: '10:00',
        location: 'Room 101',
        visitorTeams: [
            {
                id: 'V001',
                companyName: 'XYZ Inc.',
                fullName: 'John Doe',
                email: 'john@xyz.com',
                contact: '123-456-7890',
            },
            {
                id: 'V002',
                companyName: 'ABC Corp.',
                fullName: 'Jane Smith',
                email: 'jane@abc.com',
                contact: '987-654-3210',
            }
        ],
        status: 'Ongoing',
    },
    {
        id: 2,
        name: 'Session B',
        date: '2024-09-15',
        startTime: '10:30',
        endTime: '11:30',
        location: 'Room 202',
        visitorTeams: [
            {
                id: 'V003',
                companyName: 'DEF Ltd.',
                fullName: 'Alex Johnson',
                email: 'alex@def.com',
                contact: '234-567-8901',
            }
        ],
        status: 'Upcoming',
    },
    {
        id: 3,
        name: 'Session C',
        date: '2024-09-10',
        startTime: '14:00',
        endTime: '15:00',
        location: 'Room 303',
        visitorTeams: [
            {
                id: 'V004',
                companyName: 'PQR Ltd.',
                fullName: 'Emily Brown',
                email: 'emily@pqr.com',
                contact: '345-678-9012',
            }
        ],
        status: 'Finished',
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

const Sessions = () => {
    const [open, setOpen] = useState(false);
    const [visitorModalOpen, setVisitorModalOpen] = useState(false); // For detailed visitor modal
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedVisitor, setSelectedVisitor] = useState(null); // Store selected visitor data
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState(sessionsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [visitorSearch, setVisitorSearch] = useState(''); // State for searching visitor teams
    const [newSessionModalOpen, setNewSessionModalOpen] = useState(false); // Modal state for Add Session Form

    // Calculate session statistics
    const totalSessions = sessionsData.length;
    const ongoingSessions = sessionsData.filter(session => session.status === 'Ongoing').length;
    const upcomingSessions = sessionsData.filter(session => session.status === 'Upcoming').length;
    const finishedSessions = sessionsData.filter(session => session.status === 'Finished').length;

    // Filter sessions by search term and status
    useEffect(() => {
        let filtered = sessionsData.filter((session) =>
            session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.visitorTeams.some((visitor) =>
                visitor.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        if (statusFilter) {
            filtered = filtered.filter((session) => session.status === statusFilter);
        }

        setFilteredSessions(filtered);
    }, [searchTerm, statusFilter]);

    // Handle row click to open the session modal
    const handleRowClick = (params) => {
        setSelectedSession(params.row);
        setFilteredVisitors(params.row.visitorTeams);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setVisitorModalOpen(false);
    };

    const handleAddSessionClick = () => {
        setNewSessionModalOpen(true);
    };

    const handleNewSessionClose = () => {
        setNewSessionModalOpen(false);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Session Name', width: 150 },
        { field: 'date', headerName: 'Date', width: 120 },
        { field: 'startTime', headerName: 'Start Time', width: 120 },
        { field: 'endTime', headerName: 'End Time', width: 120 },
        { field: 'location', headerName: 'Location', width: 150 },
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

    const chartData = {
        labels: ['Ongoing', 'Upcoming', 'Finished'],
        datasets: [
            {
                label: 'Sessions Status',
                data: [ongoingSessions, upcomingSessions, finishedSessions],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
        ],
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Page Title with "Add New Session" Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 4 }}>
                    Sessions Overview
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSessionClick}
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: '#007aff', ':hover': { backgroundColor: '#005bb5' } }}
                >
                    Add New Session
                </Button>
            </Box>

            {/* Animated Counters */}
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
                        <Typography variant="h6">Total Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007aff' }}>
                            <CountUp end={totalSessions} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
                        <Typography variant="h6">Upcoming Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                            <CountUp end={upcomingSessions} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
                        <Typography variant="h6">Ongoing Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                            <CountUp end={ongoingSessions} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
                        <Typography variant="h6">Finished Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                            <CountUp end={finishedSessions} duration={1.5} />
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            {/* Search Bar and Filter by Status */}
            <Box sx={{ marginBottom: 3, backgroundColor: '#fff', padding: 2, borderRadius: 2}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            label="Search by Session Name or Company"
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

            {/* Sessions DataGrid */}
            <DataGrid
                rows={filteredSessions}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={handleRowClick}
                sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}
            />

            {/* Session Status Chart */}
            <Box sx={{ marginTop: 4 }}>
                <Grid sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Sessions Status Overview
                    </Typography>
                    <Box sx={{ height: '250px', width: '100%' }}>
                        <Line data={chartData} />
                    </Box>
                </Grid>
            </Box>

            {/* Session Details Modal */}
            {selectedSession && (
                <Modal open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Fade in={open}>
                        <Paper sx={{ padding: 4, width: '90%', maxHeight: '80vh', overflowY: 'auto', maxWidth: '900px' }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Session Details
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography><strong>Session Name:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedSession.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>Date:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedSession.date}</Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                                Visitor Teams
                            </Typography>

                            {/* Search for visitor teams */}
                            <TextField
                                fullWidth
                                label="Search Visitor Teams"
                                variant="outlined"
                                value={visitorSearch}
                                onChange={(e) => setVisitorSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ marginBottom: 2 }}
                            />

                            {/* Visitor Teams Information Table */}
                            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Company Name</TableCell>
                                            <TableCell>Visitor Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone No</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredVisitors.map((visitor) => (
                                            <TableRow key={visitor.id}>
                                                <TableCell>{visitor.id}</TableCell>
                                                <TableCell>{visitor.companyName}</TableCell>
                                                <TableCell>{visitor.fullName}</TableCell>
                                                <TableCell>{visitor.email}</TableCell>
                                                <TableCell>{visitor.contact}</TableCell>
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

            {/* Add New Session Modal */}
            <Modal open={newSessionModalOpen} onClose={handleNewSessionClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Fade in={newSessionModalOpen}>
                    <Box sx={{ width: '600px', maxWidth: '100%', height: '800px', overflowY: 'scroll', backgroundColor: 'white', borderRadius: '10px' }}>
                        <AddSessionForm />
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default Sessions;
