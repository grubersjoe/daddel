import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MatchesIcon from '@mui/icons-material/SportsEsports';
import SettingsIcon from '@mui/icons-material/Settings';

import ROUTES from '../constants/routes';

const Links = [ROUTES.MATCHES_LIST, ROUTES.ADD_MATCH, ROUTES.SETTINGS];

const Navigation: React.FC = () => {
  const location = useLocation();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    // Remove trailing slash
    const activeIndex = Links.indexOf(location.pathname.replace(/\/$/, ''));
    setSelected(activeIndex === -1 ? 0 : activeIndex);
  }, [location.pathname]);

  return (
    <BottomNavigation
      value={selected}
      onChange={(_, clickedLink) => setSelected(clickedLink)}
      sx={{
        borderTop: 'solid 1px',
        borderTopColor: 'rgba(0, 0, 0, 0.2)',
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))',
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
  );
};

export default Navigation;
