import ErrorIcon from '@mui/icons-material/ErrorOutline';
import FaceIcon from '@mui/icons-material/Face';
import { Box, Button, Chip, CircularProgress } from '@mui/material';
import { useState } from 'react';

import { useSteamUser } from '../../hooks/useSteamUser';
import { signInSteam, signOutFromSteam } from '../../services/auth';

const SteamAuthentication = () => {
  const {
    data: steamUser,
    isLoading,
    isError,
    error: apiError,
    refetch,
  } = useSteamUser();

  const [error, setError] = useState<Error>();

  function label() {
    if (apiError) {
      return apiError.message;
    }
    if (error) {
      return error.message;
    }

    return steamUser ? 'Abmelden' : 'Bei Steam anmelden';
  }

  function icon() {
    if (isError) {
      return <ErrorIcon />;
    }

    if (isLoading) {
      return <CircularProgress color="inherit" size={16} thickness={4} />;
    }
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
        onClick={() => {
          if (steamUser) {
            signOutFromSteam()
              .then(() => refetch())
              .catch((error: unknown) => {
                if (error instanceof Error) {
                  setError(error);
                }
              });
          } else {
            signInSteam().catch((error: unknown) => {
              if (error instanceof Error) {
                setError(error);
              }
            });
          }
        }}
        disabled={isLoading || isError}
        startIcon={icon()}
      >
        {label()}
      </Button>
    </>
  );
};

export default SteamAuthentication;
