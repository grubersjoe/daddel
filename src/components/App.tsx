import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { User } from 'firebase';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import firebase from '../api/firebase';
import ROUTES from '../constants/routes';
import { theme } from '../styles/theme';

import Layout from './Layout';
import AddMatch from '../pages/AddMatch';
import EditMatch from '../pages/EditMatch';
import MatchesList from '../pages/MatchesList';
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

export const AuthUserContext = React.createContext<User | null>(null);

const App: React.FC = () => {
  const [authUser, setAuthUser] = useState<User | null>(
    firebase.auth.currentUser,
  );

  useEffect(() => {
    // Return the unsubscribe function of onAuthStateChanged (cleanup)
    return firebase.auth.onAuthStateChanged(authUser => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });
  });

  return (
    <AuthUserContext.Provider value={authUser}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Switch>
              <PrivateRoute path={ROUTES.ADD_MATCH}>
                <AddMatch />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.EDIT_MATCH}>
                <EditMatch />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.MATCHES_LIST_DYNAMIC}>
                <MatchesList />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.PROFILE}>
                <Profile />
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
