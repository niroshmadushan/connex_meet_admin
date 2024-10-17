import React, { createContext, useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Meetings from './pages/Meetings';
import Sessions from './pages/Sessions';
import Location from './pages/ManageLocations';
import Visitor from './pages/visitor'
import Events from './pages/Events';
import Interviews from './pages/Interviews';
import Services from './pages/Services';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { CssBaseline, Box, ThemeProvider } from '@mui/material';
import axios from 'axios';
import theme from './theme';
import APIConnect from './config';

// Create AuthContext
export const AuthContext = createContext();

// Main AppContent Component
const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Box sx={{ display: 'flex' }}>
      {isAuthenticated && <Sidebar />} {/* Sidebar visible only if authenticated */}
      <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto', height: '100vh' }}>
        {isAuthenticated && <Header />} {/* Header visible only if authenticated */}
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          <Routes>
            {/* Public Route - Login Page */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/meetings" element={<PrivateRoute><Meetings /></PrivateRoute>} />
            <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
            <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
            <Route path="/interviews" element={<PrivateRoute><Interviews /></PrivateRoute>} />
            <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
            <Route path="/location" element={<PrivateRoute><Location /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/visitor" element={<PrivateRoute><Visitor /></PrivateRoute>} />

            {/* Catch-all route to handle invalid URLs */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
        {isAuthenticated && <Footer />} {/* Footer visible only if authenticated */}
      </Box>
    </Box>
  );
};

// PrivateRoute Component to Protect Routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/" />;
};

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const verifyToken = APIConnect.verifytoken;

  // Check the authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(verifyToken, { withCredentials: true });
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
