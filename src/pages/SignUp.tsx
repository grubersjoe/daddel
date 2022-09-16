import React, { FormEventHandler, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import routes from '../constants/routes';
import Logo from '../components/Logo';
import PageMetadata from '../components/PageMetadata';
import { auth, getDocRef } from '../services/firebase';
import { User } from '../types';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState({
    invitationCode: '',
    email: '',
    nickname: '',
    password: '',
    passwordRepeated: '',
  });

  const [errorState, setErrorState] = useState<{
    auth?: Error;
    invitationCode?: Error;
    passwordMismatch?: Error;
  }>({});

  const setFormStateProp = (prop: keyof typeof formState, value: string) =>
    setFormState(state => ({ ...state, [prop]: value }));

  const setErrorStateProp = (
    prop: keyof typeof errorState,
    value: Error | null,
  ) => setErrorState(state => ({ ...state, [prop]: value }));

  const onSubmit: FormEventHandler = event => {
    event.preventDefault();

    if (formState.password !== formState.passwordRepeated) {
      setErrorStateProp(
        'passwordMismatch',
        new Error(
          'Die Passwörter stimmen nicht überein. Bitte versuche es erneut.',
        ),
      );
      return;
    }

    return register();
  };

  const register = async () => {
    setLoading(true);
    setErrorStateProp('invitationCode', null);

    if (await isValidInvitationCode(formState.invitationCode)) {
      createUserWithEmailAndPassword(auth, formState.email, formState.password)
        .then(credential => {
          setDoc<User>(
            getDocRef('users', credential.user.uid),
            { nickname: formState.nickname, invited: true },
            { merge: true },
          ).then(() => navigate(routes.matchList));
        })
        .catch(error => setErrorStateProp('auth', error))
        .finally(() => setLoading(false));
    } else {
      setErrorStateProp(
        'invitationCode',
        new Error('Einladungscode ungültig. Bitte versuche es erneut.'),
      );
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
        onSubmit={onSubmit}
        onChange={() => setErrorState({})}
      >
        <Grid container spacing={2} flexDirection="column">
          <Grid item md={9} sx={{ mb: 2 }}>
            <TextField
              label="Einladungscode"
              helperText={
                errorState.invitationCode
                  ? errorState.invitationCode.message
                  : 'Du kannst dich nur mit gültigem Einladungscode registrieren.'
              }
              type="text"
              variant="outlined"
              size="small"
              onChange={event =>
                setFormStateProp('invitationCode', event.target.value)
              }
              fullWidth
              required
              error={Boolean(errorState.invitationCode)}
            />
          </Grid>
          <Grid item md={9}>
            <TextField
              label="E-Mail-Adresse"
              type="email"
              variant="outlined"
              size="small"
              onChange={event => setFormStateProp('email', event.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item md={9} sx={{ mb: 2 }}>
            <TextField
              label="Nickname"
              variant="outlined"
              size="small"
              onChange={event =>
                setFormStateProp('nickname', event.target.value)
              }
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
              onChange={event =>
                setFormStateProp('password', event.target.value)
              }
              fullWidth
              required
              error={Boolean(errorState.passwordMismatch)}
            />
          </Grid>
          <Grid item md={9} sx={{ mb: 2 }}>
            <TextField
              label="Passwort wiederholen"
              type="password"
              variant="outlined"
              size="small"
              fullWidth
              required
              error={Boolean(errorState.passwordMismatch)}
              onChange={event =>
                setFormStateProp('passwordRepeated', event.target.value)
              }
              helperText={
                errorState.passwordMismatch
                  ? errorState.passwordMismatch.message
                  : undefined
              }
            />
          </Grid>
          {errorState.auth && (
            <Grid item md={9} sx={{ mb: 1 }}>
              <Alert severity="error">{errorState.auth.message}</Alert>
            </Grid>
          )}
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
        <Link component={RouterLink} to={routes.home} color="textPrimary">
          Zurück zur Anmeldung
        </Link>
      </Typography>
    </Container>
  );
};

export default SignUp;
