import { createTheme } from '@mui/material/styles';

const lloydsPalette = {
  primary: {
    main: '#005A42', // Lloyds green
    contrastText: '#fff',
  },
  secondary: {
    main: '#003B2A', // Darker green/black
    contrastText: '#fff',
  },
  background: {
    default: '#F5F6F7', // Light grey background
    paper: '#fff',
  },
  text: {
    primary: '#1A1A1A', // Lloyds dark text
    secondary: '#005A42', // Lloyds green for accents
  },
  success: {
    main: '#43B02A', // Lloyds accent green
  },
  error: {
    main: '#E4002B', // Lloyds red
  },
  warning: {
    main: '#FFB81C', // Lloyds yellow
  },
  info: {
    main: '#007A33', // Lloyds teal
  },
};

const lloydsFontFamily = [
  '"GT-Ultra"',
  'Arial',
  'Helvetica',
  'sans-serif',
].join(',');

export const theme = createTheme({
  palette: lloydsPalette,
  typography: {
    fontFamily: lloydsFontFamily,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'GT-Ultra';
          src: url('/fonts/GT-Ultra-Standard-Regular.woff2') format('woff2'),
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'GT-Ultra';
          src: url('/fonts/GT-Ultra-Standard-Bold.woff2') format('woff2'),
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});