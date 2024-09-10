import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Box, TextField, Button, Divider } from '@mui/material';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    contact: '123-456-7890',
    empId: 'EMP12345',
    profileImage: '/path-to-profile-image.jpg',
  });

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditMode(false);
    setPasswordMode(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handlePasswordClick = () => {
    setPasswordMode(true);
  };

  const handleSaveProfile = () => {
    // Save profile logic here (e.g., API call)
    setEditMode(false);
    setPasswordMode(false);
    handleMenuClose();
  };

  const handleProfileImageChange = (event) => {
    // Handle profile image change (e.g., upload logic)
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, profileImage: imageUrl });
    }
  };

  return (
    <>
      {/* Make the AppBar sticky to stay at the top during scrolling */}
      <AppBar position="sticky" sx={{borderRadius:'20px'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          {/* Profile Icon */}
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar alt="Profile" src={profileData.profileImage} />
          </IconButton>

          {/* Profile Popup */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: '45px', borderRadius: 2 }} // Added borderRadius for rounded corners
            PaperProps={{
              sx: {
                borderRadius: '16px', // Rounded corners for the entire menu
              },
            }}
          >
            <Box sx={{ padding: 2, width: 300, borderRadius: '16px' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  alt="Profile"
                  src={profileData.profileImage}
                  sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
                {/* Profile Image Change */}
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ marginBottom: 2 }}
                >
                  Change Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                </Button>
              </Box>

              {editMode ? (
                <>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    defaultValue={profileData.name}
                    sx={{ marginBottom: 2, borderRadius: '8px' }} // Rounded corners for input
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    defaultValue={profileData.email}
                    sx={{ marginBottom: 2, borderRadius: '8px' }}
                  />
                  <TextField
                    fullWidth
                    label="Contact Number"
                    variant="outlined"
                    defaultValue={profileData.contact}
                    sx={{ marginBottom: 2, borderRadius: '8px' }}
                  />
                  <TextField
                    fullWidth
                    label="Employee ID"
                    variant="outlined"
                    defaultValue={profileData.empId}
                    sx={{ marginBottom: 2, borderRadius: '8px' }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    sx={{ marginTop: 2, borderRadius: '8px' }} // Rounded corners for button
                  >
                    Save Changes
                  </Button>
                </>
              ) : passwordMode ? (
                <>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    variant="outlined"
                    sx={{ marginBottom: 2, borderRadius: '8px' }}
                  />
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    variant="outlined"
                    sx={{ marginBottom: 2, borderRadius: '8px' }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    variant="outlined"
                    sx={{ marginBottom: 2, borderRadius: '8px' }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    sx={{ marginTop: 2, borderRadius: '8px' }}
                  >
                    Change Password
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1" align="center" sx={{ fontWeight: 'bold' }}>
                    {profileData.name}
                  </Typography>
                  <Typography variant="body2" align="center">
                    {profileData.email}
                  </Typography>
                  <Typography variant="body2" align="center">
                    Contact: {profileData.contact}
                  </Typography>
                  <Typography variant="body2" align="center">
                    Employee ID: {profileData.empId}
                  </Typography>
                  <Divider sx={{ marginY: 2 }} />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleEditClick}
                    sx={{ marginBottom: 1, borderRadius: '8px' }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={handlePasswordClick}
                    sx={{ borderRadius: '8px' }} // Rounded corners for the button
                  >
                    Change Password
                  </Button>
                </>
              )}
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
