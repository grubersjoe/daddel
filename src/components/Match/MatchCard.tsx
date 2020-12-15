import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import Typography from '@material-ui/core/Typography';

import firebase from '../../services/firebase';
import { getGameBanner } from '../../assets/images/games';
import { UNKNOWN_GAME_ID } from '../../constants';
import { theme } from '../../styles/theme';
import { Game, Match, UserMap } from '../../types';
import { formatDate, formatTimestamp } from '../../utils/date';

import JoinMatchDialog from '../Dialogs/JoinMatch';
import Calendar from './Calendar';
import MatchCardSkeleton from './MatchCardSkeleton';
import Menu from './Menu';
import ProgressBar from './ProgressBar';
import TimeAgo from '../TimeAgo';

type Props = {
  match: Match;
  userList: UserMap;
};

export const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    padding: theme.spacing(2),

    [theme.breakpoints.up('lg')]: {
      padding: `${theme.spacing(2.5)}px ${theme.spacing(2.5)}px 0`,
    },
  },
  media: {
    height: '42vw',
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
    zIndex: 1,
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

const Separator: React.FC = () => <span style={{ margin: '0 0.4em' }}>•</span>;

const FallbackBanner: React.FC<{ game: Game }> = ({ game }) => {
  const isUnknownGame = game.id === UNKNOWN_GAME_ID;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      position="absolute"
    >
      <span
        style={{
          margin: '-28px 1em 0 1em',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: isUnknownGame
            ? 'clamp(1rem, 20vw, 120px)'
            : 'clamp(1.25rem, 2vw, 1.5rem)',
          lineHeight: 1.4,
          userSelect: 'none',
        }}
      >
        {isUnknownGame ? '?' : game.name}
      </span>
    </Box>
  );
};

const MatchCard: React.FC<Props> = ({ match, userList }) => {
  const classes = useStyles();

  const [game, setGame] = useState<Game | null>();
  const [gameBanner, setGameBanner] = useState<string | null>();

  // Retrieve the game via reference
  if (game === undefined) {
    match.gameRef.get().then(game => {
      const data = game.data();
      setGame(data ? ({ ...data, id: game.id } as Game) : null);
    });
  }

  // Then retrieve game banner
  if (game && gameBanner === undefined) {
    getGameBanner(game).then(banner => {
      if (banner === null) {
        setGameBanner(null);
      } else {
        // Preload the image
        const image = new Image();
        image.src = banner;
        image.onload = () => setGameBanner(banner);
      }
    });
  }

  const hasNoBanner = gameBanner === null;

  const currentPlayer = match.players.find(
    player => player.uid === firebase.auth.currentUser?.uid,
  );

  // It should be able to join a match until the end of its date
  const isJoinable = isFuture(endOfDay(fromUnixTime(match.date.seconds)));

  if (!game || gameBanner === undefined) {
    return <MatchCardSkeleton />;
  }

  return (
    <Card className={classes.card} raised>
      <CardMedia
        className={classes.media}
        image={gameBanner || undefined}
        style={{
          ...(hasNoBanner && {
            background:
              'linear-gradient(to bottom, rgb(60, 60, 60) 0%, rgb(40, 40, 40) 100%)',
          }),
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="flex-end"
          style={{ position: 'relative', height: '100%' }}
        >
          <Box flexGrow={1}>
            <Menu game={game} match={match} />
          </Box>

          {hasNoBanner && <FallbackBanner game={game} />}

          <Grid
            container
            item
            direction="row"
            justify="space-between"
            alignItems="flex-end"
            style={{
              background: hasNoBanner
                ? 'linear-gradient(transparent, rgba(0, 0, 0, 0.3))'
                : 'linear-gradient(transparent, rgba(0, 0, 0, 0.95))',
            }}
          >
            <Typography className={classes.date}>
              {formatDate(match.date)}
            </Typography>
            <Typography className={classes.date}>
              {formatTimestamp(match.date)} Uhr
            </Typography>
          </Grid>
          {game.maxPlayers && (
            <Grid container item>
              <ProgressBar value={match.players.length} max={game.maxPlayers} />
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
        <CardContent className={classes.cardContent}>
          <Typography
            color="textSecondary"
            style={{ marginBottom: theme.spacing(1.75) }}
          >
            <TimeAgo date={fromUnixTime(match.date.seconds)} />
            <Separator />
            <Link to={`/matches/${match.id}`}>Permalink</Link>
          </Typography>

          {match.description && (
            <Typography
              style={{ marginBottom: theme.spacing(2), lineHeight: 1.25 }}
            >
              <Link to={`/matches/${match.id}`}>{match.description}</Link>
            </Typography>
          )}
          {match.players.length === 0 ? (
            <Typography
              color="textSecondary"
              style={{ marginBottom: theme.spacing(1) }}
            >
              Keine Mitspieler bisher
            </Typography>
          ) : (
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
