import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, Box, TextField, Button, Divider, Typography } from '@mui/material';
import ReactTypingEffect from 'react-typing-effect';

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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

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
    setEditMode(false);
    setPasswordMode(false);
    handleMenuClose();
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, profileImage: imageUrl });
    }
  };

  // Format date and time together in one line
  const formatDateTime = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);

    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${formattedDate}, ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          borderRadius: '20px', 
          background: 'linear-gradient(to right, #0d47a1, #1976d2, #001f3f)', // Dark Blue Gradient
        }}
      >
        <Toolbar>
          {/* Typing Effect in Left Corner */}
          <Box sx={{ flexGrow: 1 }}>
            <ReactTypingEffect
              text={["Welcome TO Connex Digital World", "Introducing New Visitor Management Platform"]}
              speed={100}
              eraseSpeed={50}
              eraseDelay={1500}
              typingDelay={500}
              cursor={"|"}
              displayTextRenderer={(text, i) => (
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {text}
                </Typography>
              )}
            />
          </Box>

          {/* Live Time and Date on a Single Line */}
          <Box sx={{ textAlign: 'right', marginRight: 4, color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatDateTime(currentTime)}
            </Typography>
          </Box>

          {/* Profile Icon */}
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Avatar alt="Profile" src={profileData.profileImage} />
          </IconButton>

          {/* Profile Popup */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ mt: '45px', borderRadius: 2 }}
            PaperProps={{
              sx: {
                borderRadius: '16px',
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
                    sx={{ marginBottom: 2, borderRadius: '8px' }}
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
                    sx={{ marginTop: 2, borderRadius: '8px' }}
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
                    sx={{ borderRadius: '8px' }}
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
