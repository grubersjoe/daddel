import React, { MouseEventHandler, useContext, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useNotifications from '../../hooks/useNotifications';
import { SnackbarContext } from '../Layout';

const NotificationSettings = () => {
  const { subscribe, unsubscribe, isSubscribed, loading } = useNotifications();

  const [
    permissionStatus,
    setPermissionStatus,
  ] = useState<PermissionState | null>(null);

  const dispatchSnack = useContext(SnackbarContext);

  navigator.permissions.query({ name: 'notifications' }).then(status => {
    setPermissionStatus(status.state);
    status.onchange = function () {
      setPermissionStatus(this.state);
    };
  });

  function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          dispatchSnack('Berechtigung muss manuell erteilt werden', 'error');
        }
      });
    }
  }

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
    <>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography variant="h6">Push-Notifications</Typography>
          {/* <Typography variant="body2" gutterBottom>
            Hier kannst du Push-Notifications aktivieren. Du wirst dann{' '}
            {MATCH_NOTIFICATION_TIME}&nbsp;Minuten vor Beginn eines Matchs und
            wenn ein neues Spiel erstellt wird benachrichtigt.
          </Typography> */}
          <Typography variant="body2" gutterBottom>
            Hier kannst du Push-Notifications aktivieren. Du wirst dann
            benachrichtigt, wenn ein neues Spiel erstellt wird.
          </Typography>
        </Grid>

        {!isSubscribed && (
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleSubscribe}
              disabled={loading || permissionStatus === 'denied'}
              startIcon={
                loading ? (
                  <CircularProgress color="inherit" size={18} thickness={3} />
                ) : null
              }
              fullWidth
            >
              {loading ? 'Lade …' : 'Benachrichtigungen aktivieren'}
            </Button>
          </Grid>
        )}

        {isSubscribed && (
          <>
            {permissionStatus === 'granted' ? (
              <Grid item>
                <Alert severity="success">
                  Benachrichtigungen sind aktiviert
                </Alert>
              </Grid>
            ) : (
              <>
                <Grid item>
                  <Alert severity="warning">
                    Es fehlt die Berechtigung Benachrichtigungen zu senden.
                    Erteile diese wenn du die Funktion weiterhin nutzen
                    möchtest.
                  </Alert>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={requestNotificationPermission}
                    fullWidth
                  >
                    Benachrichtigungen erlauben
                  </Button>
                </Grid>
              </>
            )}
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleUnsubscribe}
                disabled={loading || permissionStatus !== 'granted'}
                startIcon={
                  loading ? (
                    <CircularProgress color="inherit" size={18} thickness={3} />
                  ) : null
                }
                fullWidth
              >
                Benachrichtigungen deaktivieren
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default NotificationSettings;
