import { createMuiTheme } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: yellow[700],
    },
    secondary: {
      main: yellow[700],
    },
    type: 'dark',
  },
});

export type Theme = typeof theme;
