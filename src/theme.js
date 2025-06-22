// src/theme.js
import { createTheme } from '@mui/material/styles';

const primaryColor = "#E1C16E";
const primaryTextColor = "#424141";
const secondaryColor = "#20392C";
const secondaryColorHover = '#145d43';

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
    fontFamily: 'Merriweather, Roboto, Arial, sans-serif', // Farm-appropriate, elegant serif for headings
    h1: {
      color: primaryTextColor,
      fontFamily: 'Merriweather, serif',
    },
    h2: {
      color: primaryTextColor,
      fontFamily: 'Merriweather, serif',
    },
    h3: {
      color: primaryTextColor,
      fontFamily: 'Merriweather, serif',
    },
    h4: {
      color: primaryTextColor,
      fontFamily: 'Merriweather, serif',
    },
    h5: {
      color: primaryTextColor,
      fontFamily: 'Merriweather, serif',
    },
    h6: {
      color: primaryTextColor,
      fontFamily: 'Merriweather, serif',
    },
    body1: {
      color: primaryTextColor,
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    body2: {
      color: primaryTextColor,
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    subtitle1: {
      color: primaryTextColor,
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    subtitle2: {
      color: primaryTextColor,
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for buttons
          padding: '10px 20px', // Adequate button padding
          color: secondaryColor,
          backgroundColor: primaryColor,
          '&:hover': {
            backgroundColor: secondaryColorHover,
            color: primaryColor,
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
          color: primaryColor, // Apply secondary color to all icons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // backgroundColor: mainBodyColor, // Apply secondary color to all icons\
          borderRadius: '16px',
          backgroundColor: '#f5efe1', // Light background for paper components
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: primaryColor, // Set the default color to primary
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '8px',
        },
        input: {
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          border: 'none',
          borderRadius: '8px',
        },
        root: {
          borderRadius: '8px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid',
            borderColor: primaryColor,
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;
