import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Grid, MenuItem, Select, InputLabel, FormControl, Fade, InputAdornment, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/system';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import AddMeetingSession from '../components/AddMeetingSession';  // Import the new meeting form component

const meetingsData = [
  { id: 1, name: 'Meeting A', date: '2024-09-12', startTime: '09:00', endTime: '10:00', location: 'Room 101', visitorCompany: 'XYZ Inc.', participant: 'John Doe', status: 'Ongoing' },
  { id: 2, name: 'Meeting B', date: '2024-09-15', startTime: '10:30', endTime: '11:30', location: 'Room 202', visitorCompany: 'ABC Corp.', participant: 'Jane Smith', status: 'Upcoming' },
  { id: 3, name: 'Meeting C', date: '2024-09-10', startTime: '14:00', endTime: '15:00', location: 'Room 303', visitorCompany: 'PQR Ltd.', participant: 'Alex Johnson', status: 'Finished' },
];

const visitorsData = [
  { id: 'V001', name: 'John Doe', phone: '123-456-7890' },
  { id: 'V002', name: 'Jane Smith', phone: '987-654-3210' },
];

const BlinkingDot = styled(FiberManualRecordIcon)(({ status }) => ({
  color: status === 'Ongoing' ? '#4caf50' : status === 'Finished' ? '#f44336' : '#ff9800',
  fontSize: '14px',
  animation: 'blinking 0.3s infinite',
  '@keyframes blinking': {
    '0%': { opacity: 0 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
}));

const Meetings = () => {
  const [open, setOpen] = useState(false);
  const [newMeetingOpen, setNewMeetingOpen] = useState(false); // For the new meeting modal
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [filteredData, setFilteredData] = useState(meetingsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const totalMeetings = meetingsData.length;
  const upcomingMeetings = meetingsData.filter(meeting => meeting.status === 'Upcoming').length;
  const ongoingMeetings = meetingsData.filter(meeting => meeting.status === 'Ongoing').length;
  const finishedMeetings = meetingsData.filter(meeting => meeting.status === 'Finished').length;

  const handleRowClick = (params) => {
    setSelectedMeeting(params.row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNewMeetingOpen = () => setNewMeetingOpen(true); // Open the new meeting modal
  const handleNewMeetingClose = () => setNewMeetingOpen(false); // Close the new meeting modal

  

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Meeting Name', width: 150 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'startTime', headerName: 'Start Time', width: 120, renderCell: (params) => formatTime(params.value) },
    { field: 'endTime', headerName: 'End Time', width: 120, renderCell: (params) => formatTime(params.value) },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'visitorCompany', headerName: 'Visitor Company', width: 180 },
    { field: 'participant', headerName: 'Participants', width: 200 },
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
        label: 'Meetings Status',
        data: [ongoingMeetings, upcomingMeetings, finishedMeetings],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Meetings Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleNewMeetingOpen}
          sx={{
            backgroundColor: '#007aff',
            ':hover': {
              backgroundColor: '#005bb5',
            },
          }}
        >
          Add New Meeting
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
            <Typography variant="h6">Total Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007aff' }}>
              <CountUp end={totalMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
            <Typography variant="h6">Upcoming Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              <CountUp end={upcomingMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
            <Typography variant="h6">Ongoing Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              <CountUp end={ongoingMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h6">Finished Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              <CountUp end={finishedMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ marginBottom: 3, backgroundColor: '#fff', padding: 2, borderRadius: 2, boxShadow: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextField
              label="Search by Meeting Name or Visitor Company"
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

      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
        sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}
      />

      <Box sx={{ marginTop: 4 }}>
        <Paper sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Meetings Status Overview
          </Typography>
          <Box sx={{ height: '250px', width: '100%' }}>
            <Line data={chartData} />
          </Box>
        </Paper>
      </Box>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <Modal open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Fade in={open}>
            <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px' }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Meeting Details
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Meeting Name:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedMeeting.name}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Date:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedMeeting.date}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Start Time:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedMeeting.startTime}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>End Time:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedMeeting.endTime}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Location:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedMeeting.location}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Visitor Company:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedMeeting.visitorCompany}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Participants:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedMeeting.participant}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                Visitor Team Information
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Visitor ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visitorsData.map((visitor) => (
                      <TableRow key={visitor.id}>
                        <TableCell>{visitor.id}</TableCell>
                        <TableCell>{visitor.name}</TableCell>
                        <TableCell>{visitor.phone}</TableCell>
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

      {/* New Meeting Form Modal */}
      <Modal open={newMeetingOpen} onClose={handleNewMeetingClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Fade in={newMeetingOpen}>
          <Box sx={{ width: '600px', maxWidth: '100%',height:'800px',overflowY:'scroll' ,backgroundColor:'white',borderRadius:'10px'}}>
            <AddMeetingSession  />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Meetings;
