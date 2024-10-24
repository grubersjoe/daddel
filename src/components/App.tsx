import {
  Alert,
  Box,
  Container,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import CSSBaseline from '@mui/material/CssBaseline';
import yellow from '@mui/material/colors/yellow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactElement } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HelmetProvider } from 'react-helmet-async';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import thisIsFineGif from '../assets/this-is-fine.gif';
import { REGEX_IPV4 } from '../constants';
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
import { getEnv } from '../utils/env';
import Layout from './Layout';
import PageMetadata from './PageMetadata';

const queryClient = new QueryClient();

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const [authUser, authLoading] = useAuthState(auth);

  if (authLoading) {
    return null;
  }

  return authUser ? children : <Navigate to={routes.home} />;
};

const isValidHost = () => {
  return (
    [getEnv('VITE_DOMAIN_PROD'), 'localhost'].includes(
      window.location.hostname,
    ) || REGEX_IPV4.test(window.location.hostname)
  );
};

const App = () => {
  if (!isValidHost()) {
    return (window.location.href = `https://${getEnv('VITE_DOMAIN_PROD')}`);
  }

  const theme = createTheme(yellow[700]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
            />
            <CSSBaseline />
            <PageMetadata />
            <Router>
              <Layout>
                <ErrorBoundary FallbackComponent={ErrorComponent}>
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
                </ErrorBoundary>
              </Layout>
            </Router>
          </QueryClientProvider>
        </HelmetProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const ErrorComponent = ({ error }: FallbackProps) => (
  <>
    <PageMetadata title="Fehler" />
    <Container>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: 480 }}
      >
        <img
          src={thisIsFineGif}
          alt="This is fine.gif"
          style={{ borderRadius: 4 }}
        />
        <Alert severity="error">
          Fehler:{' '}
          {error instanceof Error ? error.message : 'unbekannter Fehler'}
        </Alert>
      </Box>
    </Container>
  </>
);

export default App;
