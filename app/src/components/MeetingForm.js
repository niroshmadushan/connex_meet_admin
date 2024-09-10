import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const MeetingForm = () => {
  const [meetingData, setMeetingData] = useState({
    title: '',
    description: '',
    date: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingData({ ...meetingData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(meetingData);

    setMeetingData({
      title: '',
      description: '',
      date: '',
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
        Create New Meeting
      </Typography>

      <TextField
        label="Meeting Title"
        name="title"
        fullWidth
        value={meetingData.title}
        onChange={handleInputChange}
        required
        margin="normal"
      />

      <TextField
        label="Meeting Description"
        name="description"
        fullWidth
        multiline
        rows={4}
        value={meetingData.description}
        onChange={handleInputChange}
        required
        margin="normal"
      />

      <TextField
        label="Meeting Date"
        name="date"
        type="date"
        fullWidth
        value={meetingData.date}
        onChange={handleInputChange}
        InputLabelProps={{ shrink: true }}
        required
        margin="normal"
      />

      <Button type="submit" fullWidth variant="contained" color="primary">
        Create Meeting
      </Button>
    </Box>
  );
};

export default MeetingForm;
