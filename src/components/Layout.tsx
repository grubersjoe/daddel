import React, { useState } from 'react';

import Box from '@mui/material/Box';
import { Alert, AlertProps, Snackbar } from '@mui/material';

import Navigation from './Navigation';

type DispatchSnack = (
  message: string,
  severity?: AlertProps['severity'],
) => void;

export const SnackbarContext = React.createContext<DispatchSnack>(
  _ => undefined,
);

const Layout: React.FC = ({ children }) => {
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
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackData.severity}
          >
            {snackData.message}
          </Alert>
        </Snackbar>
      </main>
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
    </Box>
  );
};

export default Layout;
