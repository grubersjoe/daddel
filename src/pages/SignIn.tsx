import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';

import firebase from '../api';
import { Button, Container, Grid } from '@material-ui/core';

function signInWithEmail(history: History) {
  firebase.auth
    .signInWithEmailAndPassword('gruberjonathan@gmail.com', 'testtest')
    .catch(error => {
      if (error.code === 'auth/wrong-password') {
        // TODO
      }
      console.log(error);
    });
}

function signInWithGoogle(history: History) {
  firebase.auth
    .signInWithRedirect(firebase.googleAuthProvider)
    .catch(error => console.error(error));
}

const SignIn: React.FC<RouteComponentProps> = ({ history }) => (
  <Container>
    <h2>Anmelden</h2>
    <Grid container direction="column" spacing={2}>
      <Grid item xs>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => signInWithEmail(history)}
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
          onClick={() => signInWithGoogle(history)}
          fullWidth
        >
          Mit Google anmelden
        </Button>
      </Grid>
    </Grid>
  </Container>
);

export default withRouter(SignIn);
