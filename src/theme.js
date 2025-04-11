// src/theme.js
import { createTheme } from '@mui/material/styles';

const primaryColor = "#E1C16E";
const primaryTextColor = "#424141";
const secondaryColor = "#20392C";
const secondaryColorHover = '#145d43';
const mainBodyColor = '#fffbf0';

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor, // Set primary color
    },
    secondary: {
      main: secondaryColor, // Set secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Default font
    h1: {
      color: primaryTextColor, // Use secondary color for headings
    },
    h2: {
      color: primaryTextColor,
    },
    h3: {
      color: primaryTextColor,
    },
    h4: {
      color: primaryTextColor,
    },
    h5: {
      color: primaryTextColor,
    },
    h6: {
      color: primaryTextColor,
    },
    body1: {
      color: primaryTextColor, // Use secondary color for body text
    },
    body2: {
      color: primaryTextColor,
    },
    subtitle1: {
      color: primaryTextColor,
    },
    subtitle2: {
      color: primaryTextColor,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for buttons
          padding: '10px 20px', // Adequate button padding
          color: primaryColor,
          backgroundColor: secondaryColor,
          '&:hover': {
            backgroundColor: secondaryColorHover, // Darker shade of secondary color for hover (adjust as needed)
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Rounded corners for cards
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow effect for cards
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color: secondaryColor, // Apply secondary color to the text of ListItem
          '&:hover': {
            color: secondaryColorHover, // Darker shade of secondary color for hover (adjust as needed)
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: secondaryColor, // Apply secondary color to all icons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // backgroundColor: mainBodyColor, // Apply secondary color to all icons\
          borderRadius: '16px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0, // Set the desired border-radius
        },
      },
    },
  },
});

export default theme;
