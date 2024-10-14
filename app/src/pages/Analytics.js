import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress 
} from '@mui/material';
import CountUp from 'react-countup';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('meetings');
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/dashboard'); // Adjust URL if needed
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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

  const chartData = {
    meetings: [completedMeetings, canceledMeetings],
    sessions: [completedSessions, canceledSessions],
    interviews: [completedInterviews, canceledInterviews],
    services: [completedServices, canceledServices],
  };

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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

  const donutOptions = (completed, total) => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      tooltip: { enabled: true },
      beforeDraw(chart) {
        const { ctx, width, height } = chart;
        const percentage = Math.round((completed / total) * 100);
        ctx.save();
        ctx.font = 'bold 18px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        const textX = Math.round(width / 2);
        const textY = Math.round(height / 2);
        ctx.fillText(`${percentage}%`, textX, textY);
      },
    },
  });

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

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Meetings', backgroundColor: '#42a5f5', data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] },
      { label: 'Sessions', backgroundColor: '#ff9800', data: [8, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65] },
      { label: 'Services', backgroundColor: '#66bb6a', data: [12, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
      { label: 'Events', backgroundColor: '#ab47bc', data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] },
    ],
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', minHeight: '80vh', borderRadius: '10px' }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Analytics Dashboard
      </Typography>

      {/* Total Counts (Meetings, Sessions, Interviews, Services) */}
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

      {/* Category Selector and Line Chart */}
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          <MenuItem value="meetings">Meetings</MenuItem>
          <MenuItem value="sessions">Sessions</MenuItem>
          <MenuItem value="interviews">Interviews</MenuItem>
          <MenuItem value="services">Services</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ height: '300px', marginBottom: 4 }}>
        <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>

      {/* Monthly Activities Overview (Bar Chart) */}
      <Box sx={{ height: '300px', marginTop: 4 }}>
        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </Box>
    </Box>
  );
};

export default Analytics;
