import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const Spinner: React.FC = () => (
  <Grid
    container
    alignItems="center"
    justifyContent="center"
    style={{ paddingTop: '2rem' }}
  >
    <CircularProgress />
  </Grid>
);

export default Spinner;
