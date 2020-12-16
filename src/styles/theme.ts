import { createMuiTheme } from '@material-ui/core/styles';
import { PaletteType } from '@material-ui/core';

export const createTheme = (color: string, type: PaletteType = 'dark') =>
  createMuiTheme({
    palette: {
      primary: {
        main: color,
      },
      secondary: {
        main: color,
      },
      type,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1500, // default 1280
        xl: 1800, // default 1920
      },
    },
  });
