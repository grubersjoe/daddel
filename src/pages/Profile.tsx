import React, {
  useState,
  useEffect,
  FormEventHandler,
  ChangeEventHandler,
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import TextField from '@material-ui/core/TextField';

import { signOut } from '../api/auth';
import firebase from '../api/firebase';
import { User } from '../types';
import { theme } from '../styles/theme';
import AppBar from '../components/AppBar';

const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const { currentUser } = firebase.auth;

  const [user, userLoading, userError] = useDocumentDataOnce<User>(
    firebase.firestore.doc(`users/${currentUser?.uid}`),
    { idField: 'uid' },
  );

  const [nickname, setNickname] = useState('Lade …');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
    }
  }, [user]);

  const handleNicknameChange: ChangeEventHandler<HTMLInputElement> = event => {
    setNickname(event.target.value);
  };

  const submitNickname: FormEventHandler = event => {
    event.preventDefault();

    if (!currentUser) {
      throw new Error('No user authenticated');
    }

    setSubmitLoading(true);
    firebase.firestore
      .collection('users')
      .doc(currentUser.uid)
      .set({ nickname }, { merge: true })
      .finally(() => setSubmitLoading(false));
  };

  return (
    <>
      <AppBar title="Profil" />
      <Container style={{ marginTop: -theme.spacing(1) }}>
        {userError ? (
          <Alert severity="error" style={{ marginBottom: theme.spacing(2) }}>
            Fehler: {userError.message}
          </Alert>
        ) : (
          <form
            autoComplete="off"
            onSubmit={submitNickname}
            style={{ marginBottom: theme.spacing(6) }}
          >
            <Grid container spacing={2} direction="column">
              <Grid item md={7}>
                <TextField
                  label="Nickname"
                  variant="outlined"
                  size="small"
                  value={nickname}
                  onChange={handleNicknameChange}
                  disabled={userLoading || userError}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item md={7}>
                <Button
                  type="submit"
                  color="primary"
                  variant="outlined"
                  disabled={userLoading || submitLoading}
                  fullWidth
                >
                  Name ändern
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
        <Button
          variant="outlined"
          color="default"
          startIcon={<SignOutIcon />}
          onClick={() => signOut(history)}
        >
          Abmelden
        </Button>
      </Container>
    </>
  );
};

export default withRouter(Profile);
