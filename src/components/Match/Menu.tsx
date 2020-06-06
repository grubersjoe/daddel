import React, { useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MuiMenu from '@material-ui/core/Menu';
import ShareIcon from '@material-ui/icons/Share';

import firebase from '../../api/firebase';
import ROUTES from '../../constants/routes';
import { Match } from '../../types';
import { AuthUserContext } from '../App';

type Props = {
  match: Match;
};

const Menu: React.FC<Props> = ({ match }) => {
  const history = useHistory();
  const location = useLocation();

  const authUser = useContext(AuthUserContext);

  const [anchorElement, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!match.id) throw new Error('This should not happen');

  const handleDelete = () => {
    if (window.confirm('Sicher?')) {
      return firebase.firestore.collection('matches').doc(match.id).delete();
    }
    handleClose();
  };

  const handlePermalink = (match: Match) => {
    history.push(`/matches/${match.id}`);
    handleClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: location.pathname,
        })
        .catch(console.error);
    }
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
        <MenuItem onClick={handleShare}>
          <ShareIcon fontSize="small" style={{ marginRight: 8 }} />
          Teilen
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default Menu;
