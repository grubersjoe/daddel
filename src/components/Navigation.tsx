import React, { useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import { useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MatchesIcon from '@material-ui/icons/SportsEsports';
import SettingsIcon from '@material-ui/icons/Settings';

import * as ROUTES from '../constants/routes';
import AuthUserContext from './AuthUserContext';

const Navigation: React.FC<RouteComponentProps> = ({ history }) => {
  const theme = useTheme();
  // TODO: move this to a more global state
  const [selected, setSelected] = useState(0);

  return (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <BottomNavigation
            value={selected}
            showLabels
            onChange={(_, newValue) => {
              setSelected(newValue);
            }}
            style={{
              boxShadow: `0 0 3px ${theme.palette.grey[900]}`,
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
            />
          </BottomNavigation>
        ) : null
      }
    </AuthUserContext.Consumer>
  );
};

export default withRouter(Navigation);
