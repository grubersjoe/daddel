import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { User } from 'firebase';
import { ThemeProvider } from '@material-ui/core';

import firebase from '../api';
import * as ROUTES from '../constants/routes';
import { theme } from '../styles/theme';
import AuthUserContext from './AuthUserContext';

import Layout from './Layout';
import AddMatch from '../pages/AddMatch';
import Matches from '../pages/Matches';
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const redirectPath =
  window.location.pathname === '/' ? 'matches/' : window.location.pathname;

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(
    firebase.auth.currentUser,
  );

  useEffect(() => {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
  });

  return (
    <AuthUserContext.Provider value={authUser}>
      <Router>
        <ThemeProvider theme={theme}>
          <Layout>
            {authUser && <Redirect to={redirectPath} />}
            <Route path={ROUTES.ROOT} component={SignIn} exact />
            <Route path={ROUTES.REGISTER} component={SignUp} />
            <Route path={ROUTES.RESET} component={ResetPassword} />
            <PrivateRoute path={ROUTES.ADD_MATCH} component={AddMatch} />
            <PrivateRoute path={ROUTES.MATCHES} component={Matches} />
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
            <Redirect to="/" />
          </Layout>
        </ThemeProvider>
      </Router>
    </AuthUserContext.Provider>
  );
};

export default App;
