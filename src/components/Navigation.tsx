import React, { useState, useEffect, useContext } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { useTheme } from '@material-ui/core/styles';
import MatchesIcon from '@material-ui/icons/SportsEsports';
import SettingsIcon from '@material-ui/icons/Settings';

import ROUTES from '../constants/routes';
import { AuthUserContext } from './App';

const Links = [ROUTES.MATCHES_LIST, ROUTES.ADD_MATCH, ROUTES.SETTINGS];

const Navigation: React.FC<RouteComponentProps> = ({ location }) => {
  const [authUser] = useContext(AuthUserContext);
  const theme = useTheme();

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    // Remove trailing slash
    const activeIndex = Links.indexOf(location.pathname.replace(/\/$/, ''));
    setSelected(activeIndex === -1 ? 0 : activeIndex);
  }, [location.pathname]);

  return authUser ? (
    <BottomNavigation
      value={selected}
      onChange={(_, clickedLink) => setSelected(clickedLink)}
      style={{
        boxShadow: `0 0 3px ${theme.palette.grey[900]}`,
      }}
    >
      <BottomNavigationAction
        component={Link}
        to={ROUTES.MATCHES_LIST}
        label="Matches"
        title="Matches"
        icon={<MatchesIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to={ROUTES.ADD_MATCH}
        label="Neues Match"
        title="Neues Match"
        icon={<AddIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to={ROUTES.SETTINGS}
        label="Einstellungen"
        title="Einstellungen"
        icon={<SettingsIcon />}
      />
    </BottomNavigation>
  ) : null;
};

export default withRouter(Navigation);
