import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Modal, Button, Grid, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, InputLabel, Fade, InputAdornment, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CountUp from 'react-countup';
import { styled } from '@mui/system';
import axios from 'axios';

import Swal from 'sweetalert2';

// Custom styled blinking dot for availability
const BlinkingDot = styled(FiberManualRecordIcon)(({ status }) => ({
  color: status === 'Unavailable' ? '#f44336' : '#4caf50',
  fontSize: '14px',
  animation: 'blinking 1.5s infinite',
  '@keyframes blinking': {
    '0%': { opacity: 0 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
}));

// Sample location data
const locationsData = [
  {
    id: 1,
    name: 'Conference Room A',
    address: 'Building 1 - Floor 2',
    availableFrom: '08:00 AM',
    availableTo: '04:00 PM',
    status: 'Open',
    bookings: [
      { time: '09:00 - 10:00 AM', event: 'Team Meeting' },
      { time: '11:00 - 12:00 PM', event: 'Interview' },
    ],
  },
  {
    id: 2,
    name: 'Training Room B',
    address: 'Building 2 - Floor 1',
    availableFrom: '09:00 AM',
    availableTo: '05:00 PM',
    status: 'Open',
    bookings: [],
  },
  {
    id: 3,
    name: 'Executive Suite',
    address: 'Building 3 - Floor 5',
    availableFrom: '10:00 AM',
    availableTo: '06:00 PM',
    status: 'Closed',
    bookings: [
      { time: '10:00 - 11:30 AM', event: 'Client Presentation' },
      { time: '01:00 - 02:00 PM', event: 'Strategy Meeting' },
    ],
  },
];

const ManageLocations = () => {
  const [open, setOpen] = useState(false); // Modal for adding location
  const [editOpen, setEditOpen] = useState(false); // Modal for editing location
  const [openDetails, setOpenDetails] = useState(false); // Modal for location details
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredData, setFilteredData] = useState(locationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    availableFrom: { hour: '08', minute: '00', period: 'AM' },
    availableTo: { hour: '04', minute: '00', period: 'PM' },
  });

  // Editing location
  const [editLocation, setEditLocation] = useState({
    status: 'Open',
    availableFrom: { hour: '08', minute: '00', period: 'AM' },
    availableTo: { hour: '04', minute: '00', period: 'PM' },
  });

  // Statistics for locations
  const totalLocations = locationsData.length;
  const unavailableLocations = locationsData.filter(location => location.bookings.length > 0).length;
  const availableLocations = totalLocations - unavailableLocations;
  const inUseLocations = unavailableLocations;

  // Handle row click to show location bookings
  const handleRowClick = (location) => {
    setSelectedLocation(location);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => setOpenDetails(false);

  // Add new location modal
  const handleAddLocationOpen = () => setOpen(true);
  const handleAddLocationClose = () => setOpen(false);

  // Open the edit modal
  const handleEditOpen = () => {
    setEditLocation({
      status: selectedLocation.status,
      availableFrom: { hour: selectedLocation.availableFrom.split(':')[0], minute: selectedLocation.availableFrom.split(':')[1].slice(0, 2), period: selectedLocation.availableFrom.includes('AM') ? 'AM' : 'PM' },
      availableTo: { hour: selectedLocation.availableTo.split(':')[0], minute: selectedLocation.availableTo.split(':')[1].slice(0, 2), period: selectedLocation.availableTo.includes('AM') ? 'AM' : 'PM' },
    });
    setEditOpen(true);
  };

  const handleEditClose = () => setEditOpen(false);

  // Function to handle the addition of a new location
 // Function to handle the addition of a new location and sending data to backend
 const handleAddLocation = async () => {
  const formattedFrom = `${newLocation.availableFrom.hour}:${newLocation.availableFrom.minute} ${newLocation.availableFrom.period}`;
  const formattedTo = `${newLocation.availableTo.hour}:${newLocation.availableTo.minute} ${newLocation.availableTo.period}`;

  // Prepare the data to be sent to the backend
  const locationData = {
    name: newLocation.name,
    address: newLocation.address,
    available_from: formattedFrom,
    available_to: formattedTo,
  };

  try {
    // Make the POST request to add a new location
    const response = await axios.post('http://192.168.13.150:3001/addlocations', locationData, { withCredentials: true });

    if (response.status === 200) {
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'The location has been added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Update the frontend state with the new location data
    }
  } catch (error) {
    console.error('Failed to add location:', error);
    Swal.fire({
      title: 'Error!',
      text: `Failed to add location: ${error.response?.data?.message || error.message}`,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};

  // Handle search/filter logic
  useEffect(() => {
    const filtered = locationsData.filter(
      (location) =>
        (location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (availabilityFilter === ''
          ? true
          : availabilityFilter === 'Available'
          ? location.bookings.length === 0
          : location.bookings.length > 0)
    );
    setFilteredData(filtered);
  }, [searchTerm, availabilityFilter]);

  // Function to save edited location details
  const handleSaveEdit = () => {
    const formattedFrom = `${editLocation.availableFrom.hour}:${editLocation.availableFrom.minute} ${editLocation.availableFrom.period}`;
    const formattedTo = `${editLocation.availableTo.hour}:${editLocation.availableTo.minute} ${editLocation.availableTo.period}`;

    const updatedLocations = filteredData.map((location) =>
      location.id === selectedLocation.id
        ? {
            ...location,
            status: editLocation.status,
            availableFrom: formattedFrom,
            availableTo: formattedTo,
          }
        : location
    );
    setFilteredData(updatedLocations);
    setEditOpen(false);
  };

  // Define columns for the table
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Location Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ color: params.value === 'Open' ? '#4caf50' : '#f44336' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'availability',
      headerName: 'Availability',
      width: 150,
      renderCell: (params) => {
        const isUnavailable = params.row.bookings.length > 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BlinkingDot status={isUnavailable ? 'Unavailable' : 'Available'} />
            <Typography sx={{ marginLeft: 1 }}>{isUnavailable ? 'Unavailable' : 'Available'}</Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Page Title with Add New Location Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Manage Locations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddLocationOpen}
          sx={{
            backgroundColor: '#007aff',
            ':hover': { backgroundColor: '#005bb5' },
            padding: '10px 20px',
            fontWeight: 'bold',
          }}
        >
          Add New Location
        </Button>
      </Box>

      {/* Animated Counters */}
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
            <Typography variant="h6">Total Locations</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007aff' }}>
              <CountUp end={totalLocations} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
            <Typography variant="h6">Available Locations</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              <CountUp end={availableLocations} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h6">Unavailable Locations</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              <CountUp end={unavailableLocations} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
            <Typography variant="h6">In Use Now</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              <CountUp end={inUseLocations} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Location Search and Filter */}
      <Box sx={{ marginBottom: 3, backgroundColor: '#fff', padding: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextField
              label="Search by Location or Address"
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
              <InputLabel>Availability</InputLabel>
              <Select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                label="Availability"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Unavailable">Unavailable</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Location DataGrid */}
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={(params) => handleRowClick(params.row)}
        sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}
      />

      {/* Add Location Modal */}
      <Modal open={open} onClose={handleAddLocationClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Fade in={open}>
          <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px' }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Add New Location
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Grid container spacing={2}>
              {/* Location Name */}
              <Grid item xs={12}>
                <TextField
                  label="Location Name"
                  fullWidth
                  variant="outlined"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  variant="outlined"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })} 
                />
              </Grid>

              {/* Available From (Time Range - Start) */}
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  Available From
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Hour</InputLabel>
                      <Select
                        value={newLocation.availableFrom.hour}
                        onChange={(e) =>
                          setNewLocation({ ...newLocation, availableFrom: { ...newLocation.availableFrom, hour: e.target.value } })
                        }
                        label="Hour"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Minute</InputLabel>
                      <Select
                        value={newLocation.availableFrom.minute}
                        onChange={(e) =>
                          setNewLocation({ ...newLocation, availableFrom: { ...newLocation.availableFrom, minute: e.target.value } })
                        }
                        label="Minute"
                      >
                        <MenuItem value="00">00</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                        <MenuItem value="45">45</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        value={newLocation.availableFrom.period}
                        onChange={(e) =>
                          setNewLocation({ ...newLocation, availableFrom: { ...newLocation.availableFrom, period: e.target.value } })
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Available To (Time Range - End) */}
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  Available To
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Hour</InputLabel>
                      <Select
                        value={newLocation.availableTo.hour}
                        onChange={(e) =>
                          setNewLocation({ ...newLocation, availableTo: { ...newLocation.availableTo, hour: e.target.value } })
                        }
                        label="Hour"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Minute</InputLabel>
                      <Select
                        value={newLocation.availableTo.minute}
                        onChange={(e) =>
                          setNewLocation({ ...newLocation, availableTo: { ...newLocation.availableTo, minute: e.target.value } })
                        }
                        label="Minute"
                      >
                        <MenuItem value="00">00</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                        <MenuItem value="45">45</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        value={newLocation.availableTo.period}
                        onChange={(e) =>
                          setNewLocation({ ...newLocation, availableTo: { ...newLocation.availableTo, period: e.target.value } })
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Modal Action Buttons */}
            <Box sx={{ textAlign: 'right', marginTop: 2 }}>
              <Button onClick={handleAddLocationClose} sx={{ marginRight: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleAddLocation} variant="contained" color="primary">
                Add Location
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* Edit Location Modal */}
      <Modal open={editOpen} onClose={handleEditClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Fade in={editOpen}>
          <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px' }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Edit Location
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />

            <Grid container spacing={2}>
              {/* Status Field */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editLocation.status}
                    onChange={(e) => setEditLocation({ ...editLocation, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Available From (Time Range - Start) */}
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  Available From
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Hour</InputLabel>
                      <Select
                        value={editLocation.availableFrom.hour}
                        onChange={(e) =>
                          setEditLocation({ ...editLocation, availableFrom: { ...editLocation.availableFrom, hour: e.target.value } })
                        }
                        label="Hour"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Minute</InputLabel>
                      <Select
                        value={editLocation.availableFrom.minute}
                        onChange={(e) =>
                          setEditLocation({ ...editLocation, availableFrom: { ...editLocation.availableFrom, minute: e.target.value } })
                        }
                        label="Minute"
                      >
                        <MenuItem value="00">00</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                        <MenuItem value="45">45</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        value={editLocation.availableFrom.period}
                        onChange={(e) =>
                          setEditLocation({ ...editLocation, availableFrom: { ...editLocation.availableFrom, period: e.target.value } })
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Available To (Time Range - End) */}
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  Available To
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Hour</InputLabel>
                      <Select
                        value={editLocation.availableTo.hour}
                        onChange={(e) =>
                          setEditLocation({ ...editLocation, availableTo: { ...editLocation.availableTo, hour: e.target.value } })
                        }
                        label="Hour"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Minute</InputLabel>
                      <Select
                        value={editLocation.availableTo.minute}
                        onChange={(e) =>
                          setEditLocation({ ...editLocation, availableTo: { ...editLocation.availableTo, minute: e.target.value } })
                        }
                        label="Minute"
                      >
                        <MenuItem value="00">00</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                        <MenuItem value="45">45</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        value={editLocation.availableTo.period}
                        onChange={(e) =>
                          setEditLocation({ ...editLocation, availableTo: { ...editLocation.availableTo, period: e.target.value } })
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Modal Action Buttons */}
            <Box sx={{ textAlign: 'right', marginTop: 2 }}>
              <Button onClick={handleEditClose} sx={{ marginRight: 1 }}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>

      {/* Location Details Modal */}
      {selectedLocation && (
        <Modal open={openDetails} onClose={handleCloseDetails} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Fade in={openDetails}>
            <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px' }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Location Bookings
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />

              <Typography variant="body1">
                <strong>Location:</strong> {selectedLocation.name}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {selectedLocation.address}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedLocation.status}
              </Typography>
              <Typography variant="body1">
                <strong>Available From:</strong> {selectedLocation.availableFrom} - <strong>To:</strong> {selectedLocation.availableTo}
              </Typography>

              <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                Booking Records
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Event</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedLocation.bookings.length > 0 ? (
                      selectedLocation.bookings.map((booking, index) => (
                        <TableRow key={index}>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>{booking.event}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>No bookings for today</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                {/* Edit Button */}
                <Button onClick={handleEditOpen} sx={{ marginRight: 2 }} variant="contained" color="secondary">
                  Edit Location
                </Button>
                <Button onClick={handleCloseDetails} variant="contained" color="primary">
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

export default ManageLocations;
