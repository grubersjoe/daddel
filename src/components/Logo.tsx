import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import GamingIcon from '@material-ui/icons/VideogameAssetSharp';

import { theme } from '../styles/theme';

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: '700%',
    marginRight: theme.spacing(2.5),
  },
  heading: {
    fontSize: '250%',
    color: '#fff',
    textDecoration: 'none',
  },
}));

const Logo: React.FC = () => {
  const classes = useStyles();

  return (
    <Link to="/">
      <Box
        display="flex"
        style={{ marginBottom: theme.spacing(3) }}
        alignItems="center"
      >
        <GamingIcon color="primary" className={classes.icon} />
        <h1 className={classes.heading}>Daddel</h1>
      </Box>
    </Link>
  );
};

export default Logo;
