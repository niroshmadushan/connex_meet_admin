import React, { useState } from 'react';
import { TextField, Button, Box, Typography, InputLabel } from '@mui/material';

const EventForm = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageChange = (e) => {
    setEventData({ ...eventData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('date', eventData.date);
    formData.append('image', eventData.image);

    console.log([...formData]);

    setEventData({
      title: '',
      description: '',
      date: '',
      image: null,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3, backgroundColor: 'white' }}
    >
      <Typography variant="h6" gutterBottom>
        Create New Event
      </Typography>

      <TextField
        label="Event Title"
        name="title"
        fullWidth
        value={eventData.title}
        onChange={handleInputChange}
        required
        margin="normal"
      />

      <TextField
        label="Event Description"
        name="description"
        fullWidth
        multiline
        rows={4}
        value={eventData.description}
        onChange={handleInputChange}
        required
        margin="normal"
      />

      <TextField
        label="Event Date"
        name="date"
        type="date"
        fullWidth
        value={eventData.date}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        required
        margin="normal"
      />

      <InputLabel sx={{ mt: 2 }}>Upload Event Image</InputLabel>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: '20px' }}
      />

      <Button type="submit" fullWidth variant="contained" color="primary">
        Create Event
      </Button>
    </Box>
  );
};

export default EventForm;
