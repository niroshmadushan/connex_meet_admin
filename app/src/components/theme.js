import { Box, Drawer, ListItem } from '@mui/material';
import { styled } from '@mui/system';

// Define theme colors
export const themeColors = {
  sidebarBg: 'linear-gradient(to bottom, #2e2e2e, #444444)',
  buttonBg: '#444444',
  buttonText: '#ffffff',
  hoverBg: '#555555',
  borderColor: '#222222',
  logoBg: '#2e2e2e',
};

// Styled components using themeColors
export const SidebarContainer = styled(Drawer)(({ theme }) => ({
  width: 260,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 260,
    boxSizing: 'border-box',
    background: themeColors.sidebarBg,
    color: themeColors.buttonText,
    paddingTop: theme.spacing(2),
    borderRight: `1px solid ${themeColors.borderColor}`,
    position: 'relative',
    overflow: 'hidden',
  },
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

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '4px',
  width: '90%',
  margin: '5px auto',
  padding: '5px 12px',
  height: '35px',
  alignItems: 'center',
  backgroundColor: themeColors.buttonBg,
  color: themeColors.buttonText,
  '&:hover': {
    backgroundColor: themeColors.hoverBg,
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[2],
  },
  '& .MuiListItemIcon-root': {
    minWidth: '35px',
    color: themeColors.buttonText,
    marginRight: '8px',
  },
  '& .MuiListItemText-primary': {
    color: themeColors.buttonText,
    fontSize: '14px',
    fontWeight: 400,
  },
}));
