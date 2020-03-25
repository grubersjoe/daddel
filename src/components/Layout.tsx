import React, { CSSProperties } from 'react';

import { theme } from '../styles/theme';
import Navigation from './Navigation';

const footerStyle: CSSProperties = {
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
};

const Layout: React.FC = ({ children }) => (
  <div style={{ paddingBottom: theme.spacing(8) }}>
    <main>{children}</main>
    <footer style={footerStyle}>
      <Navigation />
    </footer>
  </div>
);

export default Layout;
