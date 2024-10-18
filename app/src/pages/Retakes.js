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
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search'; // Import Search Icon
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios'; // Assuming you're using axios for API calls
import APIConnection from '../config'; // Config for API endpoints

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

const RetakeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#007aff',
  color: 'white',
  borderRadius: '20px',
  padding: '6px 12px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#005bb5',
  },
}));

const Retakes = () => {
  const [data, setData] = useState([]); // Data from API
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Keep track of loading state
  const [error, setError] = useState(null); // For error handling

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APIConnection.mainapi}/getretakedata`, {
          withCredentials: true, // Assuming credentials are needed
        });

        if (Array.isArray(response.data)) {
          setData(response.data); // Set data from API
        } else {
          setError('Data format is incorrect');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching retakes data:', error);
        setError('Error fetching retakes data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Retake action with confirmation and API call
  const handleRetake = async (index, id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to retake this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007aff',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Yes, retake it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send API request to retake status
          await axios.post(`${APIConnection.mainapi}/updateretakestatus`, {
            id: id,
          }, {
            withCredentials: true, // Ensure credentials are sent
          });

          // Update the local state to reflect the retake in UI
          const updatedData = [...data];
          updatedData[index].status = '5'; // Assuming '5' indicates retake completed
          setData(updatedData);

          // Show success message
          Swal.fire('Retaked!', 'The booking has been retaked.', 'success');
        } catch (error) {
          console.error('Error updating retake status:', error);
          Swal.fire('Error!', 'Failed to retake the booking.', 'error');
        }
      }
    });
  };

  // Filter data based on the search term (case-insensitive)
  const filteredData = data.filter((row) =>
    row.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">Loading retakes data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Retakes
        </Typography>

        {/* Small Search Bar aligned to the top right with Search Icon */}
        <TextField
          label="Search by Full Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '250px' }} // Small search bar
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table for Retakes */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Table aria-label="retakes table">
          <TableHead>
            <TableRow>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Booking ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Full Name</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Visitor Pass ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Action</Typography></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{row.id}</StyledTableCell>
                  <StyledTableCell>{row.booking_id}</StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>{row.vistor_id}</StyledTableCell>
                  <StyledTableCell>
                    {row.status === 2 ? ( // Show 'Retake' button only if status is 2
                      <RetakeButton onClick={() => handleRetake(index, row.id)}>
                        Retake
                      </RetakeButton>
                    ) : (
                      <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        Retaked
                      </Typography>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} sx={{ textAlign: 'center', color: '#888' }}>
                  No results found
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Retakes;
