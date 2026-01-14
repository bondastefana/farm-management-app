// src/theme.js
import { createTheme, alpha } from '@mui/material/styles';

/**
 * Farm Manager - Natural Farm Theme
 * Supports both Light and Dark modes
 * Color palette inspired by nature and agriculture
 * - Olive Green: Growth, nature, primary actions
 * - Brown: Earth, stability, secondary actions
 * - Golden: Harvest, achievements, accents
 */

// ==================== COLOR PALETTE ====================

// Primary: Beautiful Olive Green (earthy, sophisticated, nature-inspired)
const PRIMARY = {
  light: '#9FB892',      // Light olive
  main: '#748E63',       // Beautiful olive green - earthy and professional
  dark: '#5A7050',       // Deep olive
  contrastText: '#FFFFFF',
};

// Secondary: Rich Earth Brown (soil, stability, grounding)
const SECONDARY = {
  light: '#A1887F',      // Light clay
  main: '#795548',       // Rich soil brown
  dark: '#5D4037',       // Dark earth
  contrastText: '#FFFFFF',
};

// Accent: Golden Harvest (wheat, sunshine, celebration)
const ACCENT = {
  light: '#FFD54F',      // Light wheat
  main: '#FFC107',       // Golden harvest
  dark: '#FFA000',       // Deep amber
  contrastText: 'rgba(0, 0, 0, 0.87)',
};

/**
 * Creates a theme based on the specified mode (light or dark)
 * @param {string} mode - 'light' or 'dark'
 * @returns {Theme} Material-UI theme object
 */
