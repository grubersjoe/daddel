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
  const [user, userLoading, error] = useDocumentDataOnce<User>(
    firebase.firestore.doc(`users/${currentUser?.uid}`),
    { idField: 'uid' },
  );

  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const initialUsername = user?.nickname;
  useEffect(() => {
    if (initialUsername) {
      setNickname(initialUsername);
    }
  }, [initialUsername]);

  const handleNicknameChange: ChangeEventHandler<HTMLInputElement> = event => {
    setNickname(event.target.value);
  };

  const submitNickname: FormEventHandler = event => {
    event.preventDefault();
    setLoading(true);

    if (!currentUser) return;

    firebase.firestore
      .collection('users')
      .doc(currentUser.uid)
      .set({ nickname })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <AppBar title="Profil" />
      <Container style={{ marginTop: -theme.spacing(1) }}>
        {error && <Alert severity="error">Fehler: {error.message}</Alert>}

        {!error && (
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
                  fullWidth
                  required
                />
              </Grid>

              <Grid item md={7}>
                <Button
                  type="submit"
                  color="primary"
                  variant="outlined"
                  disabled={loading || userLoading}
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
