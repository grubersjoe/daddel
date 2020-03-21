import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MatchesIcon from '@material-ui/icons/SportsEsports';
import SettingsIcon from '@material-ui/icons/Settings';

import * as ROUTES from '../constants/routes';
import { theme } from '../styles/theme';
import AuthUserContext from './AuthUserContext';

const Links = [ROUTES.MATCHES_LIST, ROUTES.ADD_MATCH, ROUTES.PROFILE];

const Navigation: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    // Remove trailing slash
    const activeIndex = Links.indexOf(location.pathname.replace(/\/$/, ''));
    setSelected(activeIndex === -1 ? 0 : activeIndex);
  }, [location.pathname]);

  return (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <BottomNavigation
            value={selected}
            showLabels
            onChange={(_, clickedLink) => setSelected(clickedLink)}
            style={{
              boxShadow: `0 0 3px ${theme.palette.grey[900]}`,
            }}
          >
            <BottomNavigationAction
              component={Link}
              to={ROUTES.MATCHES_LIST}
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
