import { createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import amber from '@material-ui/core/colors/yellow';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: amber[700],
    },
    secondary: {
      main: amber[700],
    },
    type: 'dark',
  },
});

export type Theme = typeof theme;
