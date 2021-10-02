import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import DaddelIcon from '../assets/icons/DaddelIcon';

const Logo: React.FC = () => (
  <Link to="/">
    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
      <DaddelIcon color="primary" sx={{ fontSize: '4.5rem', mr: 3 }} />
      <Typography
        variant="h1"
        sx={{
          fontSize: '240%',
          fontWeight: 'bold',
        }}
      >
        Daddel
      </Typography>
    </Box>
    <Typography variant="subtitle1" sx={{ mb: 4 }}>
      Plane Spieleabende mit Deinen FreundInnen
    </Typography>
  </Link>
);

export default Logo;
