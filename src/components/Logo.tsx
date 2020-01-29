import React from 'react';
import DaddelIcon from '@material-ui/icons/VideogameAssetSharp';
import Box from '@material-ui/core/Box';

import { theme } from '../styles/theme';

const Logo: React.FC = () => (
  <Box
    display="flex"
    style={{ marginBottom: theme.spacing(3) }}
    alignItems="center"
  >
    <DaddelIcon
      color="primary"
      style={{ fontSize: '700%', marginRight: theme.spacing(2.5) }}
    />
    <h1 style={{ fontSize: '250%' }}>Daddel</h1>
  </Box>
);

export default Logo;
