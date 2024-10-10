import React, { useState } from 'react';
import {
  Box, TextField, Button, Grid, Paper, Typography, InputAdornment
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import GroupIcon from '@mui/icons-material/Group';
import NotesIcon from '@mui/icons-material/Notes';
import Swal from 'sweetalert2';

const AddServiceForm = () => {
  const [formDatasrc, setFormDatasrc] = useState({
    title: '',
    date: '',
    companyName: '',
    specialNote: '',
  });

  // Handle change for each input field
  const handleChangesrc = (e) => {
    setFormDatasrc({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmitsrc = (e) => {
    e.preventDefault();
    // Here you would normally submit formData to the backend
    console.log('Service data submitted:', formData);

    // Show success alert
    Swal.fire({
      title: 'Success!',
      text: 'The service has been added successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      // Clear form fields after submission
      setFormDatasrc({
        title: '',
        date: '',
        companyName: '',
        specialNote: '',
      });
    });
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Add a New Service
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmitsrc}>
          <Grid container spacing={3}>
            {/* Title Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Title"
                name="title"
                value={formDatasrc.title}
                onChange={handleChangesrc}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            {/* Date Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formDatasrc.date}
                onChange={handleChangesrc}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            {/* Company Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formDatasrc.companyName}
                onChange={handleChangesrc}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            {/* Special Note Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Note"
                name="specialNote"
                value={formDatasrc.specialNote}
                onChange={handleChangesrc}
                multiline
                rows={4}
                placeholder="Enter any special notes regarding the service"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#007aff',
                  color: '#fff',
                  ':hover': { backgroundColor: '#005bb5' },
                  transition: 'background-color 0.3s ease',
                  padding: '10px',
                  fontWeight: 'bold',
                }}
                fullWidth
              >
                Add Service
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddServiceForm;
