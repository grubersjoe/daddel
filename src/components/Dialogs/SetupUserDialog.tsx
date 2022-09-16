import React, {
  FormEventHandler,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

import { isValidInvitationCode } from '../../services/auth';
import { auth, getDocRef } from '../../services/firebase';
import useOnlineStatus from '../../hooks/useOnlineStatus';
import { User } from '../../types';
import { SnackbarContext } from '../Layout';

enum Step {
  CheckInvitationCode,
  PickUsername,
}

/**
 * Required after Google sing in
 * 1. Validate invitation code
 * 2. Set the user nickname
 */
const SetupUserDialog: FunctionComponent = () => {
  const dispatchSnack = useContext(SnackbarContext);

  const [authUser] = useAuthState(auth);
  const isOnline = useOnlineStatus();

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>(Step.CheckInvitationCode);

  const [nickname, setNickname] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const [user, userLoading, userError] = useDocumentData<User>(
    getDocRef('users', authUser?.uid),
  );

  // Skip first step if user is already invited
  useEffect(() => {
    if (user && user.invited) {
      setStep(Step.PickUsername);
    }
  }, [user]);

  useEffect(() => {
    const userDataMissing = user && (!user.invited || !user.nickname);

    if (isOnline && !userLoading && !userError && userDataMissing) {
      setIsOpen(true);
    }
  }, [isOnline, user, userError, userLoading]);

  if (!isOpen || !authUser) {
    return null;
  }

  if (userError) {
    setError(userError);
  }

  const handleSubmitInvitationCode: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);

    isValidInvitationCode(invitationCode)
      .then(isValid => {
        if (isValid) {
          setDoc<User>(
            getDocRef('users', authUser?.uid),
            { invited: true },
            { merge: true },
          )
            .then(() => {
              setError(null);
              setStep(2);
            })
            .catch(setError);
        } else {
          setError(
            new Error('Einladungscode ungültig. Bitte versuche es erneut.'),
          );
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleSubmitNickname: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);

    setDoc<User>(
      getDocRef<User>('users', authUser?.uid),
      { nickname },
      { merge: true },
    )
      .then(() => {
        dispatchSnack('Registrierung abgeschlossen');
        setIsOpen(false);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const title =
    step === Step.CheckInvitationCode
      ? 'Hast du eine Einladung für Daddel?'
      : 'Wie heißt du?';

  switch (step) {
    case Step.CheckInvitationCode:
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
                <Alert severity="error" sx={{ mt: 2 }}>
                  Fehler: {error.message}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="text"
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

    case Step.PickUsername:
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
                <Alert severity="error" sx={{ mt: 2 }}>
                  Fehler: {error.message}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                variant="text"
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

export default SetupUserDialog;
