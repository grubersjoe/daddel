import { Alert, Button, Grid, Typography } from '@mui/material';
import { MouseEventHandler, useContext, useState } from 'react';

import useMessagingSupported from '../../hooks/useMessagingSupported';
import useNotifications from '../../hooks/useNotifications';
import ButtonProgress from '../ButtonProgress';
import { SnackbarContext } from '../Layout';

const NotificationsSettings = () => {
  const {
    subscribe,
    unsubscribe,
    deviceRegistered,
    loading: fcmLoading,
  } = useNotifications();

  const messagingSupported = useMessagingSupported();

  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);

  const dispatchSnack = useContext(SnackbarContext);
  const loading = fcmLoading || !permissionState;

  if (!messagingSupported) {
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

  const handleSubscribe: MouseEventHandler = () =>
    subscribe().catch(() =>
      dispatchSnack(
        'Benachrichtigungen konnten nicht aktiviert werden',
        'error',
      ),
    );

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
    <Grid container spacing={2} flexDirection="column">
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
              onClick={handleSubscribe}
              disabled={loading || permissionState === 'denied'}
              startIcon={loading && <ButtonProgress />}
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
              onClick={handleUnsubscribe}
              disabled={loading}
              startIcon={loading && <ButtonProgress />}
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
