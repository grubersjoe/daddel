import React, { useState, FormEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import grey from '@material-ui/core/colors/grey';

import * as ROUTES from '../constants/routes';
import { theme } from '../styles/theme';

import GoogleIcon from '../assets/icons/GoogleIcon';
import { signInWithEmailAndPassword, signInWithGoogle } from '../api/auth';
import Logo from '../components/Logo';

const Separator = styled(Typography)({
  margin: theme.spacing(3),
  textAlign: 'center',
  color: grey[50],
});

const ErrorMessage = styled(Typography)(
  {
    margin: `${theme.spacing(3)}px 0`,
    fontSize: '100%',
  },
  { withTheme: true },
);

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(email, password)
      .catch(error => {
        setError(error);
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signInWithGoogle()
      .catch(error => {
        setError(error);
        console.error(error);
      })
      .finally(() => setGoogleLoading(false));
  };

  return (
    <Container style={{ maxWidth: 340, margin: theme.spacing(8) }}>
      <Logo />
      <h2>Anmelden</h2>
      <form autoComplete="off" onSubmit={handleEmailLogin}>
        <Grid container spacing={2} direction="column">
          <Grid item>
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
          <Grid item>
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

          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              size="large"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={22} thickness={3} />
                ) : null
              }
              fullWidth
            >
              Anmelden
            </Button>
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
          </Grid>
        </Grid>
      </form>
      <Separator>oder</Separator>
      <Button
        variant="outlined"
        size="large"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        startIcon={
          googleLoading ? (
            <CircularProgress size={22} thickness={3} />
          ) : (
            <GoogleIcon />
          )
        }
        style={{ marginBottom: theme.spacing(6) }}
        fullWidth
      >
        Mit Google anmelden
      </Button>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>Noch kein Konto?</Box>
        <Box>
          <Button component={Link} to={ROUTES.REGISTER}>
            Registrieren
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
