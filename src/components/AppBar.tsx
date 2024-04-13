import { Box, AppBar as MuiAppBar, Toolbar, Typography } from '@mui/material';
import { ReactElement } from 'react';

interface Props {
  children?: ReactElement;
  title?: string;
}

const AppBar = ({ children, title }: Props) => (
  <MuiAppBar position="fixed">
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        {title && (
          <Typography component="h1" variant="h6">
            {title}
          </Typography>
        )}
        {children && <Box flexGrow={1}>{children}</Box>}
      </Toolbar>
    </Box>
  </MuiAppBar>
);

export default AppBar;
