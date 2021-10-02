import React from 'react';
import { CircularProgress, Grid } from '@mui/material';

const Spinner: React.FC = () => (
  <Grid
    container
    alignItems="center"
    justifyContent="center"
    sx={{ pt: '2rem' }}
  >
    <CircularProgress />
  </Grid>
);

export default Spinner;
