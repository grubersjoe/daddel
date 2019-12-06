import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { User } from 'firebase';

import firebase from '../api';
import * as ROUTES from '../constants/routes';
import AuthUserContext from './AuthUserContext';
import Navigation from './Navigation';

import Bye from '../pages/Bye';
import SignIn from '../pages/SignIn';
import Matches from '../pages/Matches';
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import ResetPassword from '../pages/ResetPassword';
import SignUp from '../pages/SignUp';

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
        <Navigation />
        <Route path={ROUTES.ROOT} component={SignIn} exact />
        <Route path={ROUTES.REGISTER} component={SignUp} />
        <Route path={ROUTES.RESET} component={ResetPassword} />
        <Route path={ROUTES.SIGNOUT} component={Bye} />
        <PrivateRoute path={ROUTES.MATCHES} component={Matches} />
        <PrivateRoute path={ROUTES.PROFILE} component={Profile} />
      </Router>
    </AuthUserContext.Provider>
  );
};

export default App;
