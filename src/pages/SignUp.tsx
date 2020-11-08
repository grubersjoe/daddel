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

import { createUser, isValidInvitationCode } from '../api/auth';
import firebase from '../api/firebase';
import ROUTES from '../constants/routes';
import { theme } from '../styles/theme';
import Logo from '../components/Logo';

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
      createUser(email, password)
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
    <Container style={{ marginTop: -theme.spacing(9) }}>
      <Logo />
      <Typography variant="h6">Registrieren</Typography>
      <form
        autoComplete="off"
        onSubmit={register}
        onChange={() => setError(null)}
        style={{ marginBottom: theme.spacing(4) }}
      >
        <Grid container spacing={2} direction="column">
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
            <Grid item md={9}>
              <Alert severity="error">Fehler: {error.message}</Alert>
            </Grid>
          )}
          <Grid item md={9} style={{ marginTop: theme.spacing(1) }}>
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
                  <CircularProgress color="inherit" size={18} thickness={3} />
                ) : null
              }
              fullWidth
            >
              Jajaja
            </Button>
          </Grid>
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
