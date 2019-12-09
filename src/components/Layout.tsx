import React from 'react';

import Logo from './Logo';

const Layout: React.FC = ({ children }) => (
  <div>
    <header>
      <Logo />
    </header>
    <main>{children}</main>
  </div>
);

export default Layout;
