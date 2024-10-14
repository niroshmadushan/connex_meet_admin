import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, IconButton, Avatar, Menu, Box, 
  TextField, Button, Divider, Typography, CircularProgress, Dialog, 
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert 
} from '@mui/material';
import ReactTypingEffect from 'react-typing-effect';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';  // Import js-cookie
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [newProfileData, setNewProfileData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const bufferToBase64 = (buffer) => {
    const binary = new Uint8Array(buffer).reduce(
      (acc, byte) => acc + String.fromCharCode(byte), ''
    );
    return window.btoa(binary);
  };

  // Fetch Profile Data from Backend
  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = Cookies.get('id');  // Get user ID from cookies

      if (!userId) {
        Swal.fire('Error!', 'User ID not found in cookies. Please log in.', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://192.168.13.6:3001/profile/${userId}`, {
          withCredentials: true,
        });

        const profile = response.data;
        if (profile.image?.data) {
          const base64Image = bufferToBase64(profile.image.data);
          profile.profileImage = `data:image/jpeg;base64,${base64Image}`;
        }

        setProfileData(profile);
        setNewProfileData(profile);
      } catch (error) {
        Swal.fire('Error!', 'Failed to load profile data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditMode(false);
    setPasswordMode(false);
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`http://192.168.13.6:3001/profile`, newProfileData, {
        withCredentials: true,
      });
      setProfileData(newProfileData);  // Update UI
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarOpen(true);
      handleMenuClose();
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error!', 'Passwords do not match!', 'error');
      return;
    }

    try {
      const userId = profileData.id;
      await axios.post(`http://192.168.13.6:3001/password`, {
        id: userId,
        ...passwordData,
      }, { withCredentials: true });

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

  return (
    <AppBar 
      position="sticky" 
      sx={{ borderRadius: '20px', background: 'linear-gradient(to right, #0d47a1, #1976d2, #001f3f)' }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <ReactTypingEffect
            text={["Welcome to Connex Digital World", "New Visitor Management Platform"]}
            speed={100}
            eraseSpeed={50}
            eraseDelay={1500}
            typingDelay={500}
            cursor={"|"}
            displayTextRenderer={(text) => (
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {text}
              </Typography>
            )}
          />
        </Box>

        <Box sx={{ textAlign: 'right', marginRight: 4, color: 'white' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatDateTime(currentTime)}
          </Typography>
        </Box>

        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar alt="Profile" src={profileData?.profileImage || '/default-avatar.png'} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <Box sx={{ padding: 2, width: 300 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar src={profileData?.profileImage || '/default-avatar.png'} sx={{ width: 100, height: 100, mb: 2 }} />
              <Button variant="outlined" component="label">
                Change Image
                <input type="file" hidden accept="image/*" onChange={handleProfileImageChange} />
              </Button>
            </Box>

            {editMode ? (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newProfileData.name || ''}
                  onChange={(e) => setNewProfileData({ ...newProfileData, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={newProfileData.phone || ''}
                  onChange={(e) => setNewProfileData({ ...newProfileData, phone: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Button fullWidth variant="contained" startIcon={<SaveIcon />} onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">{profileData.name}</Typography>
                <Typography variant="body2">{profileData.email}</Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setPasswordMode(true)}
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </Box>
            )}
          </Box>
        </Menu>
      </Toolbar>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;
