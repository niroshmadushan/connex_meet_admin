import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, IconButton, Avatar, Menu, Box, 
  TextField, Button, Divider, Typography, CircularProgress 
} from '@mui/material';
import ReactTypingEffect from 'react-typing-effect';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';  // Import js-cookie

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState(null);  // Profile data
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [newProfileData, setNewProfileData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch Profile Data on Component Load
  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = Cookies.get('id');  // Get user ID from cookies
      console.log('User ID from cookies:', userId);  // Debugging log

      if (!userId) {
        Swal.fire('Error!', 'User ID not found in cookies. Please log in.', 'error');
        setLoading(false);
        return;
      }

      const apiLink = `http://192.168.13.6:3001/profile/${userId}`;

      try {
        const response = await axios.get(apiLink, { withCredentials: true });

        const profile = response.data;
        if (profile.image) {
          // Construct a data URL from Base64 data
          profile.profileImage = `data:image/jpeg;base64,${profile.image}`;
        }

        setProfileData(profile);  // Store profile data in state
        setNewProfileData(profile);  // Initialize the form with profile data
      } catch (error) {
        Swal.fire('Error!', 'Failed to load profile data.', 'error');
      } finally {
        setLoading(false);  // Stop the loading spinner
      }
    };

    fetchProfileData();
  }, []);  // Run only on component mount

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditMode(false);
    setPasswordMode(false);
  };

  const handleSaveProfile = async () => {
    const apiLink = `http://192.168.13.6:3001/profile`;

    try {
      await axios.put(apiLink, newProfileData, { withCredentials: true });
      setProfileData(newProfileData);  // Update profile in the UI
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
      handleMenuClose();
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error!', 'New passwords do not match!', 'error');
      return;
    }

    try {
      const userId = profileData.id;  // Use the ID from the profile data
      await axios.post(
        `http://192.168.13.6:3001/password`,
        { id: userId, ...passwordData },
        { withCredentials: true }
      );

      Swal.fire('Success!', 'Password changed successfully!', 'success');
      handleMenuClose();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Failed to change password.', 'error');
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewProfileData({ ...newProfileData, profileImage: imageUrl });
    }
  };

  const formatDateTime = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${formattedDate}, ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  if (loading) return <CircularProgress />;

  if (!profileData) {
    return <Typography color="error">Failed to load profile data.</Typography>;
  }

  return (
    <AppBar 
      position="sticky" 
      sx={{ borderRadius: '20px', background: 'linear-gradient(to right, #0d47a1, #1976d2, #001f3f)' }}
    >
      <Toolbar>
        {/* Typing Effect */}
        <Box sx={{ flexGrow: 1 }}>
          <ReactTypingEffect
            text={["Welcome to Connex Digital World", "Introducing New Visitor Management Platform"]}
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

        {/* Live Time */}
        <Box sx={{ textAlign: 'right', marginRight: 4, color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatDateTime(currentTime)}
          </Typography>
        </Box>

        {/* Profile Icon */}
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar alt="Profile" src={profileData?.profileImage || '/default-avatar.png'} />
        </IconButton>

        {/* Profile Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <Box sx={{ padding: 2, width: 300 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar src={profileData?.profileImage || '/default-avatar.png'} sx={{ width: 100, height: 100, marginBottom: 2 }} />
              <Button variant="outlined" component="label">
                Change Image
                <input type="file" hidden accept="image/*" onChange={handleProfileImageChange} />
              </Button>
            </Box>

            {editMode ? (
              <>
                <TextField fullWidth label="Full Name" value={newProfileData.name || ''} onChange={(e) => setNewProfileData({ ...newProfileData, name: e.target.value })} />
                <TextField fullWidth label="Contact Number" value={newProfileData.contact || ''} onChange={(e) => setNewProfileData({ ...newProfileData, contact: e.target.value })} />
                <Button fullWidth variant="contained" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Typography variant="subtitle1" align="center">{profileData.name}</Typography>
                <Typography variant="body2" align="center">{profileData.email}</Typography>
                <Button fullWidth variant="contained" onClick={() => setEditMode(true)}>Edit Profile</Button>
              </>
            )}
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
