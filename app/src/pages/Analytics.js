import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress 
} from '@mui/material';
import CountUp from 'react-countup';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null); // Store API data here
  const [loading, setLoading] = useState(true); // Handle loading state
  const [selectedCategory, setSelectedCategory] = useState('meetings'); // Track selected category

  // Fetch dashboard data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://192.168.13.6:3000/getdashbaord');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Handle category change for the line chart
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // If data is still loading, show a loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If dashboardData is null, show an error message
  if (!dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6" color="error">Failed to load data. Please try again.</Typography>
      </Box>
    );
  }

  // Destructure the data from the API response
  const {
    totalMeetings,
    completedMeetings,
    canceledMeetings,
    totalSessions,
    completedSessions,
    canceledSessions,
    totalInterviews,
    completedInterviews,
    canceledInterviews,
    totalServices,
    completedServices,
    canceledServices,
  } = dashboardData;

  // Data for the dynamic line chart
  const chartData = {
    meetings: [completedMeetings, canceledMeetings],
    sessions: [completedSessions, canceledSessions],
    interviews: [completedInterviews, canceledInterviews],
    services: [completedServices, canceledServices],
  };

  const lineChartData = {
    labels: ['Completed', 'Canceled'],
    datasets: [
      {
        label: `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Growth`,
        fill: true,
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        borderColor: '#42a5f5',
        data: chartData[selectedCategory],
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#42a5f5',
        tension: 0.3,
      },
    ],
  };

  const generateDonutData = (completed, canceled, colors) => ({
    labels: ['Completed', 'Canceled'],
    datasets: [
      {
        data: [completed, canceled],
        backgroundColor: colors,
        borderWidth: 0,
        hoverBackgroundColor: colors.map((color) => `${color}AA`),
      },
    ],
  });

  const meetingsDonutData = generateDonutData(completedMeetings, canceledMeetings, ['#4caf50', '#f44336']);
  const sessionsDonutData = generateDonutData(completedSessions, canceledSessions, ['#ff9800', '#f44336']);
  const interviewsDonutData = generateDonutData(completedInterviews, canceledInterviews, ['#42a5f5', '#f44336']);
  const servicesDonutData = generateDonutData(completedServices, canceledServices, ['#ab47bc', '#f44336']);

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', minHeight: '80vh', borderRadius: '10px' }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Meetings</Typography>
            <Typography variant="h6" sx={{ color: '#42a5f5' }}>
              <CountUp end={totalMeetings} duration={1.5} />
            </Typography>
            <Typography variant="caption">Completed: {completedMeetings}</Typography>
            <Typography variant="caption">Canceled: {canceledMeetings}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Sessions</Typography>
            <Typography variant="h6" sx={{ color: '#ff9800' }}>
              <CountUp end={totalSessions} duration={1.5} />
            </Typography>
            <Typography variant="caption">Completed: {completedSessions}</Typography>
            <Typography variant="caption">Canceled: {canceledSessions}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Interviews</Typography>
            <Typography variant="h6" sx={{ color: '#66bb6a' }}>
              <CountUp end={totalInterviews} duration={1.5} />
            </Typography>
            <Typography variant="caption">Completed: {completedInterviews}</Typography>
            <Typography variant="caption">Canceled: {canceledInterviews}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Services</Typography>
            <Typography variant="h6" sx={{ color: '#ab47bc' }}>
              <CountUp end={totalServices} duration={1.5} />
            </Typography>
            <Typography variant="caption">Completed: {completedServices}</Typography>
            <Typography variant="caption">Canceled: {canceledServices}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: 4 }}>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange}>
            <MenuItem value="meetings">Meetings</MenuItem>
            <MenuItem value="sessions">Sessions</MenuItem>
            <MenuItem value="interviews">Interviews</MenuItem>
            <MenuItem value="services">Services</MenuItem>
          </Select>
        </FormControl>
        <Line data={lineChartData} />
      </Box>
    </Box>
  );
};

export default Analytics;
