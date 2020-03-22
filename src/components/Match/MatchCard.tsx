import React from 'react';
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
import gameBanners from '../../assets/images/games';
import { DEFAULT_GAME, FALLBACK_GAME } from '../../constants';
import { theme } from '../../styles/theme';
import { Match, UserMap } from '../../types';
import { formatDate, formatTimestamp } from '../../utils';

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
}));

const MatchCard: React.FC<Props> = ({ match, userList }) => {
  const classes = useStyles();

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

  // At the beginning of time only CSGO existed
  const image =
    gameBanners[match.game || DEFAULT_GAME] || gameBanners[FALLBACK_GAME];

  return (
    <Card className={classes.card} raised>
      <CardMedia className={classes.media} image={image}>
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
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="space-between"
      >
        <CardContent>
          <Typography
            color="textSecondary"
            style={{ marginBottom: theme.spacing(1.5) }}
          >
            <TimeAgo date={fromUnixTime(match.date.seconds)} />
          </Typography>
          {match.description && (
            <Typography
              style={{ marginBottom: theme.spacing(3), lineHeight: 1.25 }}
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
          <CardActions style={{ padding: theme.spacing(2), paddingTop: 0 }}>
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

export const MatchCardSkeleton: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.card}>
        <Skeleton variant="rect" height={200} />
      </Box>
      <Box className={classes.card}>
        <Skeleton variant="rect" height={200} />
      </Box>
      <Box className={classes.card}>
        <Skeleton variant="rect" height={200} />
      </Box>
    </>
  );
};

export default MatchCard;
