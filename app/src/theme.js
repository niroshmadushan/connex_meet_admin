import { styled } from '@mui/material/styles';
import { Box, ListItem } from '@mui/material';

// Sidebar Theme Colors
export const themeColors = {
  sidebarBg: 'linear-gradient(to bottom, #001f3f, #003366, #00509E)', // Matching dark blue gradient
  buttonBg: '#003366',
  buttonText: '#ffffff',
  hoverBg: 'rgba(255, 255, 255, 0.2)',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  logoBg: '#001f3f',
};

// Styled Components for Sidebar
export const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '260px',
  height: '100vh',
  background: themeColors.sidebarBg,
  color: themeColors.buttonText,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  borderRight: `1px solid ${themeColors.borderColor}`,
  overflowY: 'auto',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1200,
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: themeColors.logoBg,
  borderBottom: `1px solid ${themeColors.borderColor}`,
  height: '80px',
}));
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A8A', // Dark blue as the primary color for buttons, etc.
    },
    secondary: {
      main: '#374151', // Gray for hover states or subtle UI elements
    },
    background: {
      default: '#f8fafc', // Light background color
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h5: {
        fontWeight: 'bold',
        letterSpacing: '1px',
      },}}});

      export default theme;
export const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  width: '80%',
  margin: '0 auto 12px auto',
  padding: '5px 12px',
  height: '40px',
  alignItems: 'center',
  backgroundColor: 'transparent',
  color: themeColors.buttonText,
  '&:hover': {
    backgroundColor: themeColors.hoverBg,
    transform: 'scale(0.98)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  '& .MuiListItemIcon-root': {
    minWidth: '40px',
    color: themeColors.buttonText,
    marginLeft: '20px',
  },
  '& .MuiListItemText-primary': {
    color: themeColors.buttonText,
    fontSize: '1.1rem',
    fontWeight: 500,
  },
}));
