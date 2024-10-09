import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.js';
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
import Login from './pages/Login.js';
import theme from './theme';

// import ChatPopup from './compo/page/ChatPopup';
import {
  CssBaseline,
  useMediaQuery,
  useTheme,
} from '@mui/material';


import axios from 'axios';
import APIConnect from './config.js';



const themeColors = {
  primary: '#333333',
  primaryDark: '#222222',
  secondary: '#25D366',
  textPrimary: '#ffffff',
  textSecondary: '#666666',
  background: '#f4f4f4',
  border: '#e0e0e0',
  cardBg: '#fafafa',
};


export const AuthContext = createContext();

// Import the ComingSoonPage from where it is defined
// const SettingsPage = () => <ComingSoonPage imagePath={SettingsImage} title="Settings Page Coming Soon!" />;


const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  empId: 'EMP123',
  phone: '+1234567890',
  image: '',
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openChatPopup, setOpenChatPopup] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const navigate = useNavigate();
  const [userdetails, setUserdetails] = useState([]);

  const getUserDetailsapi = APIConnect.getUserDetailsapi;

  // Handle mobile responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getUserDetails = async () => {
    try {
      // Check authentication status by calling an API that verifies the JWT token stored in the HttpOnly cookie
      await axios.get(getUserDetailsapi, { withCredentials: true }).then((res) => {
        setUserdetails(res.data.rows[0][0]);
        localStorage.setItem("Fullname", res.data.rows[0][0].name);
      })

    } catch (error) {
      console.log("error--", error);

    };

  }


 

  const logoutapi = APIConnect.logoutapi;

  
  const verifyToken = APIConnect.verifytoken;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check authentication status by calling an API that verifies the JWT token stored in the HttpOnly cookie
        await axios.get(verifyToken, { withCredentials: true }).then((res) => {
          setIsAuthenticated(true);
          // console.log("fadgg---------", res);
        })

      } catch (error) {

        if (error?.response?.request?.status === 401) {
          setIsAuthenticated(false);
          console.log("Unauthorized User", error.response.request.status);
        }
      }
    };

    checkAuthStatus();
    getUserDetails();
  }, []);

  return (
    <>
      {isAuthenticated && (
        <>
          <Header/>
          <Sidebar />
        </>
      )}
      <div style={{ display: 'flex', flex: 1, marginTop: isAuthenticated ? '60px' : '0' }}>
        <main style={{ flex: 1, marginLeft: isAuthenticated ? '200px' : 0, padding: isMobile ? '10px' : '20px' }}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login/>} />
            <Route path="/dashboard" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/meetings" element={<PrivateRoute><Meetings /></PrivateRoute>} />
                <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
                <Route path="/events" element={<PrivateRoute><Events /></PrivateRoute>} />
                <Route path="/interviews" element={<PrivateRoute><Interviews /></PrivateRoute>} />
                <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
                <Route path="/location" element={<PrivateRoute><Location /></PrivateRoute>} />
                <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                

                {/* Form Routes */}
                {/* <Route path="/create-event" element={<EventForm />} />
                <Route path="/create-meeting" element={<MeetingForm />} />
                <Route path="/create-user" element={<UserForm onSubmit={handleUserSubmit} />} /> */}
            {/* <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} /> */}
            {/* Add other routes here */}
          </Routes>
        </main>
      </div>
      {isAuthenticated && (
       <Footer/>
      )}
    </>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <CssBaseline /> {/* Normalize CSS across browsers */}
        <AppContent />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;