import React from 'react';
import fromUnixTime from 'date-fns/fromUnixTime';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import { formatDate } from '../utils';
import { Match } from '../pages/Matches';
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
    fontSize: '140%',
  },
  subtitle: {
    marginBottom: '0.5em',
  },
  bar: {
    height: 12,
    marginTop: '1.5em',
    marginBottom: '0.5em',
  },
});

const MatchCard: React.FC<Props> = ({ match }) => {
  const classes = useStyles();
  const notFull = match.players.length < match.maxPlayers;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} variant="h3" gutterBottom>
          {formatDate(match.date.seconds)}
        </Typography>
        <Typography className={classes.subtitle} color="textSecondary">
          <TimeAgo date={fromUnixTime(match.date.seconds)} />
        </Typography>
        <Typography variant="body2" component="ol">
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
      <Skeleton variant="rect" height={252} />
    </Box>
    <Box marginBottom="1.5rem">
      <Skeleton variant="rect" height={252} />
    </Box>
    <Box marginBottom="1.5rem">
      <Skeleton variant="rect" height={252} />
    </Box>
  </>
);

export default MatchCard;
