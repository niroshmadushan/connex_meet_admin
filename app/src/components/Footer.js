import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        marginLeft:'-100px',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '60px', // Added height to give it a centered look
      }}
    >
      <Typography variant="body2" color="textSecondary" align="center">
        © {new Date().getFullYear()} Visitor Management System. Connex Information Technologies & Code Work SE Team. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
