import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography } from '@mui/material';

const UserForm = ({ user, onSubmit }) => {
  // Initial state for user data (if editing, pre-fill the form with user data)
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'User',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation: Ensure name and email are not empty
    if (!userData.name || !userData.email) {
      alert('Please fill out all fields');
      return;
    }

    // Call the onSubmit function passed as a prop (you can replace this with an API call)
    onSubmit(userData);

    // Clear form fields after submission
    setUserData({
      name: '',
      email: '',
      role: 'User',
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}
    >
      <Typography variant="h6" gutterBottom>
        {user ? 'Edit User' : 'Create New User'}
      </Typography>

      {/* Name Field */}
      <TextField
        label="Full Name"
        name="name"
        fullWidth
        value={userData.name}
        onChange={handleInputChange}
        required
        margin="normal"
      />

      {/* Email Field */}
      <TextField
        label="Email"
        name="email"
        type="email"
        fullWidth
        value={userData.email}
        onChange={handleInputChange}
        required
        margin="normal"
      />

      {/* Role Dropdown Field */}
      <TextField
        label="Role"
        name="role"
        select
        fullWidth
        value={userData.role}
        onChange={handleInputChange}
        required
        margin="normal"
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="User">User</MenuItem>
      </TextField>

      {/* Submit Button */}
      <Button type="submit" fullWidth variant="contained" color="primary">
        {user ? 'Update User' : 'Create User'}
      </Button>
    </Box>
  );
};

export default UserForm;
