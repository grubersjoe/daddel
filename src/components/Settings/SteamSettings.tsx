import { Typography } from '@mui/material';

import SteamAuthentication from '../Auth/SteamAuthentication';

const SteamSettings = () => (
  <>
    <Typography variant="h6">Steam-Konto verbinden</Typography>
    <Typography variant="body1" color="textSecondary" mb={3}>
      Melde dich bei Steam an, um deine Spiele aufzulisten, wenn du ein Match
      anlegst.
    </Typography>
    <SteamAuthentication />
  </>
);

export default SteamSettings;
