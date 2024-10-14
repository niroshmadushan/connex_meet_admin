// Login.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Swal from 'sweetalert2';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { styled } from '@mui/system';
import APIConnection from '../config';
import imglg from '../assets/visitor-management-hero.jpg'


import { jwtDecode } from 'jwt-decode';

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  borderColor: '#777',
};

const Background = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  background: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  background: '#ffffff',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.0)',
  background: '#fafafa',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: themeColor.borderColor,
    },
    '&:hover fieldset': {
      borderColor: themeColor.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: themeColor.primaryDark,
    },
  },
  '& .MuiInputAdornment-root': {
    color: themeColor.primaryDark,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: themeColor.primaryDark,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const loginapi = APIConnection.loginapi;

  const handleLogin = async () => {
    setLoading(true);
    try {
      
      const response = await axios.post(loginapi, {email, password,role:'admin'}, { withCredentials: true });
      if (response.status === 200) {
        if (response.data.firstLogin) {
          Swal.fire('Welcome!', 'Please change your password.', 'info');
          localStorage.setItem('token', response.data.tempToken); // Store the token
          navigate('/change-password'); // Redirect to change password form
        } else {
          Swal.fire('Success!', 'Logged in successfully!', 'success');
          setIsAuthenticated(true);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      Swal.fire('Error!', 'Invalid email or password. Please try again.', 'error');
      setLoading(false);
    }
  };

  const handleBecomePartner = () => {
    navigate('/become_a_partner');
  };

  return (
    <Background>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <ContentBox>
            <img src={imglg} alt="Company Logo" style={{ marginBottom: 20, maxWidth: '40%' }} />
            <Typography variant="h4" gutterBottom>
              Welcome to Connex Partner Portal
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Join us and become a part of our growing network. Access your dashboard and manage your activities seamlessly.
            </Typography>
          </ContentBox>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper elevation={6}>
            <Typography variant="h5" style={{ marginBottom: '16px' }}>Login to Your Account</Typography>
            <StyledTextField
              fullWidth
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              variant="outlined"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Remember Me"
                sx={{ color: themeColor.primaryDark }}
              />
              <Typography
                component={RouterLink}
                to="/password-reset-request"
                variant="body2"
                sx={{
                  color: themeColor.primary,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { color: themeColor.primaryDark },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>
            <StyledButton
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                backgroundColor: '#0b2d9c',
                width: '100%',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </StyledButton>

            <StyledButton
              variant="contained"
              onClick={handleBecomePartner}
              sx={{
                backgroundColor: '#007bff',
                width: '100%',
                marginTop: 2,
              }}
            >
              Become a Partner
            </StyledButton>
          </StyledPaper>
        </Grid>
      </Grid>
    </Background>
  );
};

export default LoginPage;