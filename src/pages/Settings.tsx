import DeleteIcon from '@mui/icons-material/Delete';
import SignOutIcon from '@mui/icons-material/ExitToApp';
import {
  Alert,
  Box,
  Button,
  Container,
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
      <Container sx={{ mt: 1 }}>
        <Typography variant="h6">Nickname</Typography>
        <form
          autoComplete="off"
          onSubmit={submitNickname}
          onChange={() => setError(null)}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Nickname"
              value={nickname ?? 'Lade …'}
              onChange={event => setNickname(event.target.value)}
              disabled={userLoading || Boolean(userError)}
              size="small"
              required
            />
            <Button
              type="submit"
              disabled={userLoading || loading}
              sx={{ flexShrink: 0 }}
            >
              Name ändern
            </Button>
          </Box>
        </form>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Fehler: {error.message}
          </Alert>
        )}

        <Box mt={5} maxWidth={400}>
          <SteamSettings />
        </Box>

        {messagingSupported && (
          <Box mt={5} maxWidth={400}>
            <NotificationsSettings />
          </Box>
        )}

        <Box mt={5}>
          <Typography variant="h6">Konto</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button startIcon={<SignOutIcon />} onClick={() => signOut(auth)}>
              Abmelden
            </Button>
            <Button startIcon={<DeleteIcon />} onClick={deleteAccount}>
              Konto löschen
            </Button>
          </Box>
        </Box>

        <Box mt={5}>
          <Typography sx={{ color: grey[500] }}>
            Daddel {packageJson.version}
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Settings;
