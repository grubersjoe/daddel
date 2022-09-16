import React, { FunctionComponent } from 'react';
import { CircularProgress, Grid } from '@mui/material';

const Spinner: FunctionComponent = () => (
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
