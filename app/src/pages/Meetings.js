import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import {
  Box, Typography, Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Grid, MenuItem, Select, InputLabel, FormControl, Fade, InputAdornment, Divider, IconButton,
  Autocomplete,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/system';
import CountUp from 'react-countup';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import AddMeetingSession from '../components/AddMeetingSession';  // Import the new meeting form component
import INTMEET from './meeting/AddMeetingInternal';
import EXTMEET from './meeting/AddMeetingSession';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import APIConnection from '../config';
import EventIcon from '@mui/icons-material/Event';
import TitleIcon from '@mui/icons-material/Title';
import NotesIcon from '@mui/icons-material/Notes';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
const themeColor = {
  primary: '#007aff',
  primaryDark: '#005bb5',
};


const meetingsData = [
  { id: 1, name: 'Meeting A', date: '2024-09-12', startTime: '09:00', endTime: '10:00', location: 'Room 101', visitorCompany: 'XYZ Inc.', participant: 'John Doe', status: 'Ongoing' },
  { id: 2, name: 'Meeting B', date: '2024-09-15', startTime: '10:30', endTime: '11:30', location: 'Room 202', visitorCompany: 'ABC Corp.', participant: 'Jane Smith', status: 'Upcoming' },
  { id: 3, name: 'Meeting C', date: '2024-09-10', startTime: '14:00', endTime: '15:00', location: 'Room 303', visitorCompany: 'PQR Ltd.', participant: 'Alex Johnson', status: 'Finished' },
];

const visitorsData = [
  { id: 'V001', name: 'John Doe', phone: '123-456-7890' },
  { id: 'V002', name: 'Jane Smith', phone: '987-654-3210' },
];

const BlinkingDot = styled(FiberManualRecordIcon)(({ status }) => ({
  color: status === 'Ongoing' ? '#4caf50' : status === 'Finished' ? '#f44336' : '#ff9800',
  fontSize: '14px',
  animation: 'blinking 0.3s infinite',
  '@keyframes blinking': {
    '0%': { opacity: 0 },
    '50%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
}));

const Meetings = () => {
  const [open, setOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([])
  const [bookings, setBookings] = useState([]);
  const [newMeetingOpen, setNewMeetingOpen] = useState(false);  // Control the "Add New Meeting" modal visibility
  const [selectedMeetingType, setSelectedMeetingType] = useState(null);  // Track selected meeting type

  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [employeeEmailscn, setEmployeeEmailscn] = useState([]);
  const [empid, setempid] = useState();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [login2ModalOpen, setLogin2ModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [meetingsData, setMeetingsData] = useState([]);
  const [visitorsData, setvisitorsData] = useState([])
  const [filteredData, setFilteredData] = useState([meetingsData]);
  const getemailscnapi = APIConnection.getallorgemails;
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    availableRooms: [],
    selectedRoomId: '',
    availableSlots: [],
    selectedSlot: '',
    startTime: '',
    endTime: '',
    startTimeOptions: [],
    endTimeOptions: [],
    companyName: 'Connex IT',
    employeeName: '',
    participantList: [],
    type: 'internalmeeting',
    specialNote: '',
    refreshment: '',
    id: '',
    orgId: '',
  });
  const totalMeetings = meetingsData.length;
  const upcomingMeetings = meetingsData.filter(meeting => meeting.type === 'Upcoming').length;
  const ongoingMeetings = meetingsData.filter(meeting => meeting.type === 'Ongoing').length;
  const finishedMeetings = meetingsData.filter(meeting => meeting.type === 'Finished').length;
  // Function to open the new meeting modal
  const handleLoginOpen = () => setLoginModalOpen(true);
  const handleLoginClose = () => setLoginModalOpen(false);

  const handleLogin2Open = () => setLogin2ModalOpen(true);
  const handleLogin2Close = () => setLogin2ModalOpen(false);

  // Function to handle login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Here you can implement login logic (e.g., API call, validation, etc.)
    Swal.fire(`Welcome, ${loginData.username}!`, 'You have successfully logged in.', 'success');
    handleLoginClose();
  };

  // Handle form field changes for login modal
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };
  // Function to close all modals
  const closeAllModals = () => {
    setNewMeetingOpen(false);
  };

  // Function to handle a successful meeting addition and close the modal
  const handleSuccessfulMeetingAddition = () => {
    closeAllModals(); // Close the modal
    Swal.fire('Success!', 'The meeting has been added successfully.', 'success'); // Show success alert
  };


  const handleSuccessClose = () => {
    // Close the modal after successful meeting addition
    setNewMeetingOpen(false);
  };


  const handleNewMeetingOpen = () => {
    setSelectedMeetingType(null); // Reset meeting type
    setNewMeetingOpen(true); // Open the new meeting modal
  };
  const handleNewMeetingClose = () => setNewMeetingOpen(false);





  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  };

  const chartData = {
    labels: ['Ongoing', 'Upcoming', 'Finished'],
    datasets: [
      {
        label: 'Meetings Status',
        data: [ongoingMeetings, upcomingMeetings, finishedMeetings],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  // this modal function area

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id') || '';
    const userOrgId = localStorage.getItem('orgid') || '';
    setFormData((prevData) => ({
      ...prevData,
      id: userId,
      orgId: userOrgId,
    }));
  }, []);
  useEffect(() => {
    const empId = localStorage.getItem('id'); // Retrieve 'id' from local storage

    if (empId) {
      axios
        .get(`http://192.168.13.150:3001/email/${empId}`, { withCredentials: true })
        .then((response) => {
          // Extract the email values from the response and set the employeeEmails state
          const emails = response.data.map((item) => item.email);
          setEmployeeEmails(emails);
        })
        .catch((error) => {
          console.error('Failed to fetch employee emails:', error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const roomsResponse = await axios.get('http://192.168.13.150:3001/place', { withCredentials: true });
        setRooms(roomsResponse.data);

        const bookingsResponse = await axios.get('http://192.168.13.150:3001/bookings', { withCredentials: true });
        setBookings(bookingsResponse.data);

        const emailsResponse = await axios.get(APIConnection.getallorgemails, { withCredentials: true });
        setEmployeeEmailscn(emailsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData2();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API request and log the full response
        const response = await axios.get('http://192.168.13.150:3001/getallspecialbookingsmeetings', { withCredentials: true });
        console.log("API Response:", response);
  
        // Extract the array from the API response
        const data = response.data;
  
        // Check if the response data is a valid array
        if (!Array.isArray(data)) {
          console.error('Invalid API response structure:', data);
          return;
        }
  
        // Get the current date and time
        const currentTime = new Date();
  
        // Map over the array to extract meeting details and participants
        const meetings = data.map((item, index) => {
          const booking = item.bookingDetails;
          const participants = item.participants || [];
  
          // Convert the booking date and time to `Date` objects
          const meetingDate = booking.date; // Date in 'MM/dd/yyyy' format
          const startTime = new Date(`${meetingDate} ${booking.start_time}`);
          const endTime = new Date(`${meetingDate} ${booking.end_time}`);
  
          // Determine the meeting type: "Upcoming", "Ongoing", or "Finished"
          let type = '';
          if (currentTime < startTime) {
            type = 'Upcoming';
          } else if (currentTime >= startTime && currentTime <= endTime) {
            type = 'Ongoing';
          } else {
            type = 'Finished';
          }
  
          return {
            id: booking.id || index, // Use booking.id if available, else fallback to array index
            name: booking.title,
            date: meetingDate, // Keep the original date format
            startTime: booking.start_time, // Keep the original time format (e.g., '1:45 PM')
            endTime: booking.end_time, // Keep the original time format (e.g., '4:45 PM')
            location: `Room ID: ${booking.place_id}`,
            visitorCompany: participants.length > 0 ? participants[0].company_name : 'N/A',
            participant: participants.map((p) => p.full_name).join(', ') || 'N/A',
            status: getStatusLabel(booking.status),
            participants, // Keep the full participants array for modal display
            type, // Add the calculated type value ("Upcoming", "Ongoing", "Finished")
          };
        });
  
        // Set the meetings data to the formatted array
        setMeetingsData(meetings);
        setFilteredData(meetings); // Initialize filtered data for the table
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  


  const getStatusLabel = (status) => {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Deactive';
      case 4: return 'Active';
      default: return 'Unknown';
    }
  };

  useEffect(() => {
    let filtered = [...meetingsData];
    if (searchTerm) {
      filtered = filtered.filter((meeting) =>
        meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.visitorCompany.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((meeting) => meeting.type === statusFilter);
    }
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, meetingsData]);

  // Modal handlers
  const handleRowClick = (params) => {
    setSelectedMeeting(params.row);
    setOpen(true);
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Meeting Name', width: 150 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'startTime', headerName: 'Start Time', width: 120 },
    { field: 'endTime', headerName: 'End Time', width: 120 },
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => {
        const statusColor =
          params.value === 'Ongoing' ? '#4caf50' : params.value === 'Finished' ? '#f44336' : '#ff9800'; // Set color based on type
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BlinkingDot status={params.value} sx={{ color: statusColor, marginRight: '8px' }} />
            <Typography sx={{ color: statusColor, fontWeight: 'bold' }}>{params.value}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const statusColor =
          params.value === 'Active' ? 'green' : params.value === 'Deactive' ? '#f44336' : '#ff9800'; // Set color based on type
  
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Typography sx={{ color: statusColor, fontWeight: 'bold' }}>{params.value}</Typography>
          </Box>
        );
      },
    },
    
  ];
  
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (formData.date) {
      updateAvailableRooms();
      setFormData((prevData) => ({
        ...prevData,
        selectedRoomId: '',
        availableSlots: [],
        startTimeOptions: [],
        endTimeOptions: [],
        startTime: '',
        endTime: '',
      }));
    }
  }, [formData.date, rooms]);

  useEffect(() => {
    if (formData.selectedRoomId) {
      const selectedRoom = rooms.find((room) => room.id === formData.selectedRoomId);
      if (selectedRoom) {
        const availableTimeSlots = getAvailableTimeSlots(selectedRoom);
        setFormData((prevData) => ({
          ...prevData,
          availableSlots: availableTimeSlots,
          selectedSlot: '',
          startTimeOptions: [],
          endTimeOptions: [],
          startTime: '',
          endTime: '',
        }));
      }
    }
  }, [formData.selectedRoomId, formData.date]);

  useEffect(() => {
    if (formData.selectedSlot) {
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
  }, [formData.selectedSlot]);

  useEffect(() => {
    if (formData.startTime) {
      const [slotStart, slotEnd] = formData.selectedSlot.split(' - ');
      const endOptions = generateTimeOptions(formData.startTime, slotEnd);
      setFormData((prevData) => ({
        ...prevData,
        endTimeOptions: endOptions.slice(1),
        endTime: '',
      }));
    }
  }, [formData.startTime]);
  const handleChangecon = (e) => {
    setempid(e.target.value);
    console.log(e.target.value);
    const empId = e.target.value;
    if (empId) {
      axios
        .get(`http://192.168.13.150:3001/email/${empId}`, { withCredentials: true })
        .then((response) => {
          // Extract the email values from the response and set the employeeEmails state
          const emails = response.data.map((item) => item.email);
          setEmployeeEmails(emails);
        })
        .catch((error) => {
          console.error('Failed to fetch employee emails:', error);
        });
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailChange = (event, value) => {
    setFormData({
      ...formData,
      employeeEmail: value,
    });
  };

  const updateAvailableRooms = () => {
    if (formData.date) {
      // Filter rooms that have at least one available time slot for the selected date
      const filteredRooms = rooms.filter((room) => {
        const availableTimeSlots = getAvailableTimeSlots(room);
        return availableTimeSlots.length > 0;
      });
      setAvailableRooms(filteredRooms);
    }
  };

  const handleAddParticipant2 = () => {
    if (formData.companyName.trim() && formData.employeeName.trim()) {
      const newParticipant = {
        companyName: formData.companyName,
        employeeName: formData.employeeName,
      };
      setFormData((prevData) => ({
        ...prevData,
        participantList: [...prevData.participantList, newParticipant],
        companyName: '',
        employeeName: '',
      }));
    }
  };

  useEffect(() => {
    setFilteredData(meetingsData); // Initialize filteredData with meetingsData
  }, [meetingsData]);

  const handleAddParticipant = () => {
    if (formData.employeeEmail.trim()) {
      const newParticipant = {
        companyName: formData.companyName,
        employeeEmail: formData.employeeEmail,
      };
      setFormData((prevData) => ({
        ...prevData,
        participantList: [...prevData.participantList, newParticipant],
        employeeEmail: '',
      }));
    }
  };

  const handleDeleteParticipant = (index) => {
    const updatedList = formData.participantList.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      participantList: updatedList,
    });
  };


  const handleSubmit2 = async (e) => {
    e.preventDefault();

    // Check if the participant list is empty before proceeding
    if (formData.participantList.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Please add at least one participant before submitting the meeting.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Prevent form submission if no participants
    }

    const formattedDate = formData.date ? format(new Date(formData.date), 'MM/dd/yyyy') : '';

    // Prepare the data for the API request
    const bookingData = {
      title: formData.title,
      date: formattedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      specialNote: formData.specialNote,
      refreshment: formData.refreshment,
      selectedRoomId: formData.selectedRoomId,
      companyName: formData.companyName,
      employeeName: formData.employeeName,
      participantList: formData.participantList,
      type: 'meeting',
      id: empid,// ID from local storage
      orgId: formData.orgId, // Org ID from local storage
    };

    try {
      // Send the booking data to the API endpoint
      await axios.post('http://192.168.13.150:3001/add-booking', bookingData, {
        withCredentials: true,
      });
      handleLogin2Close();
      // Show success message and reset the form
      Swal.fire({
        title: 'Success!',
        text: 'The meeting has been added successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        setFormData({
          title: '',
          date: '',
          availableRooms: [],
          selectedRoom: '',
          selectedRoomId: '',
          availableSlots: [],
          selectedSlot: '',
          startTime: '',
          endTime: '',
          companyName: '',
          employeeName: '',
          participantList: [],
          type: 'meeting',
          specialNote: '',
          refreshment: '',
          id: '',
          orgId: '',
        });
        navigate('/connex_meet_emp/dash');
      });
    } catch (error) {
      // Handle the error if the POST request fails
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the meeting. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error adding booking:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the participant list is empty before proceeding
    if (formData.participantList.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Please add at least one participant before submitting the meeting.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Prevent form submission if no participants are present
    }

    const formattedDate = formData.date ? format(new Date(formData.date), 'MM/dd/yyyy') : '';

    const bookingData = {
      title: formData.title,
      date: formattedDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type,
      specialNote: formData.specialNote,
      refreshment: formData.refreshment,
      selectedRoomId: formData.selectedRoomId,
      participantList: formData.participantList,
      id: empid,
      orgId: null,
    };

    try {
      await axios.post('http://192.168.13.150:3001/add-booking-int', bookingData, { withCredentials: true });
      handleLoginClose();
      Swal.fire('Success!', 'The meeting has been added successfully.', 'success');




    } catch (error) {
      Swal.fire('Error!', 'There was a problem adding the meeting. Please try again.', 'error');
      console.error('Error adding booking:', error);
    }
  };

  const generateTimeOptions = (start, end, step = 15) => {
    const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}:00`);
    const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}:00`);
    const options = [];

    while (startTime <= endTime) {
      const timeString = convertTo12Hour(startTime.toTimeString().substring(0, 5)); // Format to 12-hour for display
      options.push(timeString);
      startTime.setMinutes(startTime.getMinutes() + step);
    }

    return options;
  };

  const convertTo12Hour = (time24h) => {
    let [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert back to 12-hour format
    hours = hours % 12 || 12; // Adjust 0 to 12 for midnight
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    // Handle "12:00 AM" and "12:00 PM" edge cases
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else {
      hours = modifier === 'PM' ? (parseInt(hours, 10) + 12).toString() : hours;
    }

    return `${hours.padStart(2, '0')}:${minutes}`; // Ensure "01" format instead of "1"
  };

  const getAvailableTimeSlots = (room) => {
    const startTime = room.start_time; // Already in 12-hour format
    const endTime = room.end_time;     // Already in 12-hour format

    // Convert the 12-hour time to 24-hour format for internal calculations
    const convertTime = (time) => {
      const [timePart, period] = time.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      const adjustedHours = period === 'PM' && hours !== 12 ? hours + 12 : hours;
      return adjustedHours * 100 + minutes; // Use 100-based format for comparisons
    };

    const roomStart = convertTime(startTime);
    const roomEnd = convertTime(endTime);

    const roomBookings = bookings.filter(
      (booking) => booking.place_id === room.id && isSameDay(new Date(booking.date), new Date(formData.date))
    );

    if (roomBookings.length === 0) {
      return [`${startTime} - ${endTime}`]; // If no bookings, the entire slot is free
    }

    // Sort and find free slots
    const sortedBookings = roomBookings
      .map((booking) => ({
        start: convertTime(booking.start_time),
        end: convertTime(booking.end_time),
      }))
      .sort((a, b) => a.start - b.start);

    const freeSlots = [];
    let lastEndTime = roomStart;

    sortedBookings.forEach((booking) => {
      if (lastEndTime < booking.start) {
        freeSlots.push({ start: lastEndTime, end: booking.start });
      }
      lastEndTime = Math.max(lastEndTime, booking.end);
    });

    if (lastEndTime < roomEnd) {
      freeSlots.push({ start: lastEndTime, end: roomEnd });
    }

    // Convert slots back to 12-hour format for display
    const formatTime = (time) => {
      const hours = Math.floor(time / 100);
      const minutes = time % 100;
      return convertTo12Hour(`${hours}:${minutes.toString().padStart(2, '0')}`);
    };

    return freeSlots.map((slot) => `${formatTime(slot.start)} - ${formatTime(slot.end)}`);
  };








  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Meetings Overview
        </Typography>

        {/* Wrap the buttons in a Box to align them to the right */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleLoginOpen}
            sx={{
              backgroundColor: '#007aff',
              ':hover': {
                backgroundColor: '#005bb5',
              },
            }}
          >
            Add New Internal Meeting
          </Button>

          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleLogin2Open}
            sx={{
              backgroundColor: '#007aff',
              ':hover': {
                backgroundColor: '#005bb5',
              },
            }}
          >
            Add New External Meeting
          </Button>
        </Box>
      </Box>


      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
            <Typography variant="h6">Total Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007aff' }}>
              <CountUp end={totalMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#f0f4f8', borderRadius: 2 }}>
            <Typography variant="h6">Upcoming Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              <CountUp end={upcomingMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: 2 }}>
            <Typography variant="h6">Ongoing Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              <CountUp end={ongoingMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 3, textAlign: 'center', backgroundColor: '#ffebee', borderRadius: 2 }}>
            <Typography variant="h6">Finished Meetings</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              <CountUp end={finishedMeetings} duration={1.5} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ marginBottom: 3, backgroundColor: '#fff', padding: 2, borderRadius: 2, boxShadow: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextField
              label="Search by Meeting Name or Visitor Company"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Finished">Finished</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id || `row-${Math.random()}`}  // Provide a unique `id` for each row
        onRowClick={handleRowClick}
        sx={{ height: 400, backgroundColor: '#fff', borderRadius: 2 }}
      />


      <Box sx={{ marginTop: 4 }}>
        <Paper sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Meetings Status Overview
          </Typography>
          <Box sx={{ height: '250px', width: '100%' }}>
            <Line data={chartData} />
          </Box>
        </Paper>
      </Box>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <Modal open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',mt:2 }}>
          <Fade in={open}>
          <Paper sx={{ padding: 4, width: '80%', maxWidth: '600px',height:'80vh',overflowY:'scroll' }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Meeting Details
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}><Typography><strong>Meeting Name:</strong></Typography></Grid>
                <Grid item xs={6}><Typography>{selectedMeeting.name}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Date:</strong></Typography></Grid>
                <Grid item xs={6}><Typography>{selectedMeeting.date}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Start Time:</strong></Typography></Grid>
                <Grid item xs={6}><Typography>{selectedMeeting.startTime}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>End Time:</strong></Typography></Grid>
                <Grid item xs={6}><Typography>{selectedMeeting.endTime}</Typography></Grid>
                <Grid item xs={6}><Typography><strong>Location:</strong></Typography></Grid>
                <Grid item xs={6}><Typography>{selectedMeeting.location}</Typography></Grid>
                <Grid item xs={12}><Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>Participants</Typography></Grid>

              </Grid>

              <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>
                Visitor Team Information
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company Name</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMeeting.participants.map((participant) => (
                      <TableRow key={participant.id}>

                        <TableCell>{participant.company_name}</TableCell>
                        <TableCell>{participant.full_name}</TableCell>
                        <TableCell>{participant.contact_no || 'N/A'}</TableCell>
                        <TableCell>
                          {participant.status === 2 ? 'Approved' : participant.status === 3 ? 'Rejected' : 'N/A'}
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ textAlign: 'right', marginTop: 2 }}>
                <Button onClick={handleClose} variant="contained" color="primary">
                  Close
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Modal>
      )}

      {/* New Meeting Form Modal */}
      <Modal
        open={loginModalOpen}
        onClose={handleLoginClose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '20px',
          overflowY: 'auto',  // Enable vertical scrolling
          backdropFilter: 'blur(5px)',  // Blur the background when modal is open
        }}
      >
        <Fade in={loginModalOpen}>
          <Box
            sx={{
              width: '500px',
              maxWidth: '95%',
              maxHeight: '90%',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              p: '30px',
              boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
              overflowY: 'auto',  // Ensure the modal content is scrollable
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
              Add a New Internal Meeting
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Conducted By Selector */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Conducted By</InputLabel>
                    <Select
                      label="Conducted By"
                      name="conductedBy"
                      value={formData.conductedBy}
                      onChange={handleChangecon}
                      required
                    >
                      {employeeEmailscn.map((org) => (
                        <MenuItem key={org.id} value={org.id}>
                          {org.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Meeting Title Field */}
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

                {/* Date Picker and Room Selector */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon color="primary" />
                        </InputAdornment>
                      ),
                      inputProps: {
                        min: format(new Date(), 'yyyy-MM-dd'),  // Set the minimum date to today's date
                      },
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Room</InputLabel>
                    <Select
                      label="Select Room"
                      name="selectedRoomId"
                      value={formData.selectedRoomId}
                      onChange={handleChange}
                      required
                    >
                      {availableRooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Available Time Slot Selector */}
                {formData.availableSlots.length > 0 && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Select Time Slot</InputLabel>
                      <Select
                        label="Select Time Slot"
                        name="selectedSlot"
                        value={formData.selectedSlot}
                        onChange={handleChange}
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

                {/* Start and End Time Selectors */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Start Time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  >
                    {formData.startTimeOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
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
                    required
                  >
                    {formData.endTimeOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Participant Email Selector */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={employeeEmails}
                    value={formData.employeeEmail}
                    onChange={handleEmailChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Employee Email"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Add Participant Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleAddParticipant}
                    sx={{ backgroundColor: themeColor.primary, color: '#fff', ':hover': { backgroundColor: themeColor.primaryDark } }}
                    fullWidth
                  >
                    Add Participant
                  </Button>
                </Grid>

                {/* Participant List */}
                {formData.participantList.length > 0 && (
                  <Grid item xs={12}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Employee Email</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.participantList.map((participant, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{participant.employeeEmail}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleDeleteParticipant(index)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                )}

                {/* Special Note and Refreshment Details */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Special Note"
                    name="specialNote"
                    value={formData.specialNote}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Enter any special notes regarding the event"
                  />
                </Grid>

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
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: themeColor.primary, color: '#fff', ':hover': { backgroundColor: themeColor.primaryDark } }}
                  >
                    Add Meeting
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ textAlign: 'right', mt: 3 }}>

            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* New Meeting Form Modal */}
      <Modal
        open={login2ModalOpen}
        onClose={handleLogin2Close}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '20px',
          overflowY: 'auto',  // Enable vertical scrolling
          backdropFilter: 'blur(5px)',  // Blur the background when modal is open
        }}
      >
        <Fade in={login2ModalOpen}>
          <Box
            sx={{
              width: '500px',
              maxWidth: '95%',
              maxHeight: '90%',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              p: '30px',
              boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
              overflowY: 'auto',  // Ensure the modal content is scrollable
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
              Add a New External Meeting
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit2}>

              <Grid container spacing={3}>
                {/* Title, Date, Room, Time Slots, Start and End Time */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Conducted By</InputLabel>
                    <Select
                      label="Conducted By"
                      name="conductedBy"
                      value={formData.conductedBy}
                      onChange={handleChangecon}
                      required
                    >
                      {employeeEmailscn.map((org) => (
                        <MenuItem key={org.id} value={org.id}>
                          {org.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventIcon color="primary" />
                        </InputAdornment>
                      ),
                      inputProps: {
                        min: format(new Date(), 'yyyy-MM-dd'), // Set the minimum date to today's date
                      },
                    }}
                    required
                  />
                </Grid>

                {/* Room Selection and Available Slots */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Room</InputLabel>
                    <Select
                      label="Select Room"
                      name="selectedRoomId"
                      value={formData.selectedRoomId}
                      onChange={handleChange}
                      required
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          {room.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Available Slots Dropdown */}
                {formData.availableSlots.length > 0 && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Select Time Slot</InputLabel>
                      <Select
                        label="Select Time Slot"
                        name="selectedSlot"
                        value={formData.selectedSlot}
                        onChange={handleChange}
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

                {/* Start and End Time Options */}
                {/* {formData.startTimeOptions.length > 0 && ( */}
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Start Time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    >
                      {formData.startTimeOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
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
                      required
                    >
                      {formData.endTimeOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </>
                {/* )} */}

                {/* Participant Fields */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee Name"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleAddParticipant2}
                    sx={{
                      backgroundColor: themeColor.primary,
                      color: '#fff',
                      ':hover': {
                        backgroundColor: themeColor.primaryDark,
                      },
                    }}
                  >
                    Add Participant
                  </Button>
                </Grid>

                {/* Participant Table */}
                {formData.participantList.length > 0 && (
                  <Grid item xs={12}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Company Name</TableCell>
                          <TableCell>Employee Name</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.participantList.map((participant, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{participant.companyName}</TableCell>
                            <TableCell>{participant.employeeName}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleDeleteParticipant(index)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                )}

                {/* Special Note and Refreshment */}
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
                    required
                  />
                </Grid>

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
                    required
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
                    Add Meeting
                  </Button>
                </Grid>
              </Grid>
            </form>

            <Box sx={{ textAlign: 'right', mt: 3 }}>

            </Box>
          </Box>
        </Fade>
      </Modal>



    </Box>
  );
};

export default Meetings;
