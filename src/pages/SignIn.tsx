import React, { FormEventHandler, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import { Link as RouterLink, Redirect, useLocation } from 'react-router-dom';
import History from 'history';
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

import GoogleIcon from '../assets/icons/GoogleIcon';
import ROUTES from '../constants/routes';
import Logo from '../components/Logo';
import PageMetadata from '../components/PageMetadata';
import Spinner from '../components/Spinner';
import { auth } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const SignIn: React.FC = () => {
  const location = useLocation<Maybe<{ from: History.Location }>>();
  const [authUser, authLoading] = useAuthState(auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const { from } = location.state ?? {
    from: { pathname: ROUTES.MATCHES_LIST },
  };

  if (authUser) {
    return <Redirect to={from} />;
  }

  const handleEmailLogin: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signInWithRedirect(auth, new GoogleAuthProvider())
      .catch(setError)
      .finally(() => setGoogleLoading(false));
  };

  return authLoading ? (
    <Spinner />
  ) : (
    <Container sx={{ mt: -9 }}>
      <PageMetadata title="Anmelden – Daddel" />
      <Logo />
      <Typography variant="h6">Anmelden</Typography>
      <form
        autoComplete="off"
        onSubmit={handleEmailLogin}
        onChange={() => setError(null)}
      >
        <Grid container spacing={2} flexDirection="column">
          <Grid item md={9}>
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
            <Button
              type="submit"
              size="large"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={18} thickness={3} />
                ) : null
              }
              fullWidth
            >
              Anmelden
            </Button>
          </Grid>
          {error && (
            <Grid item md={9}>
              <Alert severity="error">Fehler: {error.message}</Alert>
            </Grid>
          )}
          <Grid item md={9} sx={{ mt: 3 }}>
            <Button
              size="large"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              startIcon={
                googleLoading ? (
                  <CircularProgress size={18} thickness={3} />
                ) : (
                  <GoogleIcon />
                )
              }
              fullWidth
              sx={{ mb: 6 }}
            >
              Mit Google anmelden
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography sx={{ mb: 1 }}>Noch kein Konto?</Typography>
      <Button component={RouterLink} to={ROUTES.REGISTER} sx={{ mb: 4 }}>
        Registrieren
      </Button>

      <Typography>
        <Link component={RouterLink} to={ROUTES.RESET} color="textPrimary">
          Passwort vergessen?
        </Link>
      </Typography>
    </Container>
  );
};

export default SignIn;
