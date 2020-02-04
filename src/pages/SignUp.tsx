import React, { useState, FormEventHandler } from 'react';
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import firebase from '../api/firebase';
import * as ROUTES from '../constants/routes';
import { theme } from '../styles/theme';

import { createUser } from '../api/auth';
import Logo from '../components/Logo';

const ErrorMessage = styled(Typography)({
  margin: `${theme.spacing(3)}px 0`,
  fontSize: '100%',
});

const SignUp: React.FC<RouteComponentProps> = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleRegister: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);
    createUser(email, password)
      .then(data => {
        if (!data?.user?.uid) throw new Error('Unable to create user');
        firebase.firestore
          .collection('users')
          .doc(data.user.uid)
          .set({ nickname });
        history.push('/matches');
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <Container style={{ marginTop: theme.spacing(2) }}>
      <Logo />
      <h2>Registrieren</h2>
      <form
        autoComplete="off"
        onSubmit={handleRegister}
        style={{ marginBottom: theme.spacing(4) }}
      >
        <Grid container md={9} spacing={2} direction="column">
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
            <TextField
              label="Nickname"
              variant="outlined"
              size="small"
              onChange={event => setNickname(event.target.value)}
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
              Registrieren
            </Button>
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
          </Grid>
        </Grid>
      </form>
      <div>
        <Link component={RouterLink} to={ROUTES.ROOT} color="textPrimary">
          Zurück zur Anmeldung
        </Link>
      </div>
    </Container>
  );
};

export default withRouter(SignUp);
