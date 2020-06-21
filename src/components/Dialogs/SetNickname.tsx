import React, { useState, useEffect, FormEventHandler } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import firebase from '../../api/firebase';
import { useOnlineStatus } from '../../hooks';
import { User } from '../../types';

const SetNicknameDialog: React.FC<RouteComponentProps> = ({ history }) => {
  const isOnline = useOnlineStatus();

  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState('');

  const { currentUser } = firebase.auth;
  const [user, loading, error] = useDocumentData<User>(
    firebase.firestore.doc(`users/${currentUser?.uid}`),
  );

  useEffect(() => {
    if (isOnline && currentUser && !loading && !error && user === undefined) {
      setOpen(true);
    }
  }, [isOnline, currentUser, error, loading, user]);

  const handleSubmit: FormEventHandler = event => {
    event.preventDefault();
    if (!currentUser) return;

    firebase.firestore
      .collection('users')
      .doc(currentUser.uid)
      .set({ nickname });

    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Wähle deinen Nickname</DialogTitle>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Nickname"
            variant="outlined"
            onChange={event => setNickname(event.target.value)}
            fullWidth
            required
          />
          {error && <Alert severity="error">Fehler: {error.message}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Okay
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default withRouter(SetNicknameDialog);
