import React, { useState, useContext, FormEventHandler } from 'react';
import { Link as RouterLink, Redirect, useLocation } from 'react-router-dom';
import History from 'history';
import { useTheme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import ROUTES from '../constants/routes';

import GoogleIcon from '../assets/icons/GoogleIcon';
import { signInWithEmailAndPassword, signInWithGoogle } from '../services/auth';
import { AuthUserContext } from '../components/App';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

const SignIn: React.FC = () => {
  const location = useLocation<{ from: History.Location }>();
  const [authUser, authLoading] = useContext(AuthUserContext);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const { from } = location.state || {
    from: { pathname: ROUTES.MATCHES_LIST },
  };

  if (authUser) {
    return <Redirect to={from} />;
  }

  const handleEmailLogin: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(email, password)
      .then()
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signInWithGoogle()
      .catch(setError)
      .finally(() => setGoogleLoading(false));
  };

  return authLoading ? (
    <Spinner />
  ) : (
    <Container style={{ marginTop: -theme.spacing(9) }}>
      <Logo />
      <Typography variant="h6">Anmelden</Typography>
      <form
        autoComplete="off"
        onSubmit={handleEmailLogin}
        onChange={() => setError(null)}
      >
        <Grid container spacing={2} direction="column">
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
              variant="outlined"
              color="primary"
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
          <Grid item md={9} style={{ marginTop: theme.spacing(3) }}>
            <Button
              variant="outlined"
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
              style={{ marginBottom: theme.spacing(6) }}
            >
              Mit Google anmelden
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography style={{ marginBottom: theme.spacing(1) }}>
        Noch kein Konto?
      </Typography>
      <Button
        variant="outlined"
        component={RouterLink}
        to={ROUTES.REGISTER}
        style={{ marginBottom: theme.spacing(4) }}
      >
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
