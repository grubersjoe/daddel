import React from 'react';
import { Box } from '@mui/material';

import { UNKNOWN_GAME_ID } from '../../constants';
import { Game } from '../../types';

const FallbackBanner: React.FC<{ game: Game }> = ({ game }) => {
  const isUnknownGame = game.id === UNKNOWN_GAME_ID;

  return (
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
          margin: '-28px 1em 0 1em',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: isUnknownGame
            ? 'clamp(1rem, 20vw, 120px)'
            : 'clamp(1.25rem, 2vw, 1.5rem)',
          lineHeight: 1.4,
          userSelect: 'none',
        }}
      >
        {isUnknownGame ? <span title="Unbekanntes Spiel">?</span> : game.name}
      </Box>
    </Box>
  );
};

export default FallbackBanner;
