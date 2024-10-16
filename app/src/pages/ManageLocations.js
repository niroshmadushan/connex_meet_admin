import React, { useState, useEffect } from 'react';
import moment from 'moment';
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
import APIConnection from '../config';
import Cookies from 'js-cookie'; // Import js-cookie for handling cookies
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

const isPlaceAvailable = (availableFrom, availableTo, bookings) => {
  // Convert availableFrom and availableTo to moment objects for easier comparison
  const startAvailability = moment(availableFrom, 'hh:mm A');
  const endAvailability = moment(availableTo, 'hh:mm A');

  if (bookings.length === 0) {
    // If there are no bookings, the place is fully available
    return true;
  }

  // Sort bookings by time to ensure they are in order
  const sortedBookings = bookings.sort((a, b) => {
    const startTimeA = moment(a.time.split(' - ')[0], 'hh:mm A');
    const startTimeB = moment(b.time.split(' - ')[0], 'hh:mm A');
    return startTimeA.diff(startTimeB);
  });

  // Check if there's a gap before the first booking
  const firstBookingStart = moment(sortedBookings[0].time.split(' - ')[0], 'hh:mm A');
  if (firstBookingStart.isAfter(startAvailability)) {
    return true;
  }

  // Check for gaps between bookings
  for (let i = 0; i < sortedBookings.length - 1; i++) {
    const currentBookingEnd = moment(sortedBookings[i].time.split(' - ')[1], 'hh:mm A');
    const nextBookingStart = moment(sortedBookings[i + 1].time.split(' - ')[0], 'hh:mm A');

    if (nextBookingStart.isAfter(currentBookingEnd)) {
      return true;
    }
  }

  // Check if there's a gap after the last booking
  const lastBookingEnd = moment(sortedBookings[sortedBookings.length - 1].time.split(' - ')[1], 'hh:mm A');
  if (lastBookingEnd.isBefore(endAvailability)) {
    return true;
  }

  // If no gaps are found, the place is fully booked
  return false;
};

const ManageLocations = () => {
  const [open, setOpen] = useState(false); // Modal for adding location
  const [editOpen, setEditOpen] = useState(false); // Modal for editing location
  const [openDetails, setOpenDetails] = useState(false); // Modal for location details
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationsData, setlocationsData] = useState([])
  const [filteredData, setFilteredData] = useState(locationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    availableFrom: { hour: '08', minute: '00', period: 'AM' },
    availableTo: { hour: '04', minute: '00', period: 'PM' },
  });

  useEffect(() => {

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataResponse = await axios.get(APIConnection.getalllocationdata, { withCredentials: true });
      setlocationsData(dataResponse.data);
      setFilteredData(dataResponse.data); // Set filtered data here
      console.log(dataResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };





  // Editing location
  const [editLocation, setEditLocation] = useState({
    status: 'Open',
    availableFrom: { hour: '08', minute: '00', period: 'AM' },
    availableTo: { hour: '04', minute: '00', period: 'PM' },
  });

  // Statistics for locations
  const calculateCounts = () => {
    const total = filteredData.length;
    const available = filteredData.filter((location) =>
      isPlaceAvailable(location.availableFrom, location.availableTo, location.bookings)
    ).length;
    const unavailable = total - available;
    const inUse = filteredData.filter((location) => location.status === 'Open').length;

    return { total, available, unavailable, inUse };
  };

  const { total, available, unavailable, inUse } = calculateCounts();

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
    // Retrieve the orgId from cookies
    const orgId = Cookies.get('oid'); // Assuming 'orgId' is the cookie name where it's stored
  console.log(orgId);
    const formattedFrom = `${newLocation.availableFrom.hour}:${newLocation.availableFrom.minute} ${newLocation.availableFrom.period}`;
    const formattedTo = `${newLocation.availableTo.hour}:${newLocation.availableTo.minute} ${newLocation.availableTo.period}`;
  
    // Prepare the data to be sent to the backend, including orgId
    const locationData = {
      name: newLocation.name,
      address: newLocation.address,
      available_from: formattedFrom,
      available_to: formattedTo,
      orgId: orgId, // Add orgId from cookies here
    };
  
    try {
      // Make the POST request to add a new location
      const response = await axios.post(`${APIConnection.mainapi}/addlocations`, locationData, { withCredentials: true });
      fetchData();
      if (response.status === 200) {
        setOpen(false);
        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'The location has been added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
  
        // Update the frontend state with the new location data
        // Add your logic for state update if needed
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
  }, [searchTerm, availabilityFilter, locationsData]); // Add `locationsData` here


  // Function to save edited location details
  const handleSaveEdit = async () => {
    const formattedFrom = `${editLocation.availableFrom.hour}:${editLocation.availableFrom.minute} ${editLocation.availableFrom.period}`;
    const formattedTo = `${editLocation.availableTo.hour}:${editLocation.availableTo.minute} ${editLocation.availableTo.period}`;

    try {
      await axios.put(
        `${APIConnection.mainapi}/updatelocationstatus/${selectedLocation.id}`,
        {
          start_time: formattedFrom,
          end_time: formattedTo,
          status_id: editLocation.status === 'Open' ? 4 : 3,
        },
        { withCredentials: true }
      );
      setOpenDetails(false);
      setEditOpen(false);
      Swal.fire('Success!', 'Location updated successfully.', 'success');
      fetchData();

    } catch (error) {
      console.error('Failed to update location:', error);
      Swal.fire('Error!', 'Failed to update location.', 'error');
    }
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
        const isAvailable = isPlaceAvailable(params.row.availableFrom, params.row.availableTo, params.row.bookings);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BlinkingDot status={isAvailable ? 'Available' : 'Unavailable'} />
            <Typography sx={{ marginLeft: 1 }}>{isAvailable ? 'Available' : 'Unavailable'}</Typography>
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
              <CountUp end={total} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
            <Typography variant="h6">Available Locations</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              <CountUp end={available} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h6">Unavailable Locations</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              <CountUp end={unavailable} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
            <Typography variant="h6">In Use Now</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              <CountUp end={inUse} duration={1.5} />
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
            <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px', height: '80vh', overflowY: 'scroll' }}>
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
                      <TableCell>Title</TableCell>
                      <TableCell>Event</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedLocation.bookings.length > 0 ? (
                      selectedLocation.bookings.map((booking, index) => (
                        <TableRow key={index}>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>{booking.title}</TableCell>
                          <TableCell>
                            {booking.event === 'meeting' && 'Meeting'}
                            {booking.event === 'internalmeeting' && 'Internal Meeting'}
                            {booking.event === 'interview' && 'Interview'}
                            {booking.event === 'internalsession' && 'Internal Session'}
                            {booking.event === 'session' && 'Internal Session'}
                            {(!booking.event ||
                              !['meeting', 'internalmeeting', 'interview', 'internalsession', 'session'].includes(booking.event)) &&
                              booking.event} {/* Fallback to show the original event if not matched */}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>No bookings for today</TableCell>
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
