// src/TabbedPage.js
import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import NewRequests from './NewRequests';
import Retakes from './Retakes';
import History from './History';
import Service from './visitorservice'; // Import the new Service component

// Main component for handling tabs and page content
const TabbedPage = () => {
  const [tabValue, setTabValue] = useState(0); // State to handle tab switching

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Tab Panel Component (for rendering content of each tab)
  const TabPanel = ({ value, index, children }) => {
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        sx={{ padding: 3 }}
      >
        {value === index && <Box>{children}</Box>}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 1,
          borderRadius: 3,
          backgroundColor: '#f5f7fa', // Light background color for premium feel
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Tabbed Navigation"
          centered
          sx={{
            minHeight: '40px', // Make the tab bar thinner
            '& .MuiTabs-indicator': {
              height: '4px', // Thinner indicator bar
              backgroundColor: '#007aff', // Premium blue color for active tab indicator
              borderRadius: '4px', // Rounded corners for the indicator
            },
          }}
        >
          <Tab
            label="New Requests"
            id="tab-0"
            aria-controls="tabpanel-0"
            sx={{
              fontWeight: 'bold',
              minHeight: '40px', // Reduce tab height
              padding: '6px 16px', // Padding for a tighter, sleek look
              color: '#6e6e6e', // Grey color for inactive tabs
              '&.Mui-selected': {
                color: '#007aff', // Premium blue for selected tab
              },
              textTransform: 'none', // Disable uppercase for a modern look
            }}
          />
          <Tab
            label="Retakes"
            id="tab-1"
            aria-controls="tabpanel-1"
            sx={{
              fontWeight: 'bold',
              minHeight: '40px',
              padding: '6px 16px',
              color: '#6e6e6e',
              '&.Mui-selected': {
                color: '#007aff',
              },
              textTransform: 'none',
            }}
          />
          <Tab
            label="History"
            id="tab-2"
            aria-controls="tabpanel-2"
            sx={{
              fontWeight: 'bold',
              minHeight: '40px',
              padding: '6px 16px',
              color: '#6e6e6e',
              '&.Mui-selected': {
                color: '#007aff',
              },
              textTransform: 'none',
            }}
          />
          <Tab
            label="Service" // New Tab
            id="tab-3"
            aria-controls="tabpanel-3"
            sx={{
              fontWeight: 'bold',
              minHeight: '40px',
              padding: '6px 16px',
              color: '#6e6e6e',
              '&.Mui-selected': {
                color: '#007aff',
              },
              textTransform: 'none',
            }}
          />
        </Tabs>
      </Paper>

      {/* Tab Panels for rendering content based on active tab */}
      <TabPanel value={tabValue} index={0}>
        <NewRequests />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Retakes />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <History />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Service /> {/* Service Tab Content */}
      </TabPanel>
    </Box>
  );
};

export default TabbedPage;
