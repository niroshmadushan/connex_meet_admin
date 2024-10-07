import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated to use Routes
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Meetings from './pages/Meetings';
import Sessions from './pages/Sessions';
import Location from './pages/ManageLocations.js'
import Events from './pages/Events';
import Interviews from './pages/Interviews';
import Services from './pages/Services';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import EventForm from './components/EventForm';
import MeetingForm from './components/MeetingForm';
import UserForm from './components/UserForm';
import theme from './theme';

// Example handler for user form submission
const handleUserSubmit = (userData) => {
  console.log('User data submitted:', userData);
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto', height: '100vh' }}>
            {/* Header */}
            <Header />

            {/* Main content and routes */}
            <Box sx={{ flexGrow: 1, mt: 2 }}>
              <Routes> {/* Updated from Switch to Routes */}
                {/* Page Routes */}
                <Route path="/" element={<Analytics />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/events" element={<Events />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/services" element={<Services />} />
                <Route path="/location" element={<Location />} />
                <Route path="/users" element={<Users />} />
                

                {/* Form Routes */}
                <Route path="/create-event" element={<EventForm />} />
                <Route path="/create-meeting" element={<MeetingForm />} />
                <Route path="/create-user" element={<UserForm onSubmit={handleUserSubmit} />} />
              </Routes>
            </Box>

            {/* Footer */}
            <Footer />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
