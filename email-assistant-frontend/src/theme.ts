import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60A5FA',
      dark: '#3B82F6',
      light: '#93C5FD',
      contrastText: '#0B1220',
    },
    secondary: {
      main: '#2DD4BF',
      dark: '#14B8A6',
      light: '#5EEAD4',
    },
    background: {
      default: '#0B1020',
      paper: '#111827',
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#94A3B8',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", Tahoma, sans-serif',
    h2: {
      fontFamily: '"Plus Jakarta Sans", "Source Sans 3", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      fontSize: '2rem',
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", "Source Sans 3", sans-serif',
      fontWeight: 700,
      fontSize: '1.2rem',
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", "Source Sans 3", sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 10px 28px rgba(2, 6, 23, 0.45)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#94A3B8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9,
        },
      },
    },
  },
});

export default theme;
