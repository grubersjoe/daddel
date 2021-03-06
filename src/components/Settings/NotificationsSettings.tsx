import React, { useContext, useState, MouseEventHandler } from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useNotifications from '../../hooks/useNotifications';
import { SnackbarContext } from '../Layout';
import { supportsMessaging } from '../../utils';

const NotificationsSettings: React.FC = () => {
  const {
    subscribe,
    unsubscribe,
    deviceRegistered,
    loading: fcmLoading,
  } = useNotifications();

  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);

  const dispatchSnack = useContext(SnackbarContext);
  const loading = fcmLoading || !permissionState;

  if (!supportsMessaging()) {
    return null;
  }

  navigator.permissions
    .query({
      name: 'notifications',
    })
    .then(status => {
      setPermissionState(status.state);
      status.onchange = function () {
        setPermissionState(this.state);
      };
    });

  const handleSubscribe: MouseEventHandler = () => {
    subscribe().catch(() =>
      dispatchSnack(
        'Benachrichtigungen konnten nicht aktiviert werden',
        'error',
      ),
    );
  };

  const handleUnsubscribe: MouseEventHandler = () =>
    unsubscribe()
      .then(() => dispatchSnack('Benachrichtigungen deaktiviert'))
      .catch(() =>
        dispatchSnack(
          'Benachrichtigungen konnten nicht deaktiviert werden',
          'error',
        ),
      );

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography variant="h6">Push-Notifications</Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Hier kannst du Push-Notifications für das aktuelle Gerät einstellen.
          Du wirst dann benachrichtigt, wenn z. B. ein neues Spiel erstellt
          wird.
        </Typography>
      </Grid>

      {!deviceRegistered && (
        <>
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleSubscribe}
              disabled={loading || permissionState === 'denied'}
              startIcon={
                loading && (
                  <CircularProgress color="inherit" size={18} thickness={3} />
                )
              }
              fullWidth
            >
              {loading ? 'Lade …' : 'Benachrichtigungen aktivieren'}
            </Button>
          </Grid>
          {permissionState === 'denied' && (
            <Grid item>
              <Alert severity="warning" variant="outlined" icon={false}>
                Benachrichtigungen werden blockiert. Wenn du diese Funktion
                nutzen möchtest, musst du die Berechtigung erteilen.
              </Alert>
            </Grid>
          )}
        </>
      )}

      {deviceRegistered && (
        <>
          {permissionState === 'granted' && (
            <Grid item>
              <Alert severity="success">
                Benachrichtigungen sind aktiviert
              </Alert>
            </Grid>
          )}
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleUnsubscribe}
              disabled={loading}
              startIcon={
                loading && (
                  <CircularProgress color="inherit" size={18} thickness={3} />
                )
              }
              fullWidth
            >
              Benachrichtigungen deaktivieren
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default NotificationsSettings;
