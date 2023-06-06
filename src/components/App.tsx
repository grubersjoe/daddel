import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import CSSBaseline from '@mui/material/CssBaseline';
import yellow from '@mui/material/colors/yellow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { FunctionComponent, ReactElement } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HelmetProvider } from 'react-helmet-async';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import { DOMAIN_PROD, REGEX_IPV4 } from '../constants';
import routes from '../constants/routes';
import AddMatch from '../pages/AddMatch';
import EditMatch from '../pages/EditMatch';
import MatchDetail from '../pages/MatchDetail';
import MatchesList from '../pages/MatchesList';
import ResetPassword from '../pages/ResetPassword';
import Settings from '../pages/Settings';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { auth } from '../services/firebase';
import { createTheme } from '../styles/theme';
import Layout from './Layout';
import PageMetadata from './PageMetadata';

const queryClient = new QueryClient();

const RequireAuth: FunctionComponent<{ children: ReactElement }> = ({
  children,
}) => {
  const [authUser, authLoading] = useAuthState(auth);

  if (authLoading) {
    return null;
  }

  return authUser ? children : <Navigate to={routes.home} />;
};

const isValidHost = () =>
  [DOMAIN_PROD, 'localhost'].includes(window.location.hostname) ||
  REGEX_IPV4.test(window.location.hostname);

const App: FunctionComponent = () => {
  if (!isValidHost()) {
    return (window.location.href = `https://${DOMAIN_PROD}`);
  }

  const theme = createTheme(yellow[700]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            <CSSBaseline />
            <PageMetadata />
            <Router>
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
                  <Route
                    path={routes.resetPassword}
                    element={<ResetPassword />}
                  />
                  <Route path={routes.home} element={<SignIn />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Router>
          </QueryClientProvider>
        </HelmetProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
