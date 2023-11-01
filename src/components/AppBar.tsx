import { AppBar as MuiAppBar, Box, Toolbar, Typography } from '@mui/material';
import React, { FunctionComponent, ReactElement } from 'react';

interface Props {
  children?: ReactElement;
  title?: string;
}

const AppBar: FunctionComponent<Props> = ({ children, title }) => (
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
