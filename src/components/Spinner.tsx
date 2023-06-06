import { Box, CircularProgress } from '@mui/material';
import React, { FunctionComponent } from 'react';

const Spinner: FunctionComponent = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pt: 4,
    }}
  >
    <CircularProgress />
  </Box>
);

export default Spinner;
