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

import firebase from '../../api/firebase';
import { getGameBanner } from '../../assets/images/games';
import { FALLBACK_GAME_BANNER } from '../../constants';
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

const Separator: React.FC = () => <span style={{ margin: '0 0.4em' }}>•</span>;

const MatchCard: React.FC<Props> = ({ match, userList }) => {
  const classes = useStyles();

  const [game, setGame] = useState<Game | null>(null);
  const [gameBanner, setGameBanner] = useState<string | null>(null);

  if (game === null) {
    // Retrieve game from match
    match.gameRef
      .get()
      .then(game =>
        setGame(({ ...game.data(), gid: game.id } as Game) ?? null),
      );
  }

  if (game && gameBanner === null) {
    getGameBanner(game).then(banner => {
      if (banner === FALLBACK_GAME_BANNER) {
        setGameBanner(FALLBACK_GAME_BANNER);
      } else {
        // Preload the game banner
        const image = new Image();
        image.src = banner;
        image.onload = () => setGameBanner(banner);
        image.onerror = console.error;
      }
    });
  }

  const isFallbackBanner = gameBanner === FALLBACK_GAME_BANNER;

  const { currentUser } = firebase.auth;

  if (!currentUser) {
    throw new Error('No current user');
  }

  const currentPlayer = match.players.find(
    player => player.uid === currentUser.uid,
  );

  // It should be able to join a match until the end of its date
  const isJoinable = isFuture(endOfDay(fromUnixTime(match.date.seconds)));

  if (!game || gameBanner === null) {
    return <MatchCardSkeleton />;
  }

  return (
    <Card className={classes.card} raised>
      <CardMedia
        className={classes.media}
        image={isFallbackBanner ? undefined : gameBanner}
        style={{
          ...(isFallbackBanner && {
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
          <Box flexGrow={1} zIndex={1}>
            <Menu game={game} match={match} />
          </Box>

          {gameBanner === FALLBACK_GAME_BANNER && (
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
                  fontWeight: 'bold',
                  fontSize: 'clamp(1rem, 20vw, 120px)',
                  marginTop: -28,
                  userSelect: 'none',
                }}
              >
                ?
              </span>
            </Box>
          )}

          <Grid
            container
            item
            direction="row"
            justify="space-between"
            alignItems="flex-end"
            style={{
              background: isFallbackBanner
                ? 'linear-gradient(transparent, rgba(0, 0, 0, 0.3))'
                : 'linear-gradient(transparent, rgba(0, 0, 0, 0.95))',
              zIndex: 1,
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
