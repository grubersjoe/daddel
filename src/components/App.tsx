import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Firebase, { FirebaseContext } from '../api';
import * as ROUTES from '../constants/routes';
import Navigation from './Navigation';

import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Reset from '../pages/Reset';
import SignIn from '../pages/SignIn';
import SignOut from '../pages/SignOut';
import SignUp from '../pages/SignUp';

const App: React.FC = () => (
  <FirebaseContext.Provider value={new Firebase()}>
    <Router>
      <Navigation />
      <Route exact path={ROUTES.LANDING} component={Home} />
      <Route path={ROUTES.LOGIN} component={SignIn} />
      <Route path={ROUTES.LOGOUT} component={SignOut} />
      <Route path={ROUTES.PROFILE} component={Profile} />
      <Route path={ROUTES.REGISTER} component={SignUp} />
      <Route path={ROUTES.RESET} component={Reset} />
    </Router>
  </FirebaseContext.Provider>
);

export default App;
