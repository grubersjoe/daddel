import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FormEventHandler, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import ButtonProgress from '../components/ButtonProgress';
import Logo from '../components/Logo';
import PageMetadata from '../components/PageMetadata';
import routes from '../constants/routes';
import { auth } from '../services/firebase';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const resetAccount: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => setSuccess(true))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <Container sx={{ mt: -8 }}>
      <PageMetadata title="Passwort zurücksetzen – Daddel" />
      <Logo />
      <Typography variant="h6">Passwort zurücksetzen</Typography>
      <form
        autoComplete="off"
        onSubmit={resetAccount}
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

          <Grid item md={9} sx={{ mb: 4 }}>
            <Button
              color="primary"
              type="submit"
              size="large"
              disabled={loading}
              startIcon={loading ? <ButtonProgress /> : null}
              fullWidth
            >
              Zurücksetzen
            </Button>

            {success && (
              <Grid item md={9}>
                <Typography>
                  Das hat geklappt. Bitte schau in dein Postfach.
                </Typography>
              </Grid>
            )}

            {error && (
              <Grid item md={9}>
                <Alert severity="error">Fehler: {error.message}</Alert>
              </Grid>
            )}
          </Grid>
        </Grid>
      </form>

      <Typography sx={{ mt: 2 }}>
        <Link component={RouterLink} to={routes.home} color="textPrimary">
          Zurück zur Anmeldung
        </Link>
      </Typography>
    </Container>
  );
};

export default ResetPassword;
