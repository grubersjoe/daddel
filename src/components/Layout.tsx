import { Alert, AlertProps, Snackbar } from '@mui/material';
import Box from '@mui/material/Box';
import { ReactElement, createContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../services/firebase';
import Navigation from './Navigation';

type DispatchSnack = (
  message: string,
  severity?: AlertProps['severity'],
) => void;

export const SnackbarContext = createContext<DispatchSnack>(() => undefined);

const Layout = ({ children }: { children: ReactElement }) => {
  const [authUser] = useAuthState(auth);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackData, setSnackData] = useState<{
    message: string;
    severity?: AlertProps['severity'];
  }>({
    message: '',
    severity: undefined,
  });

  const dispatchSnack: DispatchSnack = (message, severity) => {
    setSnackbarOpen(true);
    setSnackData({ message, severity });
  };

  return (
    <Box py={10}>
      <main>
        <SnackbarContext.Provider value={dispatchSnack}>
          {children}
        </SnackbarContext.Provider>
        <Snackbar
          open={snackbarOpen}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={5000}
          onClose={() => {
            setSnackbarOpen(false);
          }}
        >
          <Alert
            onClose={() => {
              setSnackbarOpen(false);
            }}
            severity={snackData.severity}
          >
            {snackData.message}
          </Alert>
        </Snackbar>
      </main>
      {authUser && (
        <Box
          component="footer"
          sx={{
            position: 'fixed',
            left: 0,
            bottom: 0,
            width: '100%',
          }}
        >
          <Navigation />
        </Box>
      )}
    </Box>
  );
};

export default Layout;
