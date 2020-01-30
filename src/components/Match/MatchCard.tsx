import React from 'react';
import format from 'date-fns/format';
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

import { TIME_FORMAT } from '../../constants/time';
import { Match, UserList } from '../../types';
import { formatDate } from '../../utils';
import gameImages from '../../assets/images/games';
import JoinDialog from '../Dialogs/JoinMatch';
import ProgressBar from './ProgressBar';
import TimeAgo from '../TimeAgo';

type Props = {
  match: Match;
  userList: UserList;
};

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: '2rem',
  },
  media: {
    height: 180,
    backgroundPosition: 'top',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  date: {
    padding: '24px 16px 8px 16px',
    color: '#fff',
    fontWeight: 500,
  },
  subtitle: {
    marginBottom: '0.5em',
  },
  list: {
    margin: '1rem 0 0',
    paddingLeft: '2em',
    lineHeight: 1.75,
  },
}));

const MatchCard: React.FC<Props> = ({ match, userList }) => {
  const classes = useStyles();

  const matchInFuture = isFuture(fromUnixTime(match.date.seconds));
  const lobbyNotFull = match.players.length < match.maxPlayers;

  if (match.date instanceof Date || !match.id) {
    throw new Error('This should not happen');
  }

  return (
    <Card className={classes.card} raised>
      <CardMedia className={classes.media} image={gameImages.csgo}>
        <Grid container direction="column" alignItems="flex-end">
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
              {format(fromUnixTime(match.date.seconds), 'H:mm')} Uhr
            </Typography>
          </Grid>
          <Grid container item>
            <ProgressBar value={match.players.length} max={match.maxPlayers} />
          </Grid>
        </Grid>
      </CardMedia>
      <CardContent>
        <Typography className={classes.subtitle} color="textSecondary">
          <TimeAgo date={fromUnixTime(match.date.seconds)} />
        </Typography>

        {match.players.length === 0 && (
          <Typography color="textSecondary" style={{ margin: '1rem 0 0.5rem' }}>
            Noch niemand
          </Typography>
        )}
        {match.players.length > 0 && (
          <Typography className={classes.list} variant="body2" component="ol">
            {match.players.map(({ uid, from, until }, idx) => (
              <li key={idx}>
                {userList.get(uid)?.nickname
                  ? userList.get(uid)?.nickname
                  : 'Unknown'}
                {' - '}
                {format(fromUnixTime(from.seconds), TIME_FORMAT)} -{' '}
                {format(fromUnixTime(until.seconds), TIME_FORMAT)}
              </li>
            ))}
          </Typography>
        )}
      </CardContent>
      {matchInFuture && lobbyNotFull && (
        <CardActions style={{ padding: '0 16px 16px 16px' }}>
          <JoinDialog match={match} />
        </CardActions>
      )}
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
