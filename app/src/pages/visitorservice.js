import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import axios from 'axios'; // Assuming you use axios for API calls
import Visibility from '@mui/icons-material/Visibility'; // Icon for showing the password
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Icon for hiding the password
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import APIConnection from '../config'; // Assuming you have a config for API endpoints

const Service = () => {
  // State to manage username and password
  const [username, setUsername] = useState(''); // Empty initially until data is fetched
  const [password, setPassword] = useState(''); // Empty initially until data is fetched
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit modes
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch WiFi credentials from the server
  useEffect(() => {
    const fetchWiFiCredentials = async () => {
      try {
        const response = await axios.get(`${APIConnection.mainapi}/getwifi`, {
          withCredentials: true, // Ensures that credentials (cookies, tokens) are sent with the request
        });
        const { username, password } = response.data.data[0]; // Destructure username and password
        setUsername(username); // Set username in state
        setPassword(password); // Set password in state
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching WiFi credentials:', error);
        setLoading(false); // Stop loading even if there's an error
        Swal.fire('Error', 'Failed to load WiFi credentials.', 'error'); // Show error alert
      }
    };

    fetchWiFiCredentials(); // Call the fetch function on component mount
  }, []);

  // Function to handle saving the updated values
  const handleSave = async () => {
    try {
      setIsEditing(false);
      // Send updated data to backend
      const response = await axios.post(`${APIConnection.mainapi}/updatepasswifi`, { username, password }, {
        withCredentials: true, // Ensure that credentials are sent with the request
      });
      console.log('WiFi credentials updated:', response.data);
      
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'WiFi credentials have been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error updating WiFi credentials:', error);

      // Show error alert
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update WiFi credentials. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">Loading WiFi credentials...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        WiFi Service
      </Typography>

      <Card sx={{ maxWidth: 400, margin: '0 auto', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            WiFi Credentials
          </Typography>

          {/* Username Field */}
          <TextField
            label="WiFi Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!isEditing}
            sx={{ marginBottom: 2 }}
          />

          {/* Password Field with Eye Icon */}
          <TextField
            label="WiFi Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEditing}
            type={showPassword ? 'text' : 'password'} // Toggle between text and password
            sx={{ marginBottom: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    disabled={!isEditing} // Disable the button if not in edit mode
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Edit and Save Button */}
          {isEditing ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
              sx={{
                backgroundColor: '#007aff',
                '&:hover': { backgroundColor: '#005bb5' },
                fontWeight: 'bold',
              }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={() => setIsEditing(true)}
              sx={{
                backgroundColor: '#007aff',
                '&:hover': { backgroundColor: '#005bb5' },
                fontWeight: 'bold',
              }}
            >
              Edit Credentials
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Service;
