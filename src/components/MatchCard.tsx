import React from 'react';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import { Match, UserList } from '../types';
import { formatDate } from '../utils';
import TimeAgo from '../components/TimeAgo';
import CardMedia from '@material-ui/core/CardMedia';
import gameImages from '../assets/images/games';
import ProgressBar from './ProgressBar';

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
    margin: '1rem 0',
    paddingLeft: '2em',
    lineHeight: 1.75,
  },
}));

const MatchCard: React.FC<Props> = ({ match, userList }) => {
  const classes = useStyles();

  const lobbyNotFull = match.players.length < match.maxPlayers;

  if (match.date instanceof Date) {
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
              {formatDate(match.date.seconds)}
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
          <Typography color="textPrimary" style={{ margin: '1.5rem 0 0' }}>
            Noch niemand
          </Typography>
        )}
        <Typography className={classes.list} variant="body2" component="ol">
          {match.players.map((player, idx) => (
            <li key={idx}>
              {player.uid
                ? userList.get(player.uid)?.nickname
                : player.toString()}
            </li>
          ))}
        </Typography>
        {/* <Typography variant="body2" color="textSecondary">
          {match.players.length}/{match.maxPlayers} Plätze belegt
        </Typography> */}
      </CardContent>
      {lobbyNotFull && (
        <CardActions style={{ padding: '0 16px 16px 16px' }}>
          <Button
            color="primary"
            size="medium"
            variant="contained"
            disableElevation
            fullWidth
          >
            Mitbolzen
          </Button>
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
