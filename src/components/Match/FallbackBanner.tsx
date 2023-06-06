import { Box } from '@mui/material';
import React, { FunctionComponent } from 'react';

import { Game } from '../../types';

const FallbackBanner: FunctionComponent<{ game: Game }> = ({ game }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    width="100%"
    height="100%"
    position="absolute"
  >
    <Box
      sx={{
        textAlign: 'center',
        fontWeight: 600,
        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
        lineHeight: 1.4,
        userSelect: 'none',
      }}
    >
      {game.name}
    </Box>
  </Box>
);

export default FallbackBanner;
