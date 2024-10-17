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
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search'; // Import the Search Icon
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

const History = () => {
  const [data, setData] = useState([]); // Ensure `data` is initialized as an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Keep track of loading state
  const [error, setError] = useState(null); // For error handling

  // Fetch data from an API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${APIConnection.mainapi}/gethistorydata`, {
          withCredentials: true, // Assuming credentials are needed
        });

        if (Array.isArray(response.data)) {
          setData(response.data); // Set data only if it's an array
        } else {
          setError('Data format is incorrect'); // Handle unexpected data format
        }
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error('Error fetching history data:', error);
        setError('Error fetching history data'); // Set error message
        setLoading(false); // Stop loading even in case of error
      }
    };

    fetchData();
  }, []);

  // Filter data based on the search term (case-insensitive)
  const filteredData = Array.isArray(data)
    ? data.filter((row) =>
        (row.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : []; // Default to empty array if `data` is not valid

  if (loading) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">Loading history data...</Typography>
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
          History
        </Typography>

        {/* Small Search Bar with Search Icon aligned to the top right */}
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

      {/* Table for History */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Table aria-label="history table">
          <TableHead>
            <TableRow>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Booking ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Full Name</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Visitor Pass ID</Typography></StyledTableCell>
              <StyledTableCell><Typography sx={{ fontWeight: 'bold' }}>Status</Typography></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{row.id}</StyledTableCell>
                  <StyledTableCell>{row.booking_id}</StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>{row.vistor_id}</StyledTableCell>
                  <StyledTableCell>
                    <Typography
                      sx={{
                        color: row.status === '5' ? '#4caf50' : '#f44336', // Green for Completed (status 5), Red otherwise
                        fontWeight: 'bold',
                      }}
                    >
                      {row.status === '5' ? 'Completed' : 'Incomplete'} {/* Display 'Completed' for 5 and 'Incomplete' otherwise */}
                    </Typography>
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

export default History;
