import { CircularProgress, Grid } from '@mui/material';
import React, { FunctionComponent } from 'react';

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
