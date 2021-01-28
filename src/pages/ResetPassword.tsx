import React, { useState, FormEventHandler } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { resetPassword } from '../services/auth';
import ROUTES from '../constants/routes';
import Logo from '../components/Logo';
import PageMetadata from '../components/PageMetadata';

const ResetPassword: React.FC = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const resetAccount: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);
    resetPassword(email)
      .then(() => setSuccess(true))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <Container style={{ marginTop: -theme.spacing(9) }}>
      <PageMetadata title="Passwort zurücksetzen – Daddel" />
      <Logo />
      <Typography variant="h6">Passwort zurücksetzen</Typography>
      <form
        autoComplete="off"
        onSubmit={resetAccount}
        onChange={() => setError(null)}
        style={{ marginBottom: theme.spacing(2) }}
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

          <Grid item md={9} style={{ marginBottom: theme.spacing(4) }}>
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

      <Typography>
        <Link component={RouterLink} to={ROUTES.ROOT} color="textPrimary">
          Zurück zur Anmeldung
        </Link>
      </Typography>
    </Container>
  );
};

export default ResetPassword;
