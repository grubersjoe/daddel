import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import GamingIcon from '@material-ui/icons/SportsEsports';

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: '700%',
    marginRight: theme.spacing(2),
  },
  heading: {
    margin: 0,
    fontSize: '250%',
    color: '#fff',
    textDecoration: 'none',
  },
}));

const Logo: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Link to="/">
      <Box display="flex" alignItems="center">
        <GamingIcon color="primary" className={classes.icon} />
        <h1 className={classes.heading}>Daddel</h1>
      </Box>
      <Typography
        variant="subtitle1"
        style={{ marginBottom: theme.spacing(4) }}
      >
        Plane Spieleabende mit deinen Freunden
      </Typography>
    </Link>
  );
};

export default Logo;
