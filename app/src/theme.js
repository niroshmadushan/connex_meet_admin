import { createTheme } from '@mui/material/styles';

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
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 'bold',
      letterSpacing: '1px',
    },
  },
});

export default theme;
