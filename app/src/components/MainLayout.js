// src/components/MainLayout.js
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto', height: '100vh' }}>
          {children}
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default MainLayout;
