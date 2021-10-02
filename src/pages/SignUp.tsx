import React, { FormEventHandler, useState } from 'react';
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';

import { isValidInvitationCode } from '../services/auth';
import firebase from '../services/firebase';
import ROUTES from '../constants/routes';
import Logo from '../components/Logo';
import PageMetadata from '../components/PageMetadata';

const SignUp: React.FC<RouteComponentProps> = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [invitationCode, setInvitationCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const register: FormEventHandler = async event => {
    event.preventDefault();
    setLoading(true);

    if (await isValidInvitationCode(invitationCode)) {
      firebase.auth
        .createUserWithEmailAndPassword(email, password)
        .then(data => {
          if (!data?.user?.uid) {
            throw new Error('Unable to create user');
          }

          firebase.firestore
            .collection('users')
            .doc(data.user.uid)
            .set({ nickname, invited: true }, { merge: true });

          history.push(ROUTES.MATCHES_LIST);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    } else {
      setError(new Error('Einladungscode ungültig. Bitte probier es erneut.'));
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: -9 }}>
      <PageMetadata title="Registrieren – Daddel" />
      <Logo />
      <Typography variant="h6">Registrieren</Typography>
      <form
        autoComplete="off"
        onSubmit={register}
        onChange={() => setError(null)}
      >
        <Grid container spacing={2} flexDirection="column">
          <Grid item md={9}>
            <TextField
              label="Einladungscode"
              helperText="Du kannst dich nur mit gültigem Einladungscode registrieren."
              type="text"
              variant="outlined"
              size="small"
              onChange={event => setInvitationCode(event.target.value)}
              fullWidth
              required
            />
          </Grid>
          {error && (
            <Grid item md={9} sx={{ mb: 2 }}>
              <Alert severity="error">Fehler: {error.message}</Alert>
            </Grid>
          )}
          <Grid item md={9} sx={{ mt: 1 }}>
            <TextField
              label="E-Mail-Adresse"
              type="email"
              variant="outlined"
              size="small"
              onChange={event => setEmail(event.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item md={9}>
            <TextField
              label="Passwort"
              type="password"
              variant="outlined"
              size="small"
              onChange={event => setPassword(event.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item md={9}>
            <TextField
              label="Nickname"
              variant="outlined"
              size="small"
              onChange={event => setNickname(event.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item md={9}>
            <Button
              type="submit"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={18} thickness={3} />
                ) : null
              }
              fullWidth
            >
              Registrieren
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography sx={{ mt: 4 }}>
        <Link component={RouterLink} to={ROUTES.ROOT} color="textPrimary">
          Zurück zur Anmeldung
        </Link>
      </Typography>
    </Container>
  );
};

export default withRouter(SignUp);
