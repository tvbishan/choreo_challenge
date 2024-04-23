import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff', // Change this to your primary color
    },
    secondary: {
      main: '#ff6f00', // Change this to your secondary color
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#007bff',
    },
    h5: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Change this to preferred value
    },
  },
});

export default theme;