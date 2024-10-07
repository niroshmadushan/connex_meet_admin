import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Meetings from './pages/Meetings';
import Sessions from './pages/Sessions';
import Location from './pages/ManageLocations.js';
import Events from './pages/Events';
import Interviews from './pages/Interviews';
import Services from './pages/Services';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Login from './pages/Login.js';
import EventForm from './components/EventForm';
import MeetingForm from './components/MeetingForm';
import UserForm from './components/UserForm';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider, AuthContext } from './pages/AuthContext'; // Make sure this import is correct
import PrivateRoute from './components/PrivateRoute';

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext); // Use the context

  return (
    <Routes>
      {/* Redirect if authenticated */}
      {isAuthenticated && (
        <Route path="/" element={<Navigate replace to="/dash" />} />
      )}

      {/* Public routes */}
      <Route path="/" element={<Login />} />
                <Route path="/dash" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                  <Route path="/meetings" element={<PrivateRoute><Meetings /></PrivateRoute>} />
                  <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
                  <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
                  <Route path="/interviews" element={<PrivateRoute><Interviews /></PrivateRoute>} />
                  <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
                  <Route path="/location" element={<PrivateRoute><Location /></PrivateRoute>} />
                  <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />

                  {/* Form Routes */}
                  <Route path="/create-event" element={<PrivateRoute><EventForm /></PrivateRoute>} />
                  <Route path="/create-meeting" element={<PrivateRoute><MeetingForm /></PrivateRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
