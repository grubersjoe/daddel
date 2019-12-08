import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';

import firebase from '../api';
import Layout from '../components/Layout';

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
    .signInWithPopup(firebase.googleAuthProvider)
    .catch(error => console.error(error));
}

const SignIn: React.FC<RouteComponentProps> = ({ history }) => (
  <Layout>
    <h1>SCHALKE!</h1>
    <button onClick={() => signInWithEmail(history)}>Mit Email anmelden</button>
    <button onClick={() => signInWithGoogle(history)}>
      Mit Google anmelden
    </button>
  </Layout>
);

export default withRouter(SignIn);
