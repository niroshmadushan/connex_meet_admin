import React, { useState } from 'react';
import {
  Box, Button, Modal, TextField, Typography, Paper, Grid, Card, CardContent,IconButton, Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { keyframes } from '@emotion/react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
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
const initialRows = [
  { id: 1, fullName: 'John Admin', email: 'admin.john@example.com', contactNo: '123-456-7890', employeeId: 'EMP001', role: 'Admin', status: 'Active', approval: 'Approved' },
  { id: 2, fullName: 'Jane User', email: 'jane.user@example.com', contactNo: '987-654-3210', employeeId: 'EMP002', role: 'User', status: 'Pending', approval: 'Pending' },
  { id: 3, fullName: 'Michael Admin', email: 'michael.admin@example.com', contactNo: '564-897-1234', employeeId: 'EMP003', role: 'Admin', status: 'Active', approval: 'Approved' },
  { id: 4, fullName: 'Alice User', email: 'alice.user@example.com', contactNo: '456-789-0123', employeeId: 'EMP004', role: 'User', status: 'Active', approval: 'Pending' },
];

const Users = () => {
  const [rows, setRows] = useState(initialRows);
  const [open, setOpen] = useState(false);
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

  // Handle opening and closing of the modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle new admin form submission
  const handleAddAdmin = () => {
    const newId = rows.length + 1;
    const newAdminData = {
      id: newId,
      ...newAdmin,
      role: 'Admin',
      status: 'Active',
      approval: 'Approved',
      createdBy: currentAdmin,
    };
    setRows([...rows, newAdminData]);
    handleClose();
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  // Handle approval for normal users
  const handleApproval = (id) => {
    const updatedRows = rows.map(row =>
      row.id === id ? { ...row, approval: 'Approved' } : row
    );
    setRows(updatedRows);
  };

  // Handle status toggle
  const toggleStatus = (id) => {
    const updatedRows = rows.map(row =>
      row.id === id
        ? { ...row, status: row.status === 'Active' ? 'Deactivated' : 'Active' }
        : row
    );
    setRows(updatedRows);
  };

  // Form fields for the new admin modal
  const handleChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'contactNo', headerName: 'Contact No', width: 150 },
    { field: 'employeeId', headerName: 'Employee ID', width: 130 },
    { field: 'role', headerName: 'Role', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BlinkingDot status={params.row.status} />
          <Typography sx={{ marginLeft: 1 }}>{params.row.status}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.status === 'Active' ? 'warning' : 'success'}
          sx={{
            backgroundColor: params.row.status === 'Active' ? '#ff9800' : '#4caf50',
            ':hover': { backgroundColor: params.row.status === 'Active' ? '#fb8c00' : '#43a047' }
          }}
          onClick={() => toggleStatus(params.row.id)}
        >
          {params.row.status === 'Active' ? 'Deactivate' : 'Activate'}
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
        <Paper sx={{ padding: 3, width: '450px', margin: 'auto', marginTop: '50px' }}>
          <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
            Register
          </Typography>

          {/* Avatar and Upload Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Avatar
              src={image}
              sx={{ width: 80, height: 80, marginBottom: 1 }}
            />
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
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="fullName"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.fullName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Designation"
                name="designation"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.designation}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Organization ID"
                name="organizationId"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.organizationId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                fullWidth
                sx={{ marginBottom: 2 }}
                value={newAdmin.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="error"
              sx={{
                color: '#f44336',
                borderColor: '#f44336',
                ':hover': { backgroundColor: '#ffebee' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAdmin}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#007aff',
                ':hover': { backgroundColor: '#005bb5' }
              }}
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Users;
