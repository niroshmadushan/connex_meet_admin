import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Grid, MenuItem, Select, InputLabel, FormControl, Fade, InputAdornment, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

import Swal from 'sweetalert2';

// Custom styles for the status dot
const BlinkingDot = ({ color }) => (
  <FiberManualRecordIcon
    sx={{
      color: color,
      fontSize: '14px',
      animation: 'blinking 1.5s infinite',
      '@keyframes blinking': {
        '0%': { opacity: 0 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
    }}
  />
);

const Services = () => {
  const [open, setOpen] = useState(false); // Modal for service details
  const [addServiceOpen, setAddServiceOpen] = useState(false); // Modal for Add Service form
  const [selectedService, setSelectedService] = useState(null);
  const [servicesData, setServicesData] = useState([]); // State to store fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch services data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.13.150:3001/getservices', { withCredentials: true });
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
  
        // Map over the response data and add `type` and `status` properties
        const services = response.data.map(service => {
          // Determine the type based on the date comparison
          const serviceDate = service.date; // Format: 'YYYY-MM-DD'
  
          let type = '';
          if (serviceDate > currentDate) {
            type = 'Upcoming';
          } else if (serviceDate < currentDate) {
            type = 'Finished';
          } else {
            type = 'Ongoing';
          }
  
          return {
            ...service,
            serviceCompany: service.company_name, // Map company_name to serviceCompany for consistency
            status: getStatusLabel(service.status), // Map status codes to labels
            type, // Add the new type field
          };
        });
  
        setServicesData(services);
        setFilteredData(services); // Initialize filtered data
      } catch (error) {
        console.error('Failed to fetch services data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  // Map status values to labels
  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return 'Pending';
      case 5:
        return 'Completed';
      case 6:
        return 'Closed';
      default:
        return 'Unknown';
    }
  };

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
      (service.title.toLowerCase().includes(searchTerm.toLowerCase()) || service.serviceCompany.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || service.status === getStatusLabel(statusFilter))
    );
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, servicesData]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Service Name', width: 200 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'serviceCompany', headerName: 'Company Name', width: 200 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => {
        let color = '';
        switch (params.value) {
          case 'Upcoming':
            color = '#ff9800'; // Orange for Upcoming
            break;
          case 'Ongoing':
            color = '#4caf50'; // Green for Ongoing
            break;
          case 'Finished':
            color = '#f44336'; // Red for Finished
            break;
          default:
            color = '#000'; // Default color (black)
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Blinking dot with dynamic color */}
            <BlinkingDot color={color} />
            {/* Type text with matching color */}
            <Typography sx={{ marginLeft: 1, color: color }}>{params.value}</Typography>
          </Box>
        );
      },
    },
  ];

  // Counters for status breakdown
  const totalServices = servicesData.length;
  const upcomingServices = servicesData.filter(service => service.status === 'Pending').length;
  const ongoingServices = servicesData.filter(service => service.status === 'Ongoing').length;
  const finishedServices = servicesData.filter(service => service.status === 'Completed').length;

  const chartData = {
    labels: ['Pending', 'Completed', 'Closed'],
    datasets: [
      {
        label: 'Services Status',
        data: [upcomingServices, finishedServices, servicesData.filter(service => service.status === 'Closed').length],
        backgroundColor: ['#ff9800', '#4caf50', '#f44336'],
      },
    ],
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
            <Typography variant="h6">Pending Services</Typography>
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
            <Typography variant="h6">Closed Services</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              <CountUp end={finishedServices} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

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
    </Box>
  );
};

export default Services;
