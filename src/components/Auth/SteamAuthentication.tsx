import FaceIcon from '@mui/icons-material/Face';
import { Alert, Box, Button, Chip, CircularProgress } from '@mui/material';
import React from 'react';

import { useSteamUser } from '../../hooks/useSteamUser';
import { signInSteam, signOutFromSteam } from '../../services/auth';

const SteamAuthentication = () => {
  const { data: steamUser, isLoading, isError, refetch } = useSteamUser();

  if (isError) {
    return (
      <Alert severity="error" sx={{ width: 'max-content' }}>
        Steam nicht erreichbar
      </Alert>
    );
  }

  return (
    <>
      {steamUser && (
        <Box mb={3}>
          <Chip
            icon={<FaceIcon />}
            label={`Angemeldet als ${steamUser.displayName}`}
            variant="filled"
          />
        </Box>
      )}
      <Button
        onClick={() =>
          steamUser ? signOutFromSteam().then(() => refetch()) : signInSteam()
        }
        disabled={isLoading}
        startIcon={
          isLoading ? (
            <CircularProgress color="inherit" size={18} thickness={3} />
          ) : null
        }
      >
        {steamUser ? 'Abmelden' : 'Bei Steam anmelden'}
      </Button>
    </>
  );
};

export default SteamAuthentication;
