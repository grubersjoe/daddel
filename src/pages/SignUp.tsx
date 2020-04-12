import React, { useState, FormEventHandler } from 'react';
import {
  Link as RouterLink,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { createUser } from '../api/auth';
import firebase from '../api/firebase';
import ROUTES from '../constants/routes';
import { theme } from '../styles/theme';
import Logo from '../components/Logo';

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
        history.push(ROUTES.MATCHES_LIST);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <Container style={{ marginTop: -theme.spacing(9) }}>
      <Logo />
      <h2>Registrieren</h2>
      <form
        autoComplete="off"
        onSubmit={handleRegister}
        style={{ marginBottom: theme.spacing(4) }}
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
              Jajaja!
            </Button>
          </Grid>
          {error && (
            <Grid item md={9}>
              <Alert severity="error">Fehler: {error.message}</Alert>
            </Grid>
          )}
        </Grid>
      </form>

      <Typography>
        <Link component={RouterLink} to={ROUTES.ROOT} color="textPrimary">
          Zurück zur Anmeldung
        </Link>
      </Typography>
    </Container>
  );
};

export default withRouter(SignUp);
