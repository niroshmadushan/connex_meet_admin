import React, { useState } from 'react';
import { Box, List, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { SidebarContainer, StyledListItem, LogoContainer } from './theme'; // Import from theme.js
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import PeopleIcon from '@mui/icons-material/People';
import AdminLogo from '../assets/admin-logo.png';
import DeveloperLogo from '../assets/developer-logo.png';
import { styled } from '@mui/material/styles';
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
    { text: 'Location', icon: <RoomIcon />, path: '/location' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  ];

  const handleClick = (index) => {
    setActiveItem(index); // Set active item based on the clicked index
  };

  return (
    <SidebarContainer>
      {/* Shine effect over the sidebar */}
      <ShineEffect />
      
      {/* Admin Panel Header */}
      <LogoContainer>
        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: '1px', color: '#ffffff' }}>
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
      </LogoContainer>

      {/* Menu List */}
      <List sx={{ alignItems: 'center', zIndex: 1 }}>
        {menuItems.map((item, index) => (
          <StyledListItem
            button
            component={Link}
            to={item.path}
            key={index}
            onClick={() => handleClick(index)} // Set active item on click
            sx={{
              backgroundColor: activeItem === index ? 'rgba(255, 255, 255, 0.3)' : 'transparent', // Highlight active item
              transform: activeItem === index ? 'scale(0.95)' : 'scale(1)', // Scale down if active
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
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
            borderRadius: '10px',
          }}
        />
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
