import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { User } from 'firebase';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import firebase from '../api/firebase';
import ROUTES from '../constants/routes';
import { theme } from '../styles/theme';
import AuthUserContext from './AuthUserContext';

import Layout from './Layout';
import AddMatch from '../pages/AddMatch';
import EditMatch from '../pages/EditMatch';
import MatchesList from '../pages/MatchesList';
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

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
            {authUser && <Redirect to={ROUTES.MATCHES_LIST} />}
            <Route path={ROUTES.ROOT} component={SignIn} exact />
            <Route path={ROUTES.REGISTER} component={SignUp} />
            <Route path={ROUTES.RESET} component={ResetPassword} />
            <PrivateRoute path={ROUTES.ADD_MATCH} component={AddMatch} />
            <PrivateRoute path={ROUTES.EDIT_MATCH} component={EditMatch} />
            <PrivateRoute path={ROUTES.MATCHES_LIST} component={MatchesList} />
            <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthUserContext.Provider>
  );
};

export default App;
