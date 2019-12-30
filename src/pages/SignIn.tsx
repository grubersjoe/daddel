import React from 'react';

import firebase from '../api/firebase';
import { Button, Container, Grid } from '@material-ui/core';

function signInWithEmail() {
  firebase.auth
    .signInWithEmailAndPassword('gruberjonathan@gmail.com', 'testtest')
    .catch(error => {
      if (error.code === 'auth/wrong-password') {
        // TODO
      }
    });
}

function signInWithGoogle() {
  firebase.auth.signInWithRedirect(firebase.googleAuthProvider);
}

const SignIn: React.FC = () => (
  <Container>
    <h2>Anmelden</h2>
    <Grid container direction="column" spacing={2}>
      <Grid item xs>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => signInWithEmail()}
          fullWidth
        >
          Mit Email anmelden
        </Button>
      </Grid>
      <Grid item xs>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => signInWithGoogle()}
          fullWidth
        >
          Mit Google anmelden
        </Button>
      </Grid>
    </Grid>
  </Container>
);

export default SignIn;