const getTheme = (mode) => {
  const isLight = mode === 'light';

  // Error: Barn Red (critical actions, warnings) - Adaptive to theme
  const ERROR = isLight
    ? {
        light: '#FFCDD2',      // Very soft red for light mode
        main: '#EF5350',       // Medium red (less aggressive)
        dark: '#C62828',       // Deep red
        contrastText: '#FFFFFF',
      }
    : {
        light: '#E57373',      // Lighter red for dark mode
        main: '#EF5350',       // Softer red for dark backgrounds
        dark: '#D32F2F',       // Deep red
        contrastText: '#FFFFFF',
      };

  // Warning: Sunset Orange (caution, alerts) - Adaptive to theme
  const WARNING = isLight
    ? {
        light: '#FFE082',
        main: '#FFA726',       // Softer orange for light mode
        dark: '#F57C00',
        contrastText: 'rgba(0, 0, 0, 0.87)',
      }
    : {
        light: '#FFB74D',
        main: '#FF9800',       // Brighter orange for dark mode
        dark: '#F57C00',
        contrastText: 'rgba(0, 0, 0, 0.87)',
      };

  // Info: Sky Blue (information, weather, water) - Adaptive to theme
  const INFO = isLight
    ? {
        light: '#81D4FA',
        main: '#29B6F6',       // Softer blue for light mode
        dark: '#0288D1',
        contrastText: '#FFFFFF',
      }
    : {
        light: '#64B5F6',
        main: '#42A5F5',       // Brighter blue for dark mode
        dark: '#1976D2',
        contrastText: '#FFFFFF',
      };

  // Success: Healthy Crop Green (aligned with olive palette) - Adaptive to theme
  const SUCCESS = isLight
    ? {
        light: '#B2DFAF',
        main: '#81A36F',       // Fresh healthy green
        dark: '#5A7050',
        contrastText: '#FFFFFF',
      }
    : {
        light: '#9FB892',
        main: '#81A36F',       // Slightly brighter for dark mode
        dark: '#5A7050',
        contrastText: '#FFFFFF',
      };

  // Text Colors - Adaptive for light/dark mode
  const TEXT = isLight
    ? {
        primary: '#2C3E2E',    // Dark forest with olive undertone
        secondary: '#5A6B55',  // Medium olive-gray
        disabled: 'rgba(0, 0, 0, 0.38)',
      }
    : {
        primary: '#E8F0E3',    // Light sage for dark mode
        secondary: '#B8C5B3',  // Medium light olive-gray
        disabled: 'rgba(255, 255, 255, 0.38)',
      };

  // Background Colors - Adaptive for light/dark mode
  const BACKGROUND = isLight
    ? {
        default: '#F0F2F5',    // Light gray
        paper: '#FFFFFF',      // Pure white
        secondary: '#E8ECEF',  // Medium gray
        elevated: '#FAFAFA',   // Very light gray
      }
    : {
        default: '#1A1F1A',    // Very dark olive-black
        paper: '#242B24',      // Dark olive-gray
        secondary: '#2D342D',  // Medium dark olive
        elevated: '#303830',   // Elevated dark surface
      };

  return createTheme({
    // Color Palette
    palette: {
      mode: mode,
      primary: PRIMARY,
      secondary: SECONDARY,
      error: ERROR,
      warning: WARNING,
      info: INFO,
      success: SUCCESS,
      text: TEXT,
      background: BACKGROUND,
      divider: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      // Custom accent color
      accent: ACCENT,
    },

    // Typography
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      htmlFontSize: 16,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,

      // Headings - Using Merriweather for farm-appropriate elegance
      h1: {
        fontFamily: '"Merriweather", "Georgia", serif',
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01562em',
        color: TEXT.primary,
      },
      h2: {
        fontFamily: '"Merriweather", "Georgia", serif',
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.00833em',
        color: TEXT.primary,
      },
      h3: {
        fontFamily: '"Merriweather", "Georgia", serif',
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0em',
        color: TEXT.primary,
      },
      h4: {
        fontFamily: '"Merriweather", "Georgia", serif',
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: '0.00735em',
        color: TEXT.primary,
      },
      h5: {
        fontFamily: '"Merriweather", "Georgia", serif',
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0em',
        color: TEXT.primary,
      },
      h6: {
        fontFamily: '"Merriweather", "Georgia", serif',
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
        color: TEXT.primary,
      },

      // Body text
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
        color: TEXT.primary,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
        color: TEXT.secondary,
      },

      // Subtitles
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
        color: TEXT.primary,
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
        color: TEXT.secondary,
      },

      // Button text
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase',
      },

      // Captions and overline
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
        color: TEXT.secondary,
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
        color: TEXT.secondary,
      },
    },

    // Spacing
    spacing: 8, // Base spacing unit (1 = 8px)

    // Shape
    shape: {
      borderRadius: 8,
    },

    // Shadows - Enhanced contrast with neutral shadows
    shadows: [
      'none',
      '0px 1px 2px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.08)',
      '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.10)',
      '0px 3px 6px rgba(0, 0, 0, 0.07), 0px 4px 8px rgba(0, 0, 0, 0.12)',
      '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.14)',
      '0px 5px 10px rgba(0, 0, 0, 0.09), 0px 8px 16px rgba(0, 0, 0, 0.15)',
      '0px 6px 12px rgba(0, 0, 0, 0.10), 0px 10px 20px rgba(0, 0, 0, 0.16)',
      '0px 7px 14px rgba(0, 0, 0, 0.10), 0px 12px 24px rgba(0, 0, 0, 0.17)',
      '0px 8px 16px rgba(0, 0, 0, 0.11), 0px 14px 28px rgba(0, 0, 0, 0.18)',
      '0px 9px 18px rgba(0, 0, 0, 0.11), 0px 16px 32px rgba(0, 0, 0, 0.19)',
      '0px 10px 20px rgba(0, 0, 0, 0.12), 0px 18px 36px rgba(0, 0, 0, 0.20)',
      '0px 11px 22px rgba(0, 0, 0, 0.12), 0px 20px 40px rgba(0, 0, 0, 0.20)',
      '0px 12px 24px rgba(0, 0, 0, 0.13), 0px 22px 44px rgba(0, 0, 0, 0.21)',
      '0px 13px 26px rgba(0, 0, 0, 0.13), 0px 24px 48px rgba(0, 0, 0, 0.22)',
      '0px 14px 28px rgba(0, 0, 0, 0.14), 0px 26px 52px rgba(0, 0, 0, 0.22)',
      '0px 15px 30px rgba(0, 0, 0, 0.14), 0px 28px 56px rgba(0, 0, 0, 0.23)',
      '0px 16px 32px rgba(0, 0, 0, 0.15), 0px 30px 60px rgba(0, 0, 0, 0.24)',
      '0px 17px 34px rgba(0, 0, 0, 0.15), 0px 32px 64px rgba(0, 0, 0, 0.24)',
      '0px 18px 36px rgba(0, 0, 0, 0.16), 0px 34px 68px rgba(0, 0, 0, 0.25)',
      '0px 19px 38px rgba(0, 0, 0, 0.16), 0px 36px 72px rgba(0, 0, 0, 0.26)',
      '0px 20px 40px rgba(0, 0, 0, 0.17), 0px 38px 76px rgba(0, 0, 0, 0.26)',
      '0px 21px 42px rgba(0, 0, 0, 0.17), 0px 40px 80px rgba(0, 0, 0, 0.27)',
      '0px 22px 44px rgba(0, 0, 0, 0.18), 0px 42px 84px rgba(0, 0, 0, 0.28)',
      '0px 23px 46px rgba(0, 0, 0, 0.18), 0px 44px 88px rgba(0, 0, 0, 0.28)',
      '0px 24px 48px rgba(0, 0, 0, 0.19), 0px 46px 92px rgba(0, 0, 0, 0.29)',
    ],

    // Breakpoints
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },

    // Component Overrides
    components: {
      // ==================== GLOBAL STYLES & SCROLLBAR ====================
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // Custom scrollbar for the entire app
            '*::-webkit-scrollbar': {
              width: '12px',
              height: '12px',
            },
            '*::-webkit-scrollbar-track': {
              background: isLight
                ? 'rgba(0, 0, 0, 0.05)'
                : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: isLight
                ? 'rgba(116, 142, 99, 0.3)'
                : 'rgba(159, 184, 146, 0.3)',
              borderRadius: '10px',
              border: isLight
                ? '3px solid rgba(0, 0, 0, 0.05)'
                : '3px solid rgba(255, 255, 255, 0.05)',
              transition: 'background-color 0.2s ease',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isLight
                ? 'rgba(116, 142, 99, 0.5)'
                : 'rgba(159, 184, 146, 0.5)',
            },
            '*::-webkit-scrollbar-thumb:active': {
              backgroundColor: isLight
                ? 'rgba(116, 142, 99, 0.7)'
                : 'rgba(159, 184, 146, 0.7)',
            },
            // Firefox scrollbar styling
            scrollbarWidth: 'thin',
            scrollbarColor: isLight
              ? 'rgba(116, 142, 99, 0.3) rgba(0, 0, 0, 0.05)'
              : 'rgba(159, 184, 146, 0.3) rgba(255, 255, 255, 0.05)',
          },
        },
      },

      // ==================== BUTTONS ====================
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: PRIMARY.dark,
            },
          },
          containedSecondary: {
            '&:hover': {
              backgroundColor: SECONDARY.dark,
            },
          },
          outlined: {
            borderWidth: 1.5,
            '&:hover': {
              borderWidth: 1.5,
            },
          },
          text: {
            padding: '8px 16px',
          },
          sizeLarge: {
            padding: '12px 28px',
            fontSize: '0.9375rem',
          },
          sizeSmall: {
            padding: '6px 16px',
            fontSize: '0.8125rem',
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: alpha(PRIMARY.main, 0.08),
            },
          },
          colorPrimary: {
            color: PRIMARY.main,
            '&:hover': {
              backgroundColor: alpha(PRIMARY.main, 0.12),
            },
          },
          colorSecondary: {
            color: SECONDARY.main,
            '&:hover': {
              backgroundColor: alpha(SECONDARY.main, 0.12),
            },
          },
        },
      },

      // ==================== CARDS & PAPER ====================
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: isLight
              ? '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.10)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.14)',
              borderColor: isLight
                ? 'rgba(0, 0, 0, 0.12)'
                : 'rgba(255, 255, 255, 0.12)',
            },
            // Custom scrollbar for cards with overflow
            '&::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight
                ? 'rgba(0, 0, 0, 0.03)'
                : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isLight
                ? PRIMARY.main
                : PRIMARY.light,
              borderRadius: '10px',
              border: isLight
                ? '2px solid rgba(0, 0, 0, 0.03)'
                : '2px solid rgba(255, 255, 255, 0.03)',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isLight
                ? PRIMARY.dark
                : PRIMARY.main,
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
            border: isLight
              ? '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            // Custom scrollbar for paper components with overflow
            '&::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight
                ? 'rgba(0, 0, 0, 0.03)'
                : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isLight
                ? PRIMARY.main
                : PRIMARY.light,
              borderRadius: '10px',
              border: isLight
                ? '2px solid rgba(0, 0, 0, 0.03)'
                : '2px solid rgba(255, 255, 255, 0.03)',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isLight
                ? PRIMARY.dark
                : PRIMARY.main,
            },
          },
          elevation0: {
            border: 'none',
            boxShadow: 'none',
          },
          elevation1: {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.08)',
          },
          elevation2: {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.10)',
          },
          elevation3: {
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.07), 0px 4px 8px rgba(0, 0, 0, 0.12)',
          },
          elevation4: {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.14)',
          },
          elevation5: {
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.09), 0px 8px 16px rgba(0, 0, 0, 0.15)',
          },
          elevation6: {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.10), 0px 10px 20px rgba(0, 0, 0, 0.16)',
          },
          elevation8: {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.11), 0px 14px 28px rgba(0, 0, 0, 0.18)',
          },
          elevation12: {
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.13), 0px 22px 44px rgba(0, 0, 0, 0.21)',
          },
          elevation16: {
            boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.15), 0px 30px 60px rgba(0, 0, 0, 0.24)',
          },
          elevation24: {
            boxShadow: '0px 24px 48px rgba(0, 0, 0, 0.19), 0px 46px 92px rgba(0, 0, 0, 0.29)',
          },
          outlined: {
            border: isLight
              ? '1px solid rgba(0, 0, 0, 0.12)'
              : '1px solid rgba(255, 255, 255, 0.12)',
          },
        },
      },

      // ==================== INPUTS ====================
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: BACKGROUND.paper,
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: BACKGROUND.paper,
            transition: 'all 0.2s ease-in-out',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: PRIMARY.light,
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: PRIMARY.main,
                borderWidth: 2,
              },
            },
          },
          notchedOutline: {
            borderColor: isLight
              ? 'rgba(0, 0, 0, 0.23)'
              : 'rgba(255, 255, 255, 0.23)',
          },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: BACKGROUND.paper,
          },
          input: {
            '&::placeholder': {
              color: TEXT.disabled,
              opacity: 1,
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: TEXT.secondary,
            '&.Mui-focused': {
              color: PRIMARY.main,
            },
          },
        },
      },

      // ==================== LISTS ====================
      MuiList: {
        styleOverrides: {
          root: {
            padding: '8px 0',
          },
        },
      },

      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            marginBottom: 4,
            transition: 'background-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: alpha(PRIMARY.main, 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(PRIMARY.main, 0.12),
              '&:hover': {
                backgroundColor: alpha(PRIMARY.main, 0.16),
              },
            },
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: alpha(PRIMARY.main, 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(PRIMARY.main, 0.12),
              '&:hover': {
                backgroundColor: alpha(PRIMARY.main, 0.16),
              },
            },
          },
        },
      },

      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: PRIMARY.main,
            minWidth: 40,
          },
        },
      },

      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: TEXT.primary,
            fontWeight: 500,
          },
          secondary: {
            color: TEXT.secondary,
          },
        },
      },

      // ==================== DRAWER ====================
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
            backgroundColor: BACKGROUND.paper,
            borderRight: isLight
              ? '1px solid rgba(0, 0, 0, 0.12)'
              : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
            // Custom scrollbar for drawer
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight
                ? 'rgba(0, 0, 0, 0.03)'
                : 'rgba(255, 255, 255, 0.03)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isLight
                ? PRIMARY.main
                : PRIMARY.light,
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isLight
                ? PRIMARY.dark
                : PRIMARY.main,
            },
          },
        },
      },

      // ==================== APPBAR ====================
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12), 0px 4px 12px rgba(0, 0, 0, 0.08)',
          },
          colorPrimary: {
            backgroundColor: PRIMARY.main,
            color: PRIMARY.contrastText,
          },
        },
      },

      // ==================== CHIP ====================
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            border: '1px solid transparent',
          },
          colorPrimary: {
            backgroundColor: PRIMARY.main,
            color: PRIMARY.contrastText,
            borderColor: PRIMARY.dark,
          },
          colorSecondary: {
            backgroundColor: SECONDARY.main,
            color: SECONDARY.contrastText,
            borderColor: SECONDARY.dark,
          },
          outlined: {
            borderWidth: '1.5px',
          },
        },
      },

      // ==================== DIALOG ====================
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: isLight
              ? '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.13), 0px 22px 44px rgba(0, 0, 0, 0.21)',
            // Custom scrollbar for dialogs
            '&::-webkit-scrollbar': {
              width: '10px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight
                ? 'rgba(0, 0, 0, 0.03)'
                : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isLight
                ? PRIMARY.main
                : PRIMARY.light,
              borderRadius: '10px',
              border: isLight
                ? '2px solid rgba(0, 0, 0, 0.03)'
                : '2px solid rgba(255, 255, 255, 0.03)',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isLight
                ? PRIMARY.dark
                : PRIMARY.main,
            },
          },
        },
      },

      // ==================== DIVIDER ====================
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight
              ? 'rgba(0, 0, 0, 0.12)'
              : 'rgba(255, 255, 255, 0.12)',
          },
        },
      },

      // ==================== BACKDROP ====================
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        },
      },

      // ==================== TABLE ====================
      MuiTableContainer: {
        styleOverrides: {
          root: {
            border: isLight
              ? '1px solid rgba(0, 0, 0, 0.10)'
              : '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: 12,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.06)',
            // Custom scrollbar for table containers
            '&::-webkit-scrollbar': {
              width: '12px',
              height: '12px',
            },
            '&::-webkit-scrollbar-track': {
              background: isLight
                ? 'rgba(0, 0, 0, 0.03)'
                : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isLight
                ? PRIMARY.main
                : PRIMARY.light,
              borderRadius: '10px',
              border: isLight
                ? '3px solid rgba(0, 0, 0, 0.03)'
                : '3px solid rgba(255, 255, 255, 0.03)',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isLight
                ? PRIMARY.dark
                : PRIMARY.main,
            },
            '&::-webkit-scrollbar-corner': {
              background: isLight
                ? 'rgba(0, 0, 0, 0.03)'
                : 'rgba(255, 255, 255, 0.03)',
            },
          },
        },
      },

      MuiTable: {
        styleOverrides: {
          root: {
            borderCollapse: 'separate',
            borderSpacing: 0,
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isLight
              ? 'rgba(0, 0, 0, 0.10)'
              : 'rgba(255, 255, 255, 0.10)',
            padding: '16px',
          },
          head: {
            fontWeight: 600,
            fontSize: '0.875rem',
            color: TEXT.primary,
            backgroundColor: alpha(PRIMARY.main, isLight ? 0.08 : 0.15),
            borderBottom: isLight
              ? '2px solid rgba(0, 0, 0, 0.12)'
              : '2px solid rgba(255, 255, 255, 0.12)',
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: alpha(PRIMARY.main, 0.05),
            },
            '&:last-child td': {
              borderBottom: 0,
            },
            '&.Mui-selected': {
              backgroundColor: alpha(PRIMARY.main, 0.10),
              '&:hover': {
                backgroundColor: alpha(PRIMARY.main, 0.14),
              },
            },
          },
        },
      },

      // ==================== TABS ====================
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9375rem',
            minHeight: 48,
            transition: 'color 0.2s ease-in-out',
            '&:hover': {
              color: PRIMARY.main,
            },
            '&.Mui-selected': {
              color: PRIMARY.main,
              fontWeight: 600,
            },
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: PRIMARY.main,
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },

      // ==================== SWITCH ====================
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
          },
          switchBase: {
            padding: 1,
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: PRIMARY.main,
                opacity: 1,
              },
            },
          },
          thumb: {
            width: 24,
            height: 24,
          },
          track: {
            borderRadius: 13,
            backgroundColor: isLight
              ? alpha(TEXT.primary, 0.38)
              : alpha(TEXT.primary, 0.5),
            opacity: 1,
          },
        },
      },

      // ==================== TOOLTIP ====================
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: alpha(TEXT.primary, 0.92),
            fontSize: '0.75rem',
            borderRadius: 6,
            padding: '8px 12px',
          },
          arrow: {
            color: alpha(TEXT.primary, 0.92),
          },
        },
      },

      // ==================== BADGE ====================
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontWeight: 600,
          },
          colorPrimary: {
            backgroundColor: PRIMARY.main,
          },
          colorSecondary: {
            backgroundColor: ACCENT.main,
            color: ACCENT.contrastText,
          },
        },
      },

      // ==================== ALERT ====================
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          standardSuccess: {
            backgroundColor: alpha(SUCCESS.main, 0.1),
            color: SUCCESS.dark,
          },
          standardError: {
            backgroundColor: alpha(ERROR.main, 0.1),
            color: ERROR.dark,
          },
          standardWarning: {
            backgroundColor: alpha(WARNING.main, 0.1),
            color: WARNING.dark,
          },
          standardInfo: {
            backgroundColor: alpha(INFO.main, 0.1),
            color: INFO.dark,
          },
        },
      },

      // ==================== CIRCULAR PROGRESS ====================
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: PRIMARY.main,
          },
        },
      },

      // ==================== LINEAR PROGRESS ====================
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor: alpha(PRIMARY.main, 0.12),
          },
          bar: {
            borderRadius: 4,
            backgroundColor: PRIMARY.main,
          },
        },
      },
    },
  });
};

// Export the theme creation function
export default getTheme;
