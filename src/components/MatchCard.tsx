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
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import { Match } from '../types';
import { formatDate } from '../utils';
import TimeAgo from '../components/TimeAgo';

type Props = {
  match: Match;
};

const useStyles = makeStyles({
  card: {
    marginBottom: '1.5rem',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '130%',
  },
  subtitle: {
    marginBottom: '0.5em',
  },
  bar: {
    height: 12,
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  list: {
    margin: '0.75rem 0 1rem',
    paddingLeft: '2em',
    lineHeight: 1.75,
  },
});

const MatchCard: React.FC<Props> = ({ match }) => {
  const classes = useStyles();
  const notFull = match.players.length < match.maxPlayers;

  if (match.date instanceof Date) {
    throw new Error('This should not happen');
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Typography className={classes.title} variant="h3" gutterBottom>
            {formatDate(match.date.seconds)}
          </Typography>
          <Typography className={classes.title} variant="h3" gutterBottom>
            {format(match.date.seconds, 'HH:mm')} Uhr
          </Typography>
        </Grid>
        <Typography className={classes.subtitle} color="textSecondary">
          <TimeAgo date={fromUnixTime(match.date.seconds)} />
        </Typography>
        <Typography className={classes.list} variant="body2" component="ol">
          {match.players.map(player => (
            <li key={player}>{player}</li>
          ))}
        </Typography>
        <LinearProgress
          className={classes.bar}
          variant="determinate"
          value={(match.players.length / match.maxPlayers) * 100}
        />
        <Typography variant="body2" color="textSecondary">
          {match.players.length}/{match.maxPlayers} Plätze belegt
        </Typography>
      </CardContent>
      {notFull && (
        <CardActions>
          <Button color="primary" size="medium">
            Mitbolzen!
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export const MatchCardSkeleton: React.FC = () => (
  <>
    <Box marginBottom="1.5rem">
      <Skeleton variant="rect" height={200} />
    </Box>
    <Box marginBottom="1.5rem">
      <Skeleton variant="rect" height={200} />
    </Box>
    <Box marginBottom="1.5rem">
      <Skeleton variant="rect" height={200} />
    </Box>
  </>
);

export default MatchCard;
