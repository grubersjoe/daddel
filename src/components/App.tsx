import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import firebaseNS from 'firebase';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import yellow from '@material-ui/core/colors/yellow';

import { DOMAIN_PROD } from '../constants';
import ROUTES from '../constants/routes';
import firebase from '../services/firebase';
import { createTheme } from '../styles/theme';

import Layout from './Layout';
import AddMatch from '../pages/AddMatch';
import UpdateMatch from '../pages/UpdateMatch';
import MatchesList from '../pages/MatchesList';
import PrivateRoute from './PrivateRoute';
import Settings from '../pages/Settings';
import ResetPassword from '../pages/ResetPassword';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

type AuthUserValue = [firebaseNS.User | null, boolean];

const allowedHosts = [DOMAIN_PROD, 'localhost'];

export const AuthUserContext = React.createContext<AuthUserValue>([null, true]);

const App: React.FC = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState<firebaseNS.User | null>(
    firebase.auth.currentUser,
  );

  useEffect(() => {
    const unsubscribeFn = firebase.auth.onAuthStateChanged(authUser => {
      setAuthUser(authUser);
      setAuthLoading(false);
    });

    return unsubscribeFn; // Cleanup
  });

  if (!allowedHosts.includes(window.location.hostname)) {
    window.location.replace(`https://${DOMAIN_PROD}`);
  }

  const theme = createTheme(yellow[700]);

  return (
    <AuthUserContext.Provider value={[authUser, authLoading]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Switch>
              <PrivateRoute path={ROUTES.ADD_MATCH}>
                <AddMatch />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.EDIT_MATCH}>
                <UpdateMatch />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.MATCHES_LIST_DYNAMIC}>
                <MatchesList />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.SETTINGS}>
                <Settings />
              </PrivateRoute>
              <Route path={ROUTES.REGISTER}>
                <SignUp />
              </Route>
              <Route path={ROUTES.RESET}>
                <ResetPassword />
              </Route>
              <Route path={ROUTES.ROOT}>
                <SignIn />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthUserContext.Provider>
  );
};

export default App;
