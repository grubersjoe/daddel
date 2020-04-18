import React, { useState } from 'react';
import endOfDay from 'date-fns/endOfDay';
import isFuture from 'date-fns/isFuture';
import fromUnixTime from 'date-fns/fromUnixTime';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import firebase from '../../api/firebase';
import { getGameBanner } from '../../assets/images/games';
import { theme } from '../../styles/theme';
import { Match, UserMap } from '../../types';
import { formatDate, formatTimestamp } from '../../utils/date';

import JoinMatchDialog from '../Dialogs/JoinMatch';
import Calendar from './Calendar';
import Menu from './Menu';
import ProgressBar from './ProgressBar';
import TimeAgo from '../TimeAgo';

type Props = {
  match: Match;
  userList: UserMap;
};

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    padding: theme.spacing(2),

    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(2.5),
    },
  },
  media: {
    height: '40vw',
    backgroundPosition: 'top',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',

    [theme.breakpoints.up('md')]: {
      height: 180,
    },

    [theme.breakpoints.up('lg')]: {
      height: 220,
    },
  },
  date: {
    padding: '24px 16px 8px 16px',
    color: '#fff',
    fontWeight: 500,
  },
  list: {
    margin: '1rem 0 0',
    paddingLeft: '2em',
    lineHeight: 1.75,
  },
  actions: {
    padding: theme.spacing(2),
    paddingTop: 0,

    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(2.5),
    },
  },
}));

const MatchCard: React.FC<Props> = ({ match, userList }) => {
  const classes = useStyles();
  const [gameBanner, setGameBanner] = useState<string | undefined>();

  getGameBanner(match.game).then(banner => {
    // Preload the game banner
    const image = new Image();
    image.src = banner;
    image.onload = () => setGameBanner(banner);
    image.onerror = console.error;
  });

  const { currentUser } = firebase.auth;
  if (!currentUser) return null;

  const currentPlayer = match.players.find(
    player => player.uid === currentUser.uid,
  );

  // It should be able to join a match until the end of its date
  const isJoinable = isFuture(endOfDay(fromUnixTime(match.date.seconds)));

  if (match.date instanceof Date) {
    throw new Error('match.date is not a Date');
  }

  if (!match.id) {
    throw new Error('match.id is undefined');
  }

  return (
    <Card className={classes.card} raised>
      {gameBanner ? (
        <CardMedia className={classes.media} image={gameBanner}>
          <Grid
            container
            direction="column"
            alignItems="flex-end"
            justify="space-between"
            style={{ height: '100%' }}
          >
            <Box flexGrow={1}>
              <Menu match={match} />
            </Box>
            <Grid
              container
              item
              direction="row"
              justify="space-between"
              alignItems="flex-end"
              style={{
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.95))',
              }}
            >
              <Typography className={classes.date}>
                {formatDate(match.date)}
              </Typography>
              <Typography className={classes.date}>
                {formatTimestamp(match.date)} Uhr
              </Typography>
            </Grid>
            {match.maxPlayers && (
              <Grid container item>
                <ProgressBar
                  value={match.players.length}
                  max={match.maxPlayers}
                />
              </Grid>
            )}
          </Grid>
        </CardMedia>
      ) : (
        <Skeleton
          variant="rect"
          className={classes.media}
          style={{ display: 'block' }}
        />
      )}
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="space-between"
      >
        <CardContent className={classes.cardContent}>
          <Typography
            color="textSecondary"
            style={{ marginBottom: theme.spacing(1.75) }}
          >
            <TimeAgo date={fromUnixTime(match.date.seconds)} />
          </Typography>
          {match.description && (
            <Typography
              style={{ marginBottom: theme.spacing(3.75), lineHeight: 1.25 }}
            >
              {match.description}
            </Typography>
          )}
          {match.players.length === 0 && (
            <Typography
              color="textSecondary"
              style={{ margin: `${theme.spacing(2)} 0` }}
            >
              Noch niemand
            </Typography>
          )}
          {match.players.length > 0 && (
            <Calendar players={match.players} userList={userList} />
          )}
        </CardContent>
        {isJoinable && (
          <CardActions className={classes.actions}>
            <JoinMatchDialog
              match={match}
              initialFrom={currentPlayer?.from}
              initialUntil={currentPlayer?.until}
            />
          </CardActions>
        )}
      </Box>
    </Card>
  );
};

export default MatchCard;
