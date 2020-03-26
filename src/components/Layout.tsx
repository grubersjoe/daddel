import React, { CSSProperties } from 'react';

import Navigation from './Navigation';
import Box from '@material-ui/core/Box';

const footerStyle: CSSProperties = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
};

const Layout: React.FC = ({ children }) => (
  <Box py={10}>
    <main>{children}</main>
    <footer style={footerStyle}>
      <Navigation />
    </footer>
  </Box>
);

export default Layout;
