import { createTheme } from '@mui/material/styles';

// Create a theme with enhanced accessibility features
const theme = createTheme({
  palette: {
    primary: {
      main: '#0D47A1', // Darker blue for better contrast
      light: '#2962FF',
      dark: '#002171',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6A1B9A', // Darker purple for better contrast
      light: '#9C27B0',
      dark: '#4A148C',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#C62828', // Darker red for better contrast
      light: '#E53935',
      dark: '#B71C1C',
    },
    warning: {
      main: '#EF6C00', // Darker orange for better contrast
      light: '#FF9800',
      dark: '#E65100',
    },
    info: {
      main: '#0277BD', // Darker blue for better contrast
      light: '#03A9F4',
      dark: '#01579B',
    },
    success: {
      main: '#2E7D32', // Darker green for better contrast
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    text: {
      primary: '#212121',
      secondary: '#424242', // Darker than default for better contrast
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16, // Slightly larger base font size for better readability
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // Improves readability of button text
      fontWeight: 500,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.9375rem',
          fontWeight: 500,
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#002171', // Ensuring hover state has sufficient contrast
          },
        },
        outlined: {
          borderWidth: 2, // Thicker border for better visibility
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              fontWeight: 500,
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'underline', // Improves link identification
          fontWeight: 500,
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 8,
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 8,
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #000000',
            outlineOffset: 2,
          },
        },
      },
    },
  },
});

export default theme; 