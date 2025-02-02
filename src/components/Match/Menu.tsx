import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import { MenuItem, Menu as MuiMenu } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { endOfDay, isPast } from 'date-fns';
import { logEvent } from 'firebase/analytics';
import { deleteDoc } from 'firebase/firestore';
import { MouseEvent, useContext, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, generatePath } from 'react-router-dom';

import { GA_EVENTS } from '../../constants';
import routes from '../../constants/routes';
import { analytics, auth } from '../../services/firebase';
import { getMatchRef } from '../../services/firestore';
import { Game, Match } from '../../types';
import { formatDate, formatTime } from '../../utils/date';
import { SnackbarContext } from '../Layout';

interface Props {
  game: Game;
  match: Match;
}

const Menu = ({ game, match }: Props) => {
  const [authUser] = useAuthState(auth);
  const dispatchSnack = useContext(SnackbarContext);

  const [anchorElement, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  if (!match.id) {
    throw new Error('match.id is undefined');
  }

  const deleteMatch = () => {
    if (window.confirm('Match löschen?')) {
      deleteDoc(getMatchRef(match.id)).catch(() => {
        logEvent(analytics, GA_EVENTS.DELETE_MATCH);
        dispatchSnack('Match kann nicht gelöscht werden', 'error');
      });
    }
    closeMenu();
  };

  const copyPermalink = (match: Match) => {
    navigator.clipboard
      .writeText(`${window.location.origin}/matches/${match.id}`)
      .then(() => {
        dispatchSnack('In Zwischenablage kopiert');
        closeMenu();
      })
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };

  const shareMatch = (match: Match) => {
    const date = `${formatDate(match.date, false)} ${formatTime(
      match.date,
    )} Uhr`;

    navigator
      .share({
        title: `${game.name} am ${date}`,
        url: `${window.location.origin}/matches/${match.id}`,
        text: `Spiel mit: ${game.name} am ${date}`,
      })
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });

    closeMenu();
  };

  if (!authUser) {
    return null;
  }

  const matchCreatedByUser = authUser.uid === match.createdBy;
  const isPastMatch = isPast(endOfDay(match.date.toDate()));

  return (
    <>
      <IconButton onClick={openMenu} size="large" sx={{ zIndex: 1 }}>
        <MoreVertIcon />
      </IconButton>
      <MuiMenu anchorEl={anchorElement} open={open} onClose={closeMenu}>
        {matchCreatedByUser && !isPastMatch && (
          <Link
            to={generatePath(routes.editMatch, { id: match.id })}
            style={{ display: 'flex' }}
          >
            <MenuItem>
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Bearbeiten
            </MenuItem>
          </Link>
        )}
        {matchCreatedByUser && (
          <MenuItem onClick={deleteMatch}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Löschen
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            copyPermalink(match);
          }}
        >
          <LinkIcon fontSize="small" sx={{ mr: 1 }} />
          Permalink
        </MenuItem>
        <MenuItem
          onClick={() => {
            shareMatch(match);
          }}
        >
          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
          Teilen
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default Menu;
