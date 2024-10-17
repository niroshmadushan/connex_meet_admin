import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Fade,
} from '@mui/material';
import { styled } from '@mui/system';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios'; // Assuming you're using axios for API calls
import APIConnection from '../config'; // Import API connection settings

// Styled components for premium look and feel
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9', // Light background for every other row
  },
  '&:hover': {
    backgroundColor: '#eaf3ff', // Light blue hover effect
    transition: 'background-color 0.3s ease-in-out', // Smooth transition
  },
  transition: 'all 0.3s', // Smooth hover animation
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none',
  padding: '8px 16px', // Thinner padding for more compact rows
  fontSize: '14px', // Slightly smaller font for a sleek look
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px', // Rounded corners for input fields
    '& fieldset': {
      borderColor: '#e0e0e0', // Light border
    },
    '&:hover fieldset': {
      borderColor: '#007aff', // Blue border on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#007aff', // Blue border when focused
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#007aff',
  color: 'white',
  borderRadius: '20px',
  padding: '10px 24px',
  fontWeight: 'bold',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#005bb5',
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)', // Shadow effect on hover
    transform: 'translateY(-2px)', // Slight raise on hover
    transition: 'all 0.3s ease-in-out',
  },
  transition: 'all 0.3s ease-in-out',
}));

const NewRequests = () => {
  // Initial data fetched from API will include only ID, Booking ID, and Full Name
  const [data, setData] = useState([]); // API data state
  const [wifiPassword, setWifiPassword] = useState(false); // State for WiFi checkbox
  const [submitted, setSubmitted] = useState(false); // State to show form submission animation
  const [loading, setLoading] = useState(true); // Loading state for data fetch

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APIConnection.mainapi}/getnewdata`, {
          withCredentials: true, // Assuming credentials are needed
        });
        const initialData = response.data.map((item) => ({
          id: item.id,
          bookingId: item.booking_id,
          fullName: item.name,
          visitorPassId: '', // Initially empty, to be filled by user
        }));
        setData(initialData);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching requests data:', error);
        setLoading(false);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch data from server!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchData();
  }, []);

  // Handle change for Visitor Pass ID input
  const handleVisitorPassChange = (index, value) => {
    const updatedData = [...data];
    updatedData[index].visitorPassId = value;
    setData(updatedData);
  };

  // Handle WiFi password checkbox change
  const handleWifiCheckboxChange = (event) => {
    setWifiPassword(event.target.checked);
  };

  // Validation function to check if all fields are filled
  const validateForm = () => {
    for (const item of data) {
      if (!item.visitorPassId) {
        return false; // Return false if any Visitor Pass ID is missing
      }
    }
    return true; // All fields are filled
  };

  // Handle form submit
  const handleSubmit = () => {
    if (!validateForm()) {
      // If any required field is missing, show error alert
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all Visitor Pass IDs!',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f44336', // Red confirm button
      });
    } else {
      // Success alert if all fields are valid
      Swal.fire({
        title: 'Success!',
        text: `Form submitted successfully. WiFi password ${wifiPassword ? 'requested' : 'not requested'}.`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#007aff', // Blue confirm button
      });
      setSubmitted(true); // Show submission animation
      setTimeout(() => setSubmitted(false), 2000); // Reset after 2 seconds
    }
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">Loading requests data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
        New Requests
      </Typography>

      {/* Table with data from API */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Table aria-label="new requests table">
          <TableHead>
            <TableRow>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Booking ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Full Name</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Visitor Pass ID</Typography></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell>{row.bookingId}</StyledTableCell>
                <StyledTableCell>{row.fullName}</StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    label="Visitor Pass ID"
                    variant="outlined"
                    size="small"
                    value={row.visitorPassId}
                    onChange={(e) => handleVisitorPassChange(index, e.target.value)}
                    fullWidth={false}
                    sx={{ width: '150px' }} // Set smaller width for Visitor Pass ID
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Align WiFi Password Checkbox and Submit Button to the bottom-right */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: 3,
        }}
      >
        {/* WiFi Password Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={wifiPassword}
              onChange={handleWifiCheckboxChange}
              sx={{
                '&.Mui-checked': { color: '#007aff' }, // Blue color when checked
              }}
            />
          }
          label="Request WiFi Password"
          sx={{ marginRight: 2 }}
        />

        {/* Submit Button with Animation */}
        <Fade in={!submitted} timeout={500}>
          <StyledButton onClick={handleSubmit}>
            Submit
          </StyledButton>
        </Fade>
      </Box>
    </Box>
  );
};

export default NewRequests;
