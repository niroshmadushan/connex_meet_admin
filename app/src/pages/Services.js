import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Grid, MenuItem, Select, InputLabel, FormControl, Fade, InputAdornment, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add'; // Icon for new service button
import { styled } from '@mui/system';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // For chart rendering
import AddServiceForm from '../components/AddServiceForm'; // Import the AddServiceForm component
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import GroupIcon from '@mui/icons-material/Group';
import NotesIcon from '@mui/icons-material/Notes';
import axios from 'axios';
import Swal from 'sweetalert2';
// Sample service data

const servicesData = [
  {
    id: 1,
    name: 'Water Supply Fix',
    date: '2024-09-12',
    startTime: '09:00',
    endTime: '12:00',
    location: 'Building A - Water Pump Room',
    serviceCompany: 'ABC Plumbing Co.',
    employees: [
      { id: 'S001', name: 'John Doe', phone: '123-456-7890' },
      { id: 'S002', name: 'Jane Smith', phone: '987-654-3210' },
    ],
    status: 'Ongoing',
  },
  {
    id: 2,
    name: 'HVAC Maintenance',
    date: '2024-09-15',
    startTime: '10:00',
    endTime: '13:00',
    location: 'Building C - Roof',
    serviceCompany: 'XYZ HVAC Services',
    employees: [{ id: 'S003', name: 'Alex Johnson', phone: '234-567-8901' }],
    status: 'Upcoming',
  },
  {
    id: 3,
    name: 'Electrical System Upgrade',
    date: '2024-09-10',
    startTime: '14:00',
    endTime: '17:00',
    location: 'Building B - Electrical Room',
    serviceCompany: 'PQR Electricians',
    employees: [{ id: 'S004', name: 'Emily Davis', phone: '345-678-9012' }],
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

const Services = () => {
  const [open, setOpen] = useState(false); // Modal for service details
  const [addServiceOpen, setAddServiceOpen] = useState(false); // Modal for Add Service form
  const [selectedService, setSelectedService] = useState(null);
  const [filteredData, setFilteredData] = useState(servicesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // For animated counters
  const totalServices = servicesData.length;
  const upcomingServices = servicesData.filter(service => service.status === 'Upcoming').length;
  const ongoingServices = servicesData.filter(service => service.status === 'Ongoing').length;
  const finishedServices = servicesData.filter(service => service.status === 'Finished').length;

  // Handle row click to open the service details modal
  const handleRowClick = (params) => {
    setSelectedService(params.row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Handle Add Service form modal open/close
  const handleAddServiceOpen = () => setAddServiceOpen(true);
  const handleAddServiceClose = () => setAddServiceOpen(false);

  // Handle search/filter logic
  useEffect(() => {
    let filtered = servicesData.filter(service =>
      (service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.serviceCompany.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || service.status === statusFilter)
    );
    setFilteredData(filtered);
  }, [searchTerm, statusFilter]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Service Request', width: 200 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'startTime', headerName: 'Start Time', width: 120 },
    { field: 'endTime', headerName: 'End Time', width: 120 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'serviceCompany', headerName: 'Service Company', width: 180 },
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

  const chartData = {
    labels: ['Ongoing', 'Upcoming', 'Finished'],
    datasets: [
      {
        label: 'Services Status',
        data: [ongoingServices, upcomingServices, finishedServices],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };
  //services

  const [formDatasrc, setFormDatasrc] = useState({
    title: '',
    date: '',
    companyName: '',
    specialNote: '',
  });

  // Handle change for each input field
  const handleChangesrc = (e) => {
    setFormDatasrc({
      ...formDatasrc,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
 // Make sure to import axios at the top of your file

  // Handle form submission
  const handleSubmitsrc = async (e) => {
    e.preventDefault();
  
    // Map form data to match backend field names
    const serviceData = {
      title: formDatasrc.title,
      date: formDatasrc.date,
      company_name: formDatasrc.companyName,
      note: formDatasrc.specialNote,
    };
  
    try {
      // Send POST request to add new service
      const response = await axios.post('http://192.168.13.150:3001/services', serviceData, { withCredentials: true });
      
      // Check response status
      if (response.status === 200) {
        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'The service has been added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          // Clear form fields after submission
          setFormDatasrc({
            title: '',
            date: '',
            companyName: '',
            specialNote: '',
          });
          setAddServiceOpen(false); // Close the modal after successful submission
        });
      }
    } catch (error) {
      // Show error alert if request fails
      Swal.fire({
        title: 'Error!',
        text: `Failed to add service: ${error.response?.data?.message || error.message}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Failed to add service:', error);
    }
  };
  

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Page Title with Add New Service Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Services Overview
        </Typography>
        {/* Add New Service Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddServiceOpen}
          sx={{
            backgroundColor: '#007aff',
            ':hover': {
              backgroundColor: '#005bb5',
            },
            padding: '10px 20px',
            fontWeight: 'bold',
          }}
        >
          Add New Service
        </Button>
      </Box>

      {/* Animated Counters */}
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
            <Typography variant="h6">Total Services</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007aff' }}>
              <CountUp end={totalServices} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
            <Typography variant="h6">Upcoming Services</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              <CountUp end={upcomingServices} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
            <Typography variant="h6">Ongoing Services</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              <CountUp end={ongoingServices} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h6">Finished Services</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              <CountUp end={finishedServices} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Service Filters */}
      <Box sx={{ marginBottom: 3, backgroundColor: '#fff', padding: 2, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextField
              label="Search by Service Request or Company"
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

      {/* Services DataGrid */}
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
        sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}
      />

      {/* Service Status Chart */}
      <Box sx={{ marginTop: 4 }}>
        <Paper sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Services Status Overview
          </Typography>
          <Box sx={{ height: '250px', width: '100%' }}>
            <Line data={chartData} />
          </Box>
        </Paper>
      </Box>

      {/* Service Details Modal */}
      {selectedService && (
        <Modal open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Fade in={open}>
            <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px' }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Service Details
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Service Request:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedService.name}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Date:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedService.date}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Start Time:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedService.startTime}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>End Time:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedService.endTime}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Location:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedService.location}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography><strong>Service Company:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{selectedService.serviceCompany}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                Service Employees
              </Typography>

              {/* Service Employees Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedService.employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.id}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
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

      {/* Add Service Modal */}
      {/* Add Service Modal */}
<Modal
  open={addServiceOpen}
  onClose={handleAddServiceClose}
  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
>
  <Fade in={addServiceOpen}>
    <Paper elevation={3} sx={{ padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '600px' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Add a New Service
      </Typography>
      <form onSubmit={handleSubmitsrc}>
        <Grid container spacing={3}>
          {/* Title Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Title"
              name="title"
              value={formDatasrc.title}
              onChange={handleChangesrc}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          {/* Date Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formDatasrc.date}
              onChange={handleChangesrc}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          {/* Company Name Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formDatasrc.companyName}
              onChange={handleChangesrc}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GroupIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>

          {/* Special Note Field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Special Note"
              name="specialNote"
              value={formDatasrc.specialNote}
              onChange={handleChangesrc}
              multiline
              rows={4}
              placeholder="Enter any special notes regarding the service"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#007aff',
                color: '#fff',
                ':hover': { backgroundColor: '#005bb5' },
                transition: 'background-color 0.3s ease',
                padding: '10px',
                fontWeight: 'bold',
              }}
              fullWidth
            >
              Add Service
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  </Fade>
</Modal>

    </Box>
  );
};

export default Services;
