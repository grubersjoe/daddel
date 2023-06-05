import { grey } from '@mui/material/colors';
import { deDE as coreLocale } from '@mui/material/locale';
import { Theme, createTheme as createMuiTheme } from '@mui/material/styles';
import { deDE as dateLocale } from '@mui/x-date-pickers/locales';

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
    // @ts-ignore
    coreLocale,
    dateLocale,
  });
