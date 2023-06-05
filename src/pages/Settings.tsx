import DeleteIcon from '@mui/icons-material/Delete';
import SignOutIcon from '@mui/icons-material/ExitToApp';
import {
  Alert,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { signOut } from 'firebase/auth';
import { updateDoc } from 'firebase/firestore';
import React, {
  FormEventHandler,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

import packageJson from '../../package.json';
import AppBar from '../components/AppBar';
import { SnackbarContext } from '../components/Layout';
import PageMetadata from '../components/PageMetadata';
import NotificationsSettings from '../components/Settings/NotificationsSettings';
import SteamSettings from '../components/Settings/SteamSettings';
import useMessagingSupported from '../hooks/useMessagingSupported';
import { auth, getDocRef } from '../services/firebase';
import { User } from '../types';

const Settings: FunctionComponent = () => {
  const [authUser] = useAuthState(auth);
  const dispatchSnack = useContext(SnackbarContext);

  const messagingSupported = useMessagingSupported();

  const [user, userLoading, userError] = useDocumentDataOnce<User>(
    getDocRef('users', authUser?.uid),
    { idField: 'uid' },
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    if (user && nickname === null) {
      setNickname(user.nickname);
    }
  }, [user, nickname]);

  if (!authUser) {
    return null;
  }

  if (userError) {
    setError(userError);
  }

  const submitNickname: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);

    updateDoc(getDocRef('users', authUser?.uid), { nickname })
      .then(() => dispatchSnack('Name geändert'))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  /**
   * NOTE: The document in the "users" collection is deleted automatically
   * through the onUserDelete cloud function.
   */
  const deleteAccount: FormEventHandler = event => {
    event.preventDefault();

    if (window.confirm('Konto wirklich löschen?')) {
      setLoading(true);

      if (!authUser) {
        throw new Error('No authorized user');
      }

      return authUser
        .delete()
        .catch(setError)
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <PageMetadata title="Einstellungen – Daddel" />
      <AppBar title="Einstellungen" />
      <Container sx={{ mt: 2 }}>
        <form
          autoComplete="off"
          onSubmit={submitNickname}
          onChange={() => setError(null)}
        >
          <Grid container spacing={2} flexDirection="column">
            <Grid item md={7}>
              <Typography variant="h6">Nickname</Typography>
              <TextField
                variant="outlined"
                placeholder="Nickname"
                value={nickname ?? 'Lade …'}
                onChange={event => setNickname(event.target.value)}
                disabled={userLoading || Boolean(userError)}
                fullWidth
                required
              />
            </Grid>
            <Grid item md={7}>
              <Button type="submit" disabled={userLoading || loading} fullWidth>
                Name ändern
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Fehler: {error.message}
          </Alert>
        )}

        <Grid container sx={{ mt: 6 }}>
          <Grid item md={7}>
            <SteamSettings />
          </Grid>
        </Grid>

        {messagingSupported && (
          <>
            <Grid container sx={{ mt: 6 }}>
              <Grid item md={7}>
                <NotificationsSettings />
              </Grid>
            </Grid>
          </>
        )}

        <Grid container spacing={2} flexDirection="column" sx={{ mt: 6 }}>
          <Grid item md={7}>
            <Typography variant="h6">Konto</Typography>
            <Button
              startIcon={<SignOutIcon />}
              onClick={() => signOut(auth)}
              fullWidth
            >
              Abmelden
            </Button>
          </Grid>
          <Grid item md={7}>
            <Button
              startIcon={<DeleteIcon />}
              onClick={deleteAccount}
              fullWidth
            >
              Konto löschen
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item md={7}>
            <Typography sx={{ color: grey[500] }}>
              Daddel {packageJson.version}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Settings;
