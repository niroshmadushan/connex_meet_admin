
import React, { useState } from 'react';
import { Box, Grid, Paper, Typography,MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CountUp from 'react-countup';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';

InputLabel 
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

// Donut chart data and percentage calculation
const generateDonutData = (completed, canceled, colors) => ({
  labels: ['Completed', 'Canceled'],
  datasets: [
    {
      data: [completed, canceled],
      backgroundColor: colors,
      borderWidth: 0, // Removed borders
      hoverBackgroundColor: colors.map((color) => `${color}AA`),
    },
  ],
});

const meetingsDonutData = generateDonutData(completedMeetings, canceledMeetings, ['#4caf50', '#f44336']);
const sessionsDonutData = generateDonutData(completedSessions, canceledSessions, ['#ff9800', '#f44336']);
const interviewsDonutData = generateDonutData(completedInterviews, canceledInterviews, ['#42a5f5', '#f44336']);
const servicesDonutData = generateDonutData(completedServices, canceledServices, ['#ab47bc', '#f44336']);

// Donut chart options with percentage display
const donutOptions = (completed, total) => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    tooltip: {
      enabled: true,
    },
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
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1500,
    easing: 'easeInOutQuad',
  },
});

// Data for bar and line charts
const barChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    { label: 'Meetings', backgroundColor: '#42a5f5', data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] },
    { label: 'Sessions', backgroundColor: '#ff9800', data: [8, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65] },
    { label: 'Services', backgroundColor: '#66bb6a', data: [12, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120] },
    { label: 'Events', backgroundColor: '#ab47bc', data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] },
  ],
};

const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Meeting Growth',
      fill: true,
      backgroundColor: 'rgba(66, 165, 245, 0.2)',
      borderColor: '#42a5f5',
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#42a5f5',
      tension: 0.3,
    },
  ],
};

// Chart options for animations and minimalist design
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeOutQuad',
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#333',
        font: {
          size: 12,
        },
      },
    },
  },
};

const Analytics = () => {
  const [selectedCategory, setSelectedCategory] = useState('meetings');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
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

  return (
    <Box sx={{ padding: 2, backgroundColor: '#fff', minHeight: '80vh', borderRadius: '10px' }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
        Analytics Dashboard
      </Typography>

      {/* Total Counts (Meetings, Sessions, Interviews, Services) */}
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 1.5, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Meetings</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#42a5f5' }}>
              <CountUp end={totalMeetings} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>Completed: {completedMeetings}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledMeetings}</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 1.5, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Sessions</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              <CountUp end={totalSessions} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#ff9800' }}>Completed: {completedSessions}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledSessions}</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 1.5, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Interviews</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#66bb6a' }}>
              <CountUp end={totalInterviews} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#4caf50' }}>Completed: {completedInterviews}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledInterviews}</Typography>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Grid sx={{ padding: 1.5, textAlign: 'center', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Total Services</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ab47bc' }}>
              <CountUp end={totalServices} duration={1.5} />
            </Typography>
            <Typography variant="caption" sx={{ color: '#ab47bc' }}>Completed: {completedServices}</Typography>
            <br />
            <Typography variant="caption" sx={{ color: '#f44336' }}>Canceled: {canceledServices}</Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Donut Charts Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Grid sx={{ padding: 1.5, minWidth: '22%', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Meetings Status</Typography>
          <Box sx={{ height: '180px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={meetingsDonutData} options={donutOptions(completedMeetings, totalMeetings)} />
          </Box>
        </Grid>

        <Grid sx={{ padding: 1.5, minWidth: '22%', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Sessions Status</Typography>
          <Box sx={{ height: '180px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={sessionsDonutData} options={donutOptions(completedSessions, totalSessions)} />
          </Box>
        </Grid>

        <Grid sx={{ padding: 1.5, minWidth: '22%', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Interviews Status</Typography>
          <Box sx={{ height: '180px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={interviewsDonutData} options={donutOptions(completedInterviews, totalInterviews)} />
          </Box>
        </Grid>

        <Grid sx={{ padding: 1.5, minWidth: '22%', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Services Status</Typography>
          <Box sx={{ height: '180px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={servicesDonutData} options={donutOptions(completedServices, totalServices)} />
          </Box>
        </Grid>
      </Box>

      {/* Bar Chart and Line Chart in One Line */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: 4 }}>
        <Grid sx={{ padding: 1.5, width: '50%', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>Monthly Activities Overview</Typography>
          <Box sx={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Bar data={barChartData} options={chartOptions} />
          </Box>
        </Grid>

        <Grid sx={{ padding: 1.5, width: '50%', backgroundColor: '#f9fbfd', borderRadius: '10px' }}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              <MenuItem value="meetings">Meetings</MenuItem>
              <MenuItem value="sessions">Sessions</MenuItem>
              <MenuItem value="interviews">Interviews</MenuItem>
              <MenuItem value="services">Services</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Line data={lineChartData} options={chartOptions} />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Analytics;
