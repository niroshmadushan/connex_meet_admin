import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotesIcon from '@mui/icons-material/Notes';
import RefreshIcon from '@mui/icons-material/Refresh';
import TitleIcon from '@mui/icons-material/Title';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const themeColor = {
  primary: '#007aff',
  primaryDark: '#005bb5',
  textPrimary: '#333333',
  cardBg: '#ffffff',
  buttonHover: '#005bb5',
  lightGray: '#e0e0e0',
};


// Sample Data for Rooms and Time Slots
const availableRooms = {
  '2024-09-04': ['Room 1', 'Room 2', 'Room 3'],
  '2024-09-05': ['Room 4', 'Room 5'],
};

const availableTimeSlots = {
  'Room 1': ['10:00 AM - 12:30 PM', '01:00 PM - 02:30 PM'],
  'Room 2': ['09:00 AM - 11:00 AM', '02:00 PM - 04:00 PM'],
};

const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
  return `${hours}:${minutes}`;
};

const generateTimeOptions = (start, end) => {
  const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}:00`);
  const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}:00`);
  const options = [];
  while (startTime <= endTime) {
    const timeString = startTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    options.push(timeString);
    startTime.setMinutes(startTime.getMinutes() + 15);
  }
  return options;
};

const AddSessionForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    sessionType: 'Internal',
    location: '',
    address: '',
    email: '',
    availableRooms: [],
    selectedRoom: '',
    availableSlots: [],
    selectedSlot: '',
    startTime: '',
    endTime: '',
    startTimeOptions: [],
    endTimeOptions: [],
    specialNote: '',
    refreshment: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (formData.date && formData.sessionType === 'Internal') {
      setFormData((prevData) => ({
        ...prevData,
        availableRooms: availableRooms[formData.date] || [],
        selectedRoom: '',
        availableSlots: [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
      }));
    }
  }, [formData.date, formData.sessionType]);

  useEffect(() => {
    if (formData.selectedRoom && formData.sessionType === 'Internal') {
      setFormData((prevData) => ({
        ...prevData,
        availableSlots: availableTimeSlots[formData.selectedRoom] || [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
      }));
    }
  }, [formData.selectedRoom, formData.sessionType]);

  useEffect(() => {
    if (formData.selectedSlot && formData.sessionType === 'Internal') {
      const [slotStart, slotEnd] = formData.selectedSlot.split(' - ');
      const timeOptions = generateTimeOptions(slotStart, slotEnd);
      setFormData((prevData) => ({
        ...prevData,
        startTimeOptions: timeOptions,
        endTimeOptions: timeOptions,
        startTime: '',
        endTime: '',
      }));
    }
  }, [formData.selectedSlot, formData.sessionType]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Success!',
      text: 'The session has been added successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      setFormData({
        title: '',
        date: '',
        sessionType: 'Internal',
        location: '',
        address: '',
        email: '',
        availableRooms: [],
        selectedRoom: '',
        availableSlots: [],
        selectedSlot: '',
        startTime: '',
        endTime: '',
        startTimeOptions: [],
        endTimeOptions: [],
        specialNote: '',
        refreshment: '',
      });
      navigate('/home-dashboard');
    });
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Add a New Session
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title and Session Type */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
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

            {/* Date and Session Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Session Type</InputLabel>
                <Select
                  label="Session Type"
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="External">External</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Internal Session Fields */}
            {formData.sessionType === 'Internal' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Room</InputLabel>
                    <Select
                      label="Select Room"
                      name="selectedRoom"
                      value={formData.selectedRoom}
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <RoomIcon color="primary" />
                        </InputAdornment>
                      }
                      required
                    >
                      {formData.availableRooms.map((room, index) => (
                        <MenuItem key={index} value={room}>
                          {room}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {formData.availableSlots.length > 0 && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Select Time Slot</InputLabel>
                      <Select
                        label="Select Time Slot"
                        name="selectedSlot"
                        value={formData.selectedSlot}
                        onChange={handleChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <AccessTimeIcon color="primary" />
                          </InputAdornment>
                        }
                        required
                      >
                        {formData.availableSlots.map((slot, index) => (
                          <MenuItem key={index} value={slot}>
                            {slot}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {formData.startTimeOptions.length > 0 && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Start Time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        required
                      >
                        {formData.startTimeOptions.map((option, index) => (
                          <MenuItem key={index} value={convertTo24Hour(option)}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="End Time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        required
                      >
                        {formData.endTimeOptions.map((option, index) => (
                          <MenuItem key={index} value={convertTo24Hour(option)}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </>
                )}
              </>
            )}

            {/* External Session Fields */}
            {formData.sessionType === 'External' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location Name"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}

            {/* Special Note */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Note"
                name="specialNote"
                value={formData.specialNote}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter any special notes regarding the event"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Refreshment */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Refreshment"
                name="refreshment"
                value={formData.refreshment}
                onChange={handleChange}
                multiline
                rows={2}
                placeholder="Enter refreshment details if any"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RefreshIcon color="primary" />
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
                  backgroundColor: themeColor.primary,
                  color: '#fff',
                  ':hover': {
                    backgroundColor: themeColor.primaryDark,
                  },
                  transition: 'background-color 0.3s ease',
                  padding: '10px',
                  fontWeight: 'bold',
                }}
                fullWidth
              >
                Add Session
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddSessionForm;
