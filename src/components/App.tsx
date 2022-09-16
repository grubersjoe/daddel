import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import CSSBaseline from '@mui/material/CssBaseline';
import yellow from '@mui/material/colors/yellow';

import { DOMAIN_PROD, REGEX_IPV4 } from '../constants';
import routes from '../constants/routes';
import { createTheme } from '../styles/theme';

import { updateServiceWorker } from '../utils';
import AddMatch from '../pages/AddMatch';
import EditMatch from '../pages/EditMatch';
import MatchDetail from '../pages/MatchDetail';
import MatchesList from '../pages/MatchesList';
import ResetPassword from '../pages/ResetPassword';
import Settings from '../pages/Settings';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Layout from './Layout';
import PageMetadata from './PageMetadata';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

const RequireAuth: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => {
  const [authUser, authLoading] = useAuthState(auth);

  if (authLoading) {
    return null;
  }

  return authUser ? children : <Navigate to={routes.home} />;
};

const App: FunctionComponent = () => {
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
            <Routes>
              <Route
                path={routes.addMatch}
                element={
                  <RequireAuth>
                    <AddMatch />
                  </RequireAuth>
                }
              />
              <Route
                path={routes.editMatch}
                element={
                  <RequireAuth>
                    <EditMatch />
                  </RequireAuth>
                }
              />
              <Route
                path={routes.matchDetail}
                element={
                  <RequireAuth>
                    <MatchDetail />
                  </RequireAuth>
                }
              />
              <Route
                path={routes.matchList}
                element={
                  <RequireAuth>
                    <MatchesList />
                  </RequireAuth>
                }
              />
              <Route
                path={routes.settings}
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                }
              />
              <Route path={routes.register} element={<SignUp />} />
              <Route path={routes.resetPassword} element={<ResetPassword />} />
              <Route path={routes.home} element={<SignIn />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const OnRouteChange: FunctionComponent = () => {
  const location = useLocation();
  useEffect(updateServiceWorker, [location.pathname]);

  return null;
};

export default App;
