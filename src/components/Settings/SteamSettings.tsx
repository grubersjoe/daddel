import { Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

import SteamAuthentication from '../Auth/SteamAuthentication';

const SteamSettings: FunctionComponent = () => (
  <>
    <Typography variant="h6">Steam-Konto verbinden</Typography>
    <Typography variant="body1" color="textSecondary" gutterBottom>
      Melde dich bei Steam an, um deine Spiele aufzulisten, wenn du ein Match
      anlegst.
    </Typography>
    <SteamAuthentication />
  </>
);

export default SteamSettings;
