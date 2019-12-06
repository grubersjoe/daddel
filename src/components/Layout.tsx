import React from 'react';

const Layout: React.FC = ({ children }) => (
  <div>
    <header>Daddel</header>
    <main>{children}</main>
  </div>
);

export default Layout;
