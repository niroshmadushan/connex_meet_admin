import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, IconButton, Avatar, Menu, Box, 
  TextField, Button, Typography, CircularProgress, Dialog, 
  DialogTitle, DialogContent, DialogActions, Snackbar, Alert, 
  Stack 
} from '@mui/material';
import ReactTypingEffect from 'react-typing-effect';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';  
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
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

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = Cookies.get('id');  

      if (!userId) {
        Swal.fire('Error!', 'User ID not found in cookies. Please log in.', 'error');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${APIConnection.mainapi}/profile/${userId}`, {
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
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`${APIConnection.mainapi}/profile`, newProfileData, {
        withCredentials: true,
      });
      setProfileData(newProfileData);  
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarOpen(true);
      handleMenuClose();
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile.', 'error');
    }
  };

  const handlePasswordDialogOpen = () => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordDialogOpen(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error!', 'New passwords do not match!', 'error');
      return;
    }

    try {
      const userId = profileData.id;
      await axios.post(`${APIConnection.mainapi}/password`, {
        id: userId,
        ...passwordData,
      }, { withCredentials: true });

      Swal.fire('Success!', 'Password changed successfully!', 'success');
      handlePasswordDialogClose();
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
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${formattedDate}, ${hours}:${minutes} ${ampm}`;
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
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
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
          <Stack alignItems="center" spacing={2} sx={{ p: 3, width: 300 }}>
            <Avatar src={profileData?.profileImage || '/default-avatar.png'} sx={{ width: 100, height: 100 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {profileData?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {profileData?.email}
            </Typography>
            <Button variant="outlined" component="label">
              Change Image
              <input type="file" hidden accept="image/*" onChange={handleProfileImageChange} />
            </Button>
            <Button fullWidth variant="outlined" startIcon={<LockIcon />} onClick={handlePasswordDialogOpen}>
              Change Password
            </Button>
          </Stack>
        </Menu>
      </Toolbar>

      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            margin="dense"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="dense"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            margin="dense"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} startIcon={<CancelIcon />}>Cancel</Button>
          <Button onClick={handleChangePassword} startIcon={<SaveIcon />} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;
