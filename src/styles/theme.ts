import { grey } from '@mui/material/colors';
import { Theme, createTheme as createMuiTheme } from '@mui/material/styles';

export const createTheme = (color: string): Theme =>
  createMuiTheme({
    palette: {
      primary: {
        main: color,
      },
      secondary: {
        main: color,
      },
      background: {
        default: grey[900],
      },
      mode: 'dark',
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1500, // default 1200
        xl: 1800, // default 1536
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'outlined',
          color: 'inherit',
        },
      },
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
  });
