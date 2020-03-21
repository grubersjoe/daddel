import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MuiMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import firebase from '../../api/firebase';
import * as ROUTES from '../../constants/routes';
import { Match } from '../../types';
import AuthUserContext from '../AuthUserContext';

type Props = {
  match: Match;
};

const Menu: React.FC<Props> = ({ match }) => {
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
    return firebase.firestore
      .collection('matches')
      .doc(match.id)
      .delete();
  };

  return (
    <AuthUserContext.Consumer>
      {currentUser =>
        currentUser &&
        currentUser.uid === match.createdBy && (
          <>
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <MuiMenu anchorEl={anchorElement} open={open} onClose={handleClose}>
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
              <MenuItem onClick={handleDelete}>
                <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                Löschen
              </MenuItem>
            </MuiMenu>
          </>
        )
      }
    </AuthUserContext.Consumer>
  );
};

export default Menu;
