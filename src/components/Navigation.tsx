import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styled from 'styled-components';

import * as ROUTES from '../constants/routes';

const Link: React.FC<NavLinkProps> = props => (
  <NavLink {...props} activeClassName="active" />
);

const StyledNav = styled.nav`
  .active {
    font-weight: bold;
  }
`;

const Navigation = () => (
  <StyledNav>
    <ul>
      <li>
        <Link to={ROUTES.LANDING} exact>
          Start
        </Link>
      </li>
      <li>
        <Link to={ROUTES.PROFILE}>Profil</Link>
      </li>
      <li>
        <Link to={ROUTES.LOGIN}>Anmelden</Link>
      </li>
      <li>
        <Link to={ROUTES.LOGOUT}>Abmelden</Link>
      </li>
    </ul>
  </StyledNav>
);
export default Navigation;
