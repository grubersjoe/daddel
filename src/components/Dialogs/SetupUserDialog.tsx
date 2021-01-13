import React, {
  useState,
  useEffect,
  FormEventHandler,
  useContext,
} from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import useTheme from '@material-ui/core/styles/useTheme';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import { isValidInvitationCode } from '../../services/auth';
import firebase from '../../services/firebase';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { User } from '../../types';
import { AuthUserContext } from '../App';
import { SnackbarContext } from '../Layout';

/**
 * Required after Google sing in
 * 1. Validate invitation code
 * 2. Set the user nickname
 */
const SetupUserDialog: React.FC<RouteComponentProps> = ({ history }) => {
  const [authUser] = useContext(AuthUserContext);
  const dispatchSnack = useContext(SnackbarContext);

  const theme = useTheme();
  const isOnline = useOnlineStatus();

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [nickname, setNickname] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const [user, userLoading, userError] = useDocumentData<User>(
    firebase.firestore.doc(`users/${authUser?.uid}`),
  );

  // Skip first step if user is already invited
  useEffect(() => {
    if (user && user.invited) {
      setStep(2);
    }
  }, [user]);

  useEffect(() => {
    const userDataMissing = user && (!user.invited || !user.nickname);

    if (isOnline && authUser && !userLoading && !userError && userDataMissing) {
      setIsOpen(true);
    }
  }, [isOnline, authUser, user, userError, userLoading]);

  if (!isOpen) {
    return null;
  }

  if (userError) {
    setError(userError);
  }

  const handleSubmitInvitationCode: FormEventHandler = event => {
    event.preventDefault();

    if (!authUser) {
      throw new Error('No user authenticated');
    }

    setLoading(true);

    isValidInvitationCode(invitationCode)
      .then(isValid => {
        if (isValid) {
          firebase.firestore
            .collection('users')
            .doc(authUser.uid)
            .set({ invited: true }, { merge: true })
            .then(() => {
              setError(null);
              setStep(2);
            })
            .catch(setError);
        } else {
          setError(
            new Error('Einladungscode ungültig. Bitte probier es erneut.'),
          );
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleSubmitNickname: FormEventHandler = event => {
    event.preventDefault();

    if (!authUser) {
      throw new Error('No user authenticated');
    }

    setLoading(true);

    firebase.firestore
      .collection('users')
      .doc(authUser.uid)
      .set({ nickname }, { merge: true })
      .then(() => {
        dispatchSnack('Registrierung abgeschlossen');
        setIsOpen(false);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const title =
    step === 1 ? 'Hast du eine Einladung für Daddel?' : 'Wie heißt du?';

  switch (step) {
    case 1:
      return (
        <Dialog open={isOpen} key="step-1">
          <DialogTitle>{title}</DialogTitle>
          <form autoComplete="off" onSubmit={handleSubmitInvitationCode}>
            <DialogContent>
              <DialogContentText>
                Du kannst die Registrierung nur mit gültigem Einladungscode
                abschließen.
              </DialogContentText>
              <TextField
                label="Einladungscode"
                type="text"
                variant="outlined"
                size="small"
                onChange={event => setInvitationCode(event.target.value)}
                fullWidth
                required
              />
              {error && (
                <Alert severity="error" style={{ marginTop: theme.spacing(2) }}>
                  Fehler: {error.message}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                color="primary"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress color="inherit" size={18} thickness={3} />
                  ) : null
                }
              >
                Weiter
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      );

    case 2:
      return (
        <Dialog open={isOpen} key="step-2">
          <DialogTitle>{title}</DialogTitle>
          <form autoComplete="off" onSubmit={handleSubmitNickname}>
            <DialogContent>
              <DialogContentText>
                Super, das hat geklappt. Wähle jetzt deinen Nickname.
              </DialogContentText>
              <TextField
                label="Nickname"
                variant="outlined"
                size="small"
                onChange={event => setNickname(event.target.value)}
                fullWidth
                required
              />
              {error && (
                <Alert severity="error" style={{ marginTop: theme.spacing(2) }}>
                  Fehler: {error.message}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                color="primary"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress color="inherit" size={18} thickness={3} />
                  ) : null
                }
              >
                Fertig
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      );
  }
};

export default withRouter(SetupUserDialog);
