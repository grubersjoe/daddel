import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { common } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/system';
import endOfDay from 'date-fns/endOfDay';
import isFuture from 'date-fns/isFuture';
import { getDoc } from 'firebase/firestore';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getGameBanner } from '../../assets/images/games';
import { toggleMatchReaction } from '../../services/reactions';
import { Game, Match, UserMap } from '../../types';
import { formatDate, formatTime } from '../../utils/date';
import JoinMatchDialog from '../Dialogs/JoinMatchDialog';
import EmojiPicker from '../EmojiPicker';
import PageMetadata from '../PageMetadata';
import TimeAgo from '../TimeAgo';
import Calendar from './Calendar';
import FallbackBanner from './FallbackBanner';
import MatchCardSkeleton from './MatchCardSkeleton';
import MatchReactions from './MatchReactions';
import Menu from './Menu';
import ProgressBar from './ProgressBar';

type Props = {
  match: Match;
  userList: UserMap;
  setPageMetadata?: boolean;
};

export const styles = (theme: Theme) =>
  ({
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardContent: {
      padding: theme.spacing(2),

      [theme.breakpoints.up('lg')]: {
        padding: `${theme.spacing(2.5)} ${theme.spacing(2.5)} 0`,
      },
    },
    media: {
      height: '42vw',
      backgroundPosition: 'top',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',

      [theme.breakpoints.up('sm')]: {
        height: 170,
      },

      [theme.breakpoints.up('lg')]: {
        height: 200,
      },

      [theme.breakpoints.up('xl')]: {
        height: 220,
      },
    },
    date: {
      padding: '24px 16px 8px 16px',
      color: common.white,
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
  } as const);

const Separator: FunctionComponent = () => (
  <Box component="span" sx={{ mx: '0.4em' }}>
    •
  </Box>
);

const MatchCard: FunctionComponent<Props> = ({
  match,
  userList,
  setPageMetadata,
}) => {
  const sx = styles(useTheme());

  const [game, setGame] = useState<Game | null>();
  const [gameBanner, setGameBanner] = useState<URL | null>();

  // Retrieve the game via reference
  useEffect(() => {
    getDoc<Game>(match.game).then(game => {
      const data = game.data();
      setGame(data ? ({ ...data, id: game.id } as Game) : null);
    });
  }, [match]);

  // Then retrieve game banner
  useEffect(() => {
    if (game) {
      getGameBanner(game).then(setGameBanner);
    }
  }, [game]);

  const hasBanner = gameBanner !== null;

  // It should be able to join a match until the end of its date
  const isJoinable = isFuture(endOfDay(match.date.toDate()));

  const handleEmojiClick = (emoji: string) => toggleMatchReaction(match, emoji);

  if (!game || gameBanner === undefined) {
    return <MatchCardSkeleton />;
  }

  return (
    <>
      {setPageMetadata && <PageMetadata title={`${game.name} – Daddel`} />}

      <Card sx={sx.card} raised>
        <CardMedia
          image={hasBanner ? gameBanner.href : undefined}
          sx={{
            ...sx.media,
            ...(!hasBanner && {
              background:
                'linear-gradient(hsl(0deg 0% 28%) 0%, hsl(0deg 0% 24%) 100%)',
            }),
          }}
        >
          <Grid
            container
            flexDirection="column"
            alignItems="flex-end"
            sx={{
              position: 'relative',
              height: '100%',
            }}
          >
            <Box flexGrow={1}>
              <Menu game={game} match={match} />
            </Box>

            {!hasBanner && <FallbackBanner game={game} />}

            <Grid
              container
              item
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{
                ...(hasBanner && {
                  background:
                    'linear-gradient(transparent, rgba(0, 0, 0, 0.95))',
                }),
              }}
            >
              <Typography sx={sx.date}>{formatDate(match.date)}</Typography>
              <Typography sx={sx.date}>{formatTime(match.date)} Uhr</Typography>
            </Grid>
            {game.maxPlayers && (
              <Grid container item>
                <ProgressBar
                  value={match.players.length}
                  max={game.maxPlayers}
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
          <CardContent sx={sx.cardContent}>
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              <TimeAgo date={match.date.toDate()} />
              <Separator />
              <Link to={`/matches/${match.id}`}>Permalink</Link>
            </Typography>
            {match.description && (
              <Typography
                sx={{
                  lineHeight: 1.3,
                  whiteSpace: 'pre-line',
                }}
              >
                <Link to={`/matches/${match.id}`}>{match.description}</Link>
              </Typography>
            )}

            <Box mt={3}>
              <Calendar players={match.players} userList={userList} />
            </Box>

            <Box
              mt={3}
              mb={0.5}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.25,
              }}
            >
              {isJoinable && (
                <EmojiPicker
                  onEmojiClick={([emoji]) => handleEmojiClick(emoji)}
                />
              )}
              {match.reactions && (
                <MatchReactions
                  reactions={match.reactions}
                  onClick={emoji => handleEmojiClick(emoji)}
                />
              )}
            </Box>
          </CardContent>
          {isJoinable && (
            <CardActions sx={sx.actions}>
              <JoinMatchDialog match={match} />
            </CardActions>
          )}
        </Box>
      </Card>
    </>
  );
};

export default MatchCard;
