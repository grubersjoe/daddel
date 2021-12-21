import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import CSSBaseline from '@mui/material/CssBaseline';
import yellow from '@mui/material/colors/yellow';

import { DOMAIN_PROD, REGEX_IPV4 } from '../constants';
import ROUTES from '../constants/routes';
import { createTheme } from '../styles/theme';

import Settings from '../pages/Settings';
import AddMatch from '../pages/AddMatch';
import ResetPassword from '../pages/ResetPassword';
import SignIn from '../pages/SignIn';
import UpdateMatch from '../pages/UpdateMatch';
import SignUp from '../pages/SignUp';
import MatchDetail from '../pages/MatchDetail';
import MatchesList from '../pages/MatchesList';
import { updateServiceWorker } from '../utils';
import PageMetadata from './PageMetadata';
import PrivateRoute from './PrivateRoute';
import Layout from './Layout';

const App: React.FC = () => {
  const isAllowedHost =
    [DOMAIN_PROD, 'localhost'].includes(window.location.hostname) ||
    REGEX_IPV4.test(window.location.hostname);

  if (!isAllowedHost) {
    window.location.replace(`https://${DOMAIN_PROD}`);
  }

  // TODO: make this configurable
  const theme = createTheme(yellow[700]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CSSBaseline />
        <PageMetadata />
        <Router>
          <OnRouteChange />
          <Layout>
            <Switch>
              <PrivateRoute path={ROUTES.ADD_MATCH}>
                <AddMatch />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.EDIT_MATCH}>
                <UpdateMatch />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.MATCH_DETAIL}>
                <MatchDetail />
              </PrivateRoute>
              <PrivateRoute path={ROUTES.MATCHES_LIST} exact>
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
    </StyledEngineProvider>
  );
};

const OnRouteChange: React.FC = () => {
  const location = useLocation();
  useEffect(updateServiceWorker, [location.pathname]);

  return null;
};

export default App;
