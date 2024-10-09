import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import Login from './pages/Login.js';


// import ChatPopup from './compo/page/ChatPopup';
import ChangePasswordPage from './compo/page/ChangePasswordPage';
import VendorProductsPage from './compo/page/VendorProductsPage';
import {
  Box,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  Grid,
  CssBaseline,
  useMediaQuery,
  useTheme,
  Zoom,
} from '@mui/material';
import { Edit, Person, Visibility, VisibilityOff, Chat, Logout } from '@mui/icons-material';
import ChatPopup from '../src/compo/page/ChatPopup';
import axios from 'axios';
import logo from './compo/img/userimage.jpg';
import APIConnect from './config';
import ComingSoonPage from './compo/page/ComingSoon';
import TechImage from './compo/img/coming soon/4.webp';
import MDFImage from './compo/img/coming soon/5.webp';
import ConnexCircleImage from './compo/img/coming soon/2.webp';
import SettingsImage from './compo/img/coming soon/3.webp';
import AccessMgt from './compo/page/AccessMgt';

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

const styles = {
  header: {
    padding: '10px 20px',
    backgroundColor: '#03163c',
    color: themeColors.textPrimary,
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: "'Roboto', sans-serif",
    borderBottom: `1px solid ${themeColors.border}`,
    margin: 0,
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100%',
    zIndex: 1200,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '20px',
  },
  footer: {
    padding: '10px 20px',
    backgroundColor: '#03163c',
    textAlign: 'center',
    borderTop:`1px solid ${themeColors.border}`,
    fontSize: '12px',
    color: themeColors.textSecondary,
    fontFamily: "'Roboto', sans-serif",
    margin: 0,
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  dialogContent: {
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  profileField: {
    marginBottom: '10px',
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: themeColors.primary,
    fontSize: '14px',
  },
  fieldValue: {
    color: themeColors.textSecondary,
    fontSize: '14px',
  },
  iconButton: {
    color: themeColors.textPrimary,
    fontSize: '2rem',
    background: 'rgba(255, 255, 255, 0.3)',
    marginBottom: '5px',
    marginLeft: '10px',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.1)',
      background: 'rgba(255, 255, 255, 0.5)',
    },
  },
  profileDialogTitle: {
    fontWeight: 'bold',
    color: themeColors.primary,
    fontSize: '18px',
    textAlign: 'left',
    marginBottom: '10px',
    paddingLeft: '20px',
  },
  dialogPaper: {
    borderRadius: '12px',
    boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
    backgroundColor: themeColors.cardBg,
    width: '600px',
  },
  textFieldRoot: {
    '& .MuiInput-underline:before': {
      borderBottomColor: themeColors.primary,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: themeColors.secondary,
    },
  },
  passwordDialogTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: themeColors.primary,
  },
  chatIconButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: themeColors.secondary,
    color: '#fff',
    '&:hover': {
      backgroundColor: '#20c65a',
    },
  },
};

export const AuthContext = createContext();

// Import the ComingSoonPage from where it is defined


const TechAlliance = () => <ComingSoonPage imagePath={TechImage} title="Tech Alliance Page Coming Soon!" />;
const MDFOrders = () => <ComingSoonPage imagePath={MDFImage} title="MDF Orders Page Coming Soon!" />;
const ConnexCircle = () => <ComingSoonPage imagePath={ConnexCircleImage} title="Connex Circle Page Coming Soon!" />;
// const SettingsPage = () => <ComingSoonPage imagePath={SettingsImage} title="Settings Page Coming Soon!" />;


const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  empId: 'EMP123',
  phone: '+1234567890',
  image: logo,
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

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenProfileDialog(true);
    getUserDetails();

  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setOpenEditProfileDialog(true);
    setOpenProfileDialog(false);
  };

  const handleChangePassword = () => {
    setOpenPasswordDialog(true);
    setOpenProfileDialog(false);
  };

  const handlePasswordChange = () => {
    // Handle password change logic here
    console.log('New password:', newPassword);
    setOpenPasswordDialog(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleProfileFieldChange = (field, value) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleProfileUpdate = () => {
    // Handle profile update logic here
    console.log('Updated user profile:', editedUser);
    setOpenEditProfileDialog(false);
  };

  const logoutapi = APIConnect.logoutapi;

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the cookie on the server side
      await axios.post(logoutapi, {}, { withCredentials: true }).then((res) => {
        setIsAuthenticated(false);
        localStorage.clear();
        setAnchorEl(null);
        navigate('/');
      }
      )
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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