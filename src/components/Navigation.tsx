import React from 'react';
import {
  NavLink,
  NavLinkProps,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import styled from 'styled-components';
import { History } from 'history';

import firebase from '../api';
import * as ROUTES from '../constants/routes';
import AuthUserContext from './AuthUserContext';

const Link: React.FC<NavLinkProps> = props => (
  <NavLink {...props} activeClassName="active" />
);

const StyledNav = styled.nav`
  .active {
    font-weight: bold;
  }
`;

async function signOut(history: History) {
  await firebase.auth.signOut();
  history.push('/bye');
}

const Navigation: React.FC<RouteComponentProps> = ({ history }) => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <StyledNav>
          <Link to={ROUTES.MATCHES} exact>
            Matches
          </Link>
          <Link to={ROUTES.PROFILE}>Profil</Link>
          <button type="button" onClick={() => signOut(history)}>
            Abmelden
          </button>
          <p>eingeloggt: {authUser ? 'true' : 'false'}</p>
        </StyledNav>
      ) : null
    }
  </AuthUserContext.Consumer>
);

export default withRouter(Navigation);
