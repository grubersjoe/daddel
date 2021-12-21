import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { deleteDoc } from 'firebase/firestore';
import endOfDay from 'date-fns/endOfDay';
import isPast from 'date-fns/isPast';
import { Menu as MuiMenu, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';

import { GA_EVENTS } from '../../constants';
import ROUTES from '../../constants/routes';
import { analytics, getDocRef } from '../../services/firebase';
import { Game, Match } from '../../types';
import { formatDate, formatTime } from '../../utils/date';
import { AuthUserContext } from '../App';
import { SnackbarContext } from '../Layout';

type Props = {
  game: Game;
  match: Match;
};

const Menu: React.FC<Props> = ({ game, match }) => {
  const [authUser] = useContext(AuthUserContext);
  const dispatchSnack = useContext(SnackbarContext);

  const [anchorElement, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const { game: gameRef, ...matchWithoutRefs } = match;

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  if (!match.id) {
    throw new Error('match.id is undefined');
  }

  const deleteMatch = () => {
    if (window.confirm('Sicher?')) {
      deleteDoc(getDocRef<Match>('matches', match.id)).catch(() => {
        logEvent(analytics, GA_EVENTS.DELETE_MATCH);
        dispatchSnack('Fehler', 'error');
      });
    }
    closeMenu();
  };

  const copyPermalink = (match: Match) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${window.location.origin}/matches/${match.id}`)
        .then(() => {
          dispatchSnack('In Zwischenablage kopiert');
        });
    } else {
      dispatchSnack('Aktion nicht unterstützt', 'error');
    }

    closeMenu();
  };

  const shareMatch = (match: Match) => {
    if (navigator.share) {
      const date = `${formatDate(match.date, false)} um ${formatTime(
        match.date,
      )} Uhr`;

      navigator.share({
        title: `${game.name} am ${date}`,
        url: `${window.location.origin}/matches/${match.id}`,
        text: `Spiel mit: ${game.name} am ${date}`,
      });
    }

    closeMenu();
  };

  if (!authUser) {
    return null;
  }

  const isOwnMatch = authUser.uid === match.createdBy;
  const isPastMatch = isPast(endOfDay(match.date.toDate()));

  return (
    <>
      <IconButton onClick={openMenu} size="large" sx={{ zIndex: 1 }}>
        <MoreVertIcon />
      </IconButton>
      <MuiMenu anchorEl={anchorElement} open={open} onClose={closeMenu}>
        {isOwnMatch && !isPastMatch && (
          <Link
            to={{
              pathname: ROUTES.EDIT_MATCH,
              state: { game, match: matchWithoutRefs }, // Firestore refs can not be serialized
            }}
            style={{ display: 'flex' }}
          >
            <MenuItem>
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Bearbeiten
            </MenuItem>
          </Link>
        )}
        {isOwnMatch && (
          <MenuItem onClick={deleteMatch}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Löschen
          </MenuItem>
        )}
        <MenuItem onClick={() => copyPermalink(match)}>
          <LinkIcon fontSize="small" sx={{ mr: 1 }} />
          Permalink
        </MenuItem>
        <MenuItem onClick={() => shareMatch(match)}>
          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
          Teilen
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default Menu;
