import { Grid, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

import SteamAuthentication from '../Auth/SteamAuthentication';

const SteamSettings: FunctionComponent = () => (
  <Grid container spacing={2} flexDirection="column">
    <Grid item>
      <Typography variant="h6">Steam-Konto verbinden</Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Melde dich bei Steam an, um deine Spiele aufzulisten, wenn du ein Match
        anlegst.
      </Typography>
    </Grid>
    <Grid item>
      <SteamAuthentication />
    </Grid>
  </Grid>
);

export default SteamSettings;
