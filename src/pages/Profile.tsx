import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { History } from 'history';
import { Container, Button } from '@material-ui/core';
import SignOutIcon from '@material-ui/icons/ExitToApp';

import firebase from '../api/firebase';

async function signOut(history: History) {
  await firebase.auth.signOut();
  history.push('/');
}

const Profile: React.FC<RouteComponentProps> = ({ history }) => (
  <Container>
    <h2>Profil</h2>

    {/* TODO: set nickname here */}

    <Button
      variant="outlined"
      color="default"
      startIcon={<SignOutIcon />}
      onClick={() => signOut(history)}
    >
      Abmelden
    </Button>
  </Container>
);

export default withRouter(Profile);
