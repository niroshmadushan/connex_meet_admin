import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import CountUp from 'react-countup';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js for all types of charts

// Sample Data for the metrics
const totalMeetings = 100;
const completedMeetings = 80;
const canceledMeetings = 20;

const totalSessions = 60;
const completedSessions = 50;
const canceledSessions = 10;

const totalInterviews = 45;
const completedInterviews = 35;
const canceledInterviews = 10;

const totalServices = 85;
const completedServices = 70;
const canceledServices = 15;

// Data for bar chart (e.g., counts per month)
const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Meetings',
      backgroundColor: '#42a5f5',
      data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    },
    {
      label: 'Sessions',
      backgroundColor: '#ff9800',
      data: [8, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
    },
    {
      label: 'Services',
      backgroundColor: '#66bb6a',
      data: [12, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
    },
    {
      label: 'Events',
      backgroundColor: '#ab47bc',
      data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
    },
  ],
};

// Function to generate donut chart data (with completed and canceled proportions)
const generateDonutData = (completed, canceled, colors) => ({
  labels: ['Completed', 'Canceled'],
  datasets: [
    {
      data: [completed, canceled],
      backgroundColor: colors,
      borderWidth: 0, // Removed borders
      hoverBackgroundColor: colors.map(color => `${color}AA`), // Soft hover effect
    },
  ],
});

const meetingsDonutData = generateDonutData(completedMeetings, canceledMeetings, ['#4caf50', '#f44336']);
const sessionsDonutData = generateDonutData(completedSessions, canceledSessions, ['#ff9800', '#f44336']);
const interviewsDonutData = generateDonutData(completedInterviews, canceledInterviews, ['#42a5f5', '#f44336']);
const servicesDonutData = generateDonutData(completedServices, canceledServices, ['#ab47bc', '#f44336']);

// Data for line graph (growth over time)
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Meeting Growth',
      fill: true,
      backgroundColor: 'rgba(66, 165, 245, 0.2)',
      borderColor: '#42a5f5',
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      pointRadius: 5,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#42a5f5',
      tension: 0.3, // Smooth curves
    },
  ],
};

// Chart options for animations and minimalist design
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1500,
    easing: 'easeOutExpo', // Smooth animation with exponential easing
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#333',
        font: {
          size: 14,
        },
      },
    },
  },
};

// Donut chart loading animation
const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%', // Create a donut chart style
  plugins: {
    tooltip: {
      enabled: true,
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true, // Loading effect from 0% to 100%
    duration: 1500,
    easing: 'easeInOutQuad',
  },
};

const Analytics = () => {
  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* Page Title */}
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Analytics Dashboard
      </Typography>

      {/* Total Counts (Meetings, Sessions, Interviews, Services) */}
      <Grid container spacing={3} sx={{ marginBottom: 3 }}>
        {/* Meetings */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center'}}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Meetings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#42a5f5' }}>
              <CountUp end={totalMeetings} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>Completed: {completedMeetings}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledMeetings}</Typography>
          </Paper>
        </Grid>

        {/* Sessions */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#ffffff', border: 'none' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Sessions</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              <CountUp end={totalSessions} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#ff9800' }}>Completed: {completedSessions}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledSessions}</Typography>
          </Paper>
        </Grid>

        {/* Interviews */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#ffffff', border: 'none' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Interviews</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#66bb6a' }}>
              <CountUp end={totalInterviews} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>Completed: {completedInterviews}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledInterviews}</Typography>
          </Paper>
        </Grid>

        {/* Services */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#ffffff', border: 'none' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Services</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ab47bc' }}>
              <CountUp end={totalServices} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#ab47bc' }}>Completed: {completedServices}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledServices}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Donut Charts Section in One Line */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, overflowX: 'auto', paddingBottom: 2 }}>
        <Paper sx={{ padding: 2, minWidth: '22%', border: 'none' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Meetings Status</Typography>
          <Box sx={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={meetingsDonutData} options={donutOptions} />
          </Box>
        </Paper>

        <Paper sx={{ padding: 2, backgroundColor: '#ffffff', minWidth: '22%', border: 'none' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Sessions Status</Typography>
          <Box sx={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={sessionsDonutData} options={donutOptions} />
          </Box>
        </Paper>

        <Paper sx={{ padding: 2, backgroundColor: '#ffffff', minWidth: '22%', border: 'none' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Interviews Status</Typography>
          <Box sx={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={interviewsDonutData} options={donutOptions} />
          </Box>
        </Paper>

        <Paper sx={{ padding: 2, backgroundColor: '#ffffff', minWidth: '22%', border: 'none' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Services Status</Typography>
          <Box sx={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={servicesDonutData} options={donutOptions} />
          </Box>
        </Paper>
      </Box>

      {/* Bar Chart and Line Chart in One Line */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, marginTop: 4 }}>
        <Paper sx={{ padding: 2, backgroundColor: '#ffffff', width: '50%', border: 'none' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Monthly Activities Overview</Typography>
          <Box sx={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
            <Bar data={barChartData} options={chartOptions} />
          </Box>
        </Paper>

        <Paper sx={{ padding: 2, backgroundColor: '#ffffff', width: '50%', border: 'none' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Meetings Growth Over Time</Typography>
          <Box sx={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
            <Line data={lineChartData} options={chartOptions} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Analytics;
