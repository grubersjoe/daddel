import React, {
  FormEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { updateDoc } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { signOut } from 'firebase/auth';
import {
  Alert,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import SignOutIcon from '@mui/icons-material/ExitToApp';

import packageJson from '../../package.json';
import { SnackbarContext } from '../components/Layout';
import AppBar from '../components/AppBar';
import PageMetadata from '../components/PageMetadata';
import NotificationsSettings from '../components/Settings/NotificationsSettings';
import useMessagingSupported from '../hooks/useMessagingSupported';
import { getCurrentUserId } from '../services/auth';
import { auth, getDocRef } from '../services/firebase';
import { User } from '../types';

const Settings: React.FC = () => {
  const dispatchSnack = useContext(SnackbarContext);
  const messagingSupported = useMessagingSupported();

  const [user, userLoading, userError] = useDocumentDataOnce<User>(
    getDocRef('users', getCurrentUserId()),
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

  if (userError) {
    setError(userError);
  }

  const submitNickname: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);

    updateDoc(getDocRef('users', getCurrentUserId()), { nickname })
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

      if (!auth.currentUser) {
        throw new Error('No authorized user');
      }

      return auth.currentUser
        .delete()
        .catch(setError)
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <PageMetadata title="Einstellungen – Daddel" />
      <AppBar title="Einstellungen" />
      <Container sx={{ mt: -3 }}>
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

        {messagingSupported && (
          <Grid container sx={{ mt: 4 }}>
            <Grid item md={7}>
              <NotificationsSettings />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2} flexDirection="column" sx={{ mt: 5 }}>
          <Grid item md={7}>
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
