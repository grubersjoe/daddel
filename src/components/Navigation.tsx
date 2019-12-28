import React, { useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { History } from 'history';

import { useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MatchesIcon from '@material-ui/icons/SportsEsports';
import SettingsIcon from '@material-ui/icons/Settings';
import SignOutIcon from '@material-ui/icons/ExitToApp';

import firebase from '../api';
import * as ROUTES from '../constants/routes';
import AuthUserContext from './AuthUserContext';

async function signOut(history: History) {
  await firebase.auth.signOut();
  history.push('/bye');
}

const Navigation: React.FC<RouteComponentProps> = ({ history }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  return (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <BottomNavigation
            value={value}
            showLabels
            onChange={(_, newValue) => {
              setValue(newValue);
            }}
            style={{
              borderTop: `solid 1px ${theme.palette.grey[300]}`,
            }}
          >
            <BottomNavigationAction
              component={Link}
              to={ROUTES.MATCHES}
              label="Bolzen"
              icon={<MatchesIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to={ROUTES.ADD_MATCH}
              label="Neuer Bolz"
              icon={<AddIcon />}
            />
            <BottomNavigationAction
              component={Link}
              to={ROUTES.PROFILE}
              label="Profil"
              icon={<SettingsIcon />}
            />{' '}
            <BottomNavigationAction
              label="Abmelden"
              icon={<SignOutIcon />}
              onClick={() => signOut(history)}
            />
          </BottomNavigation>
        ) : null
      }
    </AuthUserContext.Consumer>
  );
};

export default withRouter(Navigation);
