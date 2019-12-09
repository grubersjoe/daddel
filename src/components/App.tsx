import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { User } from 'firebase';
import { ThemeProvider } from '@material-ui/core';

import firebase from '../api';
import * as ROUTES from '../constants/routes';
import { theme } from '../styles/theme';
import AuthUserContext from './AuthUserContext';

import Bye from '../pages/Bye';
import SignIn from '../pages/SignIn';
import Matches from '../pages/Matches';
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import SignUp from '../pages/SignUp';
import Layout from './Layout';

const redirectPath =
  window.location.pathname === '/' ? 'matches/' : window.location.pathname;

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);

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
            <Route path={ROUTES.SIGNOUT} component={Bye} />
            <PrivateRoute path={ROUTES.MATCHES} component={Matches} />
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
          </Layout>
        </ThemeProvider>
      </Router>
    </AuthUserContext.Provider>
  );
};

export default App;
