import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Grid, MenuItem, Select, InputLabel, FormControl, Fade, InputAdornment, Divider, Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import CountUp from 'react-countup'; // For animated counters
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // For chart rendering

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
                imageUrl: '/path-to-image1.jpg'
            },
            {
                id: 'V002',
                companyName: 'ABC Corp.',
                fullName: 'Jane Smith',
                email: 'jane@abc.com',
                contact: '987-654-3210',
                imageUrl: '/path-to-image2.jpg'
            },
            {
                id: 'V003',
                companyName: 'XYZ Inc.',
                fullName: 'John Doe',
                email: 'john@xyz.com',
                contact: '123-456-7890',
                imageUrl: '/path-to-image1.jpg'
            },
            {
                id: 'V004',
                companyName: 'ABC Corp.',
                fullName: 'Jane Smith',
                email: 'jane@abc.com',
                contact: '987-654-3210',
                imageUrl: '/path-to-image2.jpg'
            },
            {
                id: 'V005',
                companyName: 'XYZ Inc.',
                fullName: 'John Doe',
                email: 'john@xyz.com',
                contact: '123-456-7890',
                imageUrl: '/path-to-image1.jpg'
            },
            {
                id: 'V006',
                companyName: 'ABC Corp.',
                fullName: 'Jane Smith',
                email: 'jane@abc.com',
                contact: '987-654-3210',
                imageUrl: '/path-to-image2.jpg'
            },
            {
                id: 'V007',
                companyName: 'XYZ Inc.',
                fullName: 'John Doe',
                email: 'john@xyz.com',
                contact: '123-456-7890',
                imageUrl: '/path-to-image1.jpg'
            },
            {
                id: 'V008',
                companyName: 'ABC Corp.',
                fullName: 'Jane Smith',
                email: 'jane@abc.com',
                contact: '987-654-3210',
                imageUrl: '/path-to-image2.jpg'
            },
            {
                id: 'V009',
                companyName: 'XYZ Inc.',
                fullName: 'John Doe',
                email: 'john@xyz.com',
                contact: '123-456-7890',
                imageUrl: '/path-to-image1.jpg'
            },
            {
                id: 'V010',
                companyName: 'ABC Corp.',
                fullName: 'Jane Smith',
                email: 'jane@abc.com',
                contact: '987-654-3210',
                imageUrl: '/path-to-image2.jpg'
            },
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
                imageUrl: '/path-to-image3.jpg'
            },
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

const Sessions = () => {
    const [open, setOpen] = useState(false);
    const [visitorModalOpen, setVisitorModalOpen] = useState(false); // For detailed visitor modal
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedVisitor, setSelectedVisitor] = useState(null); // Store selected visitor data
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visitorSearch, setVisitorSearch] = useState(''); // State for searching visitor teams

    // Calculate session statistics
    const totalSessions = sessionsData.length;
    const ongoingSessions = sessionsData.filter(session => session.status === 'Ongoing').length;
    const upcomingSessions = sessionsData.filter(session => session.status === 'Upcoming').length;
    const finishedSessions = sessionsData.filter(session => session.status === 'Finished').length;

    // Handle row click to open the session modal
    const handleRowClick = (params) => {
        setSelectedSession(params.row);
        setFilteredVisitors(params.row.visitorTeams);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVisitor(null);
        setVisitorModalOpen(false);
    };

    // Handle visitor row click to open detailed visitor modal
    const handleVisitorRowClick = (visitor) => {
        setSelectedVisitor(visitor);
        setVisitorModalOpen(true);
    };

    // Handle search for visitor teams inside the modal
    useEffect(() => {
        if (selectedSession) {
            let filtered = selectedSession.visitorTeams.filter(visitor =>
                visitor.companyName.toLowerCase().includes(visitorSearch.toLowerCase()) ||
                visitor.fullName.toLowerCase().includes(visitorSearch.toLowerCase()) ||
                visitor.email.toLowerCase().includes(visitorSearch.toLowerCase()) ||
                visitor.contact.includes(visitorSearch)
            );
            setFilteredVisitors(filtered);
        }
    }, [visitorSearch, selectedSession]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Session Name', width: 150 },
        { field: 'date', headerName: 'Date', width: 120 },
        { field: 'startTime', headerName: 'Start Time', width: 120, renderCell: (params) => formatTime(params.value) },
        { field: 'endTime', headerName: 'End Time', width: 120, renderCell: (params) => formatTime(params.value) },
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

    // Chart.js data for sessions status (Ensure datasets always exist)
    const chartData = {
        labels: ['Ongoing', 'Upcoming', 'Finished'],
        datasets: ongoingSessions || upcomingSessions || finishedSessions ? [
            {
                label: 'Sessions Status',
                data: [ongoingSessions, upcomingSessions, finishedSessions],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
        ] : [{ label: 'No Data', data: [], backgroundColor: [] }]
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 4 }}>
                Sessions Overview
            </Typography>

            {/* Animated Counters */}
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} sm={3}>
                    <Paper sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
                        <Typography variant="h6">Total Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007aff' }}>
                            <CountUp end={totalSessions} duration={1.5} />
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
                        <Typography variant="h6">Upcoming Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                            <CountUp end={upcomingSessions} duration={1.5} />
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
                        <Typography variant="h6">Ongoing Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                            <CountUp end={ongoingSessions} duration={1.5} />
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
                        <Typography variant="h6">Finished Sessions</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                            <CountUp end={finishedSessions} duration={1.5} />
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Sessions DataGrid */}
            <DataGrid
                rows={sessionsData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={handleRowClick}
                sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}
            />

            {/* Session Status Chart */}
            <Box sx={{ marginTop: 4 }}>
                <Paper sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Sessions Status Overview
                    </Typography>
                    <Box sx={{ height: '250px', width: '100%' }}>
                        <Line data={chartData} />
                    </Box>
                </Paper>
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
                                            <TableRow key={visitor.id} onClick={() => handleVisitorRowClick(visitor)} hover>
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
            {/* Detailed Visitor Modal */}
            {selectedVisitor && (
                <Modal open={visitorModalOpen} onClose={() => setVisitorModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Fade in={visitorModalOpen}>
                        <Paper sx={{ padding: 4, width: '90%', maxHeight: '80vh', overflowY: 'auto', maxWidth: '500px' }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Visitor Information
                            </Typography>
                            <Divider sx={{ marginBottom: 2 }} />

                            {/* Visitor Information */}
                            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                                <Avatar alt={selectedVisitor.fullName} src={selectedVisitor.imageUrl} sx={{ width: 80, height: 80, margin: 'auto' }} />
                            </Box>

                            {/* Two-column layout using Grid */}
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography><strong>Full Name:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedVisitor.fullName}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography><strong>Company Name:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedVisitor.companyName}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography><strong>Email:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedVisitor.email}</Typography>
                                </Grid>

                                <Grid item xs={6}>
                                    <Typography><strong>Phone No:</strong></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>{selectedVisitor.contact}</Typography>
                                </Grid>
                            </Grid>

                            <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                                <Button onClick={() => setVisitorModalOpen(false)} variant="contained" color="primary">
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

export default Sessions;
