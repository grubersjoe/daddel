import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MuiMenu from '@material-ui/core/Menu';
import ShareIcon from '@material-ui/icons/Share';

import firebase from '../../api/firebase';
import { BASE_URL_PROD, FALLBACK_GAME_TITLE } from '../../constants';
import ROUTES from '../../constants/routes';
import { Match, Game } from '../../types';
import { formatDate, formatTimestamp } from '../../utils/date';
import { AuthUserContext } from '../App';
import { SnackbarContext } from '../Layout';

type Props = {
  match: Match;
};

const Menu: React.FC<Props> = ({ match }) => {
  const [authUser] = useContext(AuthUserContext);
  const dispatchSnack = useContext(SnackbarContext);

  const [games, gamesLoading] = useCollectionData<Game>(
    firebase.firestore.collection('games').orderBy('name', 'asc'),
  );

  const [anchorElement, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!match.id) {
    throw new Error('match.id is undefined');
  }

  const handleDelete = () => {
    if (window.confirm('Sicher?')) {
      firebase.firestore
        .collection('matches')
        .doc(match.id)
        .delete()
        .catch(() => dispatchSnack('Fehler', 'error'));
    }
    handleClose();
  };

  const handlePermalink = (match: Match) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`${window.location.href}/${match.id}`)
        .then(() => {
          dispatchSnack('In Zwischenablage kopiert');
        });
    } else {
      dispatchSnack('Aktion nicht unterstützt', 'error');
    }

    handleClose();
  };

  const handleShare = (match: Match) => {
    if (navigator.share && games) {
      const game = games.find(game => game.id === match.game);
      const gameTitle = game?.name || match.game || FALLBACK_GAME_TITLE;
      const date = `${formatDate(match.date, false)} um ${formatTimestamp(
        match.date,
      )} Uhr`;

      navigator
        .share({
          title: `${gameTitle} am ${date}`,
          url: `${BASE_URL_PROD}/matches/${match.id}`,
          text: `Spiel mit: ${gameTitle} am ${date}`,
        })
        .catch(console.error);
    }

    handleClose();
  };

  if (!authUser) {
    return null;
  }

  const isOwnMatch = authUser.uid === match.createdBy;

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <MuiMenu anchorEl={anchorElement} open={open} onClose={handleClose}>
        {isOwnMatch && (
          <MenuItem>
            <Link
              to={{
                pathname: ROUTES.EDIT_MATCH,
                state: { match },
              }}
              style={{ display: 'flex' }}
            >
              <EditIcon fontSize="small" style={{ marginRight: 8 }} />{' '}
              Bearbeiten
            </Link>
          </MenuItem>
        )}
        {isOwnMatch && (
          <MenuItem onClick={handleDelete}>
            <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
            Löschen
          </MenuItem>
        )}
        <MenuItem onClick={() => handlePermalink(match)}>
          <LinkIcon fontSize="small" style={{ marginRight: 8 }} />
          Permalink
        </MenuItem>
        <MenuItem
          onClick={() => handleShare(match)}
          style={{
            color: gamesLoading ? 'rgba(255, 255, 255, 0.5' : 'inherit',
          }}
        >
          <ShareIcon fontSize="small" style={{ marginRight: 8 }} />
          Teilen
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default Menu;
