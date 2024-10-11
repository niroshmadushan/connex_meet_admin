import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room'; // New icon for Location
import PeopleIcon from '@mui/icons-material/People'; // New icon for Users
import { styled } from '@mui/system';
import AdminLogo from '../assets/admin-logo.png'; // Assuming you have a logo image
import DeveloperLogo from '../assets/developer-logo.png'; // Assuming you have a developer logo image


// Custom styling for the sidebar with a beautiful dark blue theme
const SidebarContainer = styled(Drawer)(({ theme }) => ({
  width: 260,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 260,
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #001f3f, #003366, #00509E)', // Dark blue gradient
    color: '#ffffff',
    paddingTop: theme.spacing(2),
    borderRight: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border for definition
    position: 'relative', // For the developer logo at the bottom
    overflow: 'hidden', // Ensure content stays within the sidebar
  },
}));

// Glossy animation effect
const ShineEffect = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '-75%',
  width: '150%',
  height: '200%',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
  transform: 'rotate(45deg)',
}));

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null); // Track which item is clicked
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Meetings', icon: <EventIcon />, path: '/meetings' },
    { text: 'Sessions', icon: <EventAvailableIcon />, path: '/sessions' },
    { text: 'Interviews', icon: <GroupIcon />, path: '/interviews' },
    { text: 'Services', icon: <PersonIcon />, path: '/services' },
    { text: 'Location', icon: <RoomIcon />, path: '/location' }, // Updated Location Icon
    { text: 'Users', icon: <PeopleIcon />, path: '/users' }, // Updated Users Icon
  ];

  const handleClick = (index) => {
    setActiveItem(index); // Set active item based on the clicked index
  };

  return (
    <SidebarContainer variant="permanent">
      {/* Shine effect over the sidebar */}
      <ShineEffect />
      
      {/* Admin Panel Header */}
      <Box sx={{ textAlign: 'center', paddingBottom: 3, position: 'relative', zIndex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', color: '#ffffff' }}>
          Admin Panel
        </Typography>
        <Box
          component="img"
          src={AdminLogo}
          alt="Admin Logo"
          sx={{
            width: '80px',
            height: 'auto',
            marginBottom: 1,
          }}
        />
      </Box>

      {/* Menu List */}
      <List sx={{ alignItems: 'center', zIndex: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={index}
            onClick={() => handleClick(index)} // Set active item on click
            sx={{
              color: '#ffffff',
              width: '80%',
              margin: '0 auto 12px auto',
              borderRadius: '12px',
              height: '40px',
              paddingLeft: '10px',
              transform: activeItem === index ? 'scale(0.95)' : 'scale(1)', // Scale down if active
              backgroundColor: activeItem === index ? 'rgba(255, 255, 255, 0.3)' : 'transparent', // Highlight active item
              transition: 'transform 0.3s ease, background-color 0.3s ease', // Smooth transition for scaling and color change
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Hover effect
                transform: 'scale(0.98)', // Slight zoom-in on hover
                transition: 'transform 0.3s ease, background-color 0.3s ease',
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
                minWidth: '40px',
                marginLeft: '20px',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                '& span': {
                  fontSize: '1.1rem',
                  fontWeight: 500,
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Developer Logo at the Bottom */}
      <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center', marginBottom: '8px' }}>
          Developed by
        </Typography>
        <Box
          component="img"
          src={DeveloperLogo}
          alt="Developer Logo"
          sx={{
            width: '120px',
            height: 'auto',
            borderRadius:'10px',
          }}
        />
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
