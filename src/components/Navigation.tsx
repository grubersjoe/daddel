import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import MatchesIcon from '@mui/icons-material/SportsEsports';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import routes from '../constants/routes';

const Links = [routes.matchList, routes.addMatch, routes.settings];

const Navigation = () => {
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
      onChange={(_, clickedLink) => {
        setSelected(clickedLink as number);
      }}
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))',
      }}
    >
      <BottomNavigationAction
        component={Link}
        to={routes.matchList}
        label="Matches"
        title="Matches"
        icon={<MatchesIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to={routes.addMatch}
        label="Neues Match"
        title="Neues Match"
        icon={<AddIcon />}
      />
      <BottomNavigationAction
        component={Link}
        to={routes.settings}
        label="Einstellungen"
        title="Einstellungen"
        icon={<SettingsIcon />}
      />
    </BottomNavigation>
  );
};

export default Navigation;
