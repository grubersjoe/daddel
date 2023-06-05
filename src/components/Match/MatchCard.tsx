import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Theme } from '@mui/system';
import endOfDay from 'date-fns/endOfDay';
import isFuture from 'date-fns/isFuture';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { useSteamApp } from '../../hooks/useSteamApp';
import { toggleMatchReaction } from '../../services/reactions';
import { Match, UserMap } from '../../types';
import { formatDate, formatTime } from '../../utils/date';
import JoinMatchDialog from '../Dialogs/JoinMatchDialog';
import EmojiPicker from '../EmojiPicker';
import PageMetadata from '../PageMetadata';
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

export const styles = ({ spacing, breakpoints }: Theme) =>
  ({
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardContent: {
      padding: spacing(2),

      [breakpoints.up('lg')]: {
        padding: `${spacing(2.5)} ${spacing(2.5)} 0`,
      },
    },
    media: {
      height: '42vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',

      [breakpoints.up('sm')]: {
        height: 170,
      },

      [breakpoints.up('lg')]: {
        height: 200,
      },

      [breakpoints.up('xl')]: {
        height: 240,
      },
    },
    title: {
      width: '100%',
      height: spacing(10),
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    titleItem: {
      padding: `${spacing(4)} ${spacing(2)} ${spacing(1.5)} ${spacing(2)}`,
      fontWeight: 600,
      textShadow: '1px 1px 1px #111',
    },
    list: {
      margin: '1rem 0 0',
      paddingLeft: '2em',
      lineHeight: 1.75,
    },
    actions: {
      padding: spacing(2),
      paddingTop: 0,

      [breakpoints.up('lg')]: {
        padding: spacing(2.5),
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
  const theme = useTheme();
  const sx = styles(theme);

  const { game } = match;
  const { data: steamApp, isInitialLoading: steamAppLoading } = useSteamApp(
    game.steamAppId,
  );

  const image = steamApp
    ? new URL(steamApp.screenshots[0].path_thumbnail)
    : null;

  // It should be possible to join a match until the end of its date
  const isJoinable = isFuture(endOfDay(match.date.toDate()));

  const handleEmojiClick = (emoji: string) => toggleMatchReaction(match, emoji);

  if (!game || steamAppLoading) {
    return <MatchCardSkeleton />;
  }

  return (
    <>
      {setPageMetadata && <PageMetadata title={`${game.name} – Daddel`} />}

      <Card sx={sx.card} raised>
        <CardMedia
          image={image?.href}
          sx={{
            ...sx.media,
            ...(!image && {
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

            {!image && <FallbackBanner game={game} />}

            <Box
              sx={{
                ...sx.title,
                ...(image && {
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 1))',
                }),
              }}
            >
              <Typography sx={sx.titleItem}>{game.name}</Typography>
              <Typography sx={sx.titleItem}>
                {formatTime(match.date)} Uhr
              </Typography>
            </Box>

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
              {formatDate(match.date)}
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
