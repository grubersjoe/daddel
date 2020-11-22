import React, {
  useContext,
  useEffect,
  useState,
  FormEventHandler,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { signOut } from '../api/auth';
import firebase from '../api/firebase';
import { User } from '../types';
import { theme } from '../styles/theme';
import AppBar from '../components/AppBar';
import { SnackbarContext } from '../components/Layout';
import NotificationSettings from '../components/Settings/NotificationSettings';
import { supportsMessaging } from '../utils';

const Settings: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatchSnack = useContext(SnackbarContext);

  const { currentUser } = firebase.auth;

  const [user, userLoading, userError] = useDocumentDataOnce<User>(
    firebase.firestore.doc(`users/${currentUser?.uid}`),
    { idField: 'uid' },
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nickname, setNickname] = useState('Lade …');

  useEffect(() => {
    if (user && nickname === 'Lade …') {
      setNickname(user.nickname);
    }
  }, [user, nickname]);

  if (userError) {
    setError(userError);
  }

  const submitNickname: FormEventHandler = event => {
    event.preventDefault();

    if (!currentUser) {
      throw new Error('No user authenticated');
    }

    setLoading(true);
    firebase.firestore
      .collection('users')
      .doc(currentUser.uid)
      .set({ nickname }, { merge: true })
      .then(() => dispatchSnack('Name geändert'))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const deleteAccount: FormEventHandler = event => {
    event.preventDefault();

    if (!currentUser) {
      throw new Error('No user authenticated');
    }

    if (window.confirm('Konto wirklich löschen?')) {
      setLoading(true);
      currentUser
        .delete()
        .catch(setError)
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <AppBar title="Einstellungen" />
      <Container style={{ marginTop: -theme.spacing(2) }}>
        <form
          autoComplete="off"
          onSubmit={submitNickname}
          onChange={() => setError(null)}
        >
          <Grid container spacing={2} direction="column">
            <Grid item md={7}>
              <Typography variant="h6">Nickname</Typography>
              <TextField
                variant="outlined"
                placeholder="Nickname"
                value={nickname}
                onChange={event => setNickname(event.target.value)}
                disabled={userLoading || Boolean(userError)}
                fullWidth
                required
              />
            </Grid>
            <Grid item md={7}>
              <Button
                type="submit"
                variant="outlined"
                disabled={userLoading || loading}
                fullWidth
              >
                Name ändern
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" style={{ marginTop: theme.spacing(2) }}>
            Fehler: {error.message}
          </Alert>
        )}

        {supportsMessaging() && (
          <Grid
            container
            spacing={2}
            direction="column"
            style={{ marginTop: theme.spacing(4) }}
          >
            <Grid item md={7}>
              <NotificationSettings />
            </Grid>
          </Grid>
        )}

        <Grid
          container
          spacing={2}
          direction="column"
          style={{ marginTop: theme.spacing(6) }}
        >
          <Grid item md={7}>
            <Button
              variant="outlined"
              startIcon={<SignOutIcon />}
              onClick={() => signOut(history)}
              fullWidth
            >
              Abmelden
            </Button>
          </Grid>
          <Grid item md={7}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={deleteAccount}
              fullWidth
            >
              Konto löschen
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default withRouter(Settings);