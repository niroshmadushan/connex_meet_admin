import React, { useState, useEffect } from 'react';
import {
  Box, Button, Modal, TextField, Typography, Paper, Grid, Card, CardContent, IconButton, Avatar, InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { keyframes } from '@emotion/react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import APIConnection from '../config';
import axios from 'axios'; // Add this line to import axios
// Blinking Dot for Status
const blink = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const BlinkingDot = styled(FiberManualRecordIcon)(({ status }) => ({
  color: status === 'Active' ? '#4caf50' : '#f44336', // Green for Active, Red for Deactivated
  fontSize: '14px',
  animation: `${blink} 1.5s infinite`
}));

// Sample user data with dummy data for all columns


const Users = () => {
  const [rows, setRows] = useState([]);
  const [imageBase64, setImageBase64] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    designation: '',
    organizationId: '',
    password: '',
    confirmPassword: ''
  });
  const currentAdmin = 'SuperAdmin';
  useEffect(() => {

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataResponse = await axios.get(APIConnection.getalluserdata, { withCredentials: true });
      setRows(dataResponse.data);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
  
  // Handle opening and closing of the modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle new admin form submission
  const handleAddAdmin = async () => {
    const adminData = {
      name: newAdmin.fullName,
      status: 1, // Assuming status 1 means active
      email: newAdmin.email,
      phone: newAdmin.phone,
      address: newAdmin.address,
      designation: newAdmin.designation,
      password: newAdmin.password,
      org_id: newAdmin.organizationId,
      image: imageBase64, // Base64 image string
    };

    try {
      const response = await axios.post('http://192.168.13.150:3001/add-admin', adminData);
      if (response.status === 200) {
        setRows([...rows, { id: rows.length + 1, ...adminData, role: 'Admin', approval: 'Approved', contactNo: newAdmin.phone }]);
        handleClose();
        alert('Admin added successfully!');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert(`Failed to add admin: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));

    // Convert image to Base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result.split(',')[1]); // Get Base64 part without data:image prefix
    };
    reader.readAsDataURL(file);
  };
  // Handle image upload


  // Handle approval for normal users


  // Handle status toggle
  const toggleStatus = async (id, currentStatus) => {
    // Determine the new status value based on the current status
    const newStatus = currentStatus === 2 ? 3 : 2;

    try {
      // Make the PUT request to update the status
      await axios.put(
        `http://192.168.13.150:3001/updateuserstatus/${id}`,
        { status: newStatus },
        { withCredentials: true } // Include credentials for the request
      );
      
      // Update the rows state with the new status
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, status: newStatus } : row
      );
      setRows(updatedRows);
      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(`Failed to update status: ${error.response?.data?.message || error.message}`);
    }
  };

  // Form fields for the new admin modal
  const handleChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Contact No', width: 150 },
    { field: 'designation', headerName: 'Designation', width: 130 },
    { field: 'role', headerName: 'Role', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        // Map status values to labels
        const statusLabel = params.row.status === 2 ? 'Active' : 'Deactivated';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BlinkingDot status={statusLabel} />
            <Typography sx={{ marginLeft: 1 }}>{statusLabel}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.status === 2 ? 'warning' : 'success'}
          sx={{
            backgroundColor: params.row.status === 2 ? '#ff9800' : '#4caf50',
            ':hover': { backgroundColor: params.row.status === 2 ? '#fb8c00' : '#43a047' }
          }}
          onClick={() => toggleStatus(params.row.id)}
        >
          {params.row.status === 2 ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];
  

  // Statistics
  const totalUsers = rows.length;
  const totalAdmins = rows.filter(row => row.role === 'Admin').length;
  const totalNormalUsers = rows.filter(row => row.role === 'User').length;

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9fafb' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        User Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={4} sx={{ marginBottom: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ backgroundColor: '#f0f4f8', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" sx={{ color: '#007aff' }}>{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ backgroundColor: '#e8f5e9', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Admins</Typography>
              <Typography variant="h4" sx={{ color: '#4caf50' }}>{totalAdmins}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ backgroundColor: '#ffebee', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Normal Users</Typography>
              <Typography variant="h4" sx={{ color: '#f44336' }}>{totalNormalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add New Admin Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginBottom: 3,
          backgroundColor: '#007aff',
          ':hover': { backgroundColor: '#005bb5' }
        }}
        onClick={handleOpen}
      >
        Add New Admin
      </Button>

      {/* Data Table */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {/* Add New Admin Modal */}
      <Modal open={open} onClose={handleClose}>
        <Paper sx={{ padding: 3, width: '600px', margin: 'auto', marginTop: '50px' }}>
          <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
            Register
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Avatar src={image} sx={{ width: 80, height: 80, marginBottom: 1 }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="icon-button-file"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="icon-button-file">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <CameraAltIcon /> Upload
              </IconButton>
            </label>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Name" name="fullName" fullWidth value={newAdmin.fullName} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Email" name="email" fullWidth value={newAdmin.email} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Phone" name="phone" fullWidth value={newAdmin.phone} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Address" name="address" fullWidth value={newAdmin.address} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><HomeIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Designation" name="designation" fullWidth value={newAdmin.designation} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><BusinessIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Organization ID" name="organizationId" fullWidth value={newAdmin.organizationId} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Password" name="password" type="password" fullWidth value={newAdmin.password} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth value={newAdmin.confirmPassword} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment> }} />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="error" sx={{ color: '#f44336', borderColor: '#f44336', ':hover': { backgroundColor: '#ffebee' } }}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} variant="contained" color="primary" sx={{ backgroundColor: '#007aff', ':hover': { backgroundColor: '#005bb5' } }}>
              Register
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Users;
