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
import { endOfDay, isFuture } from 'date-fns';
import { Link } from 'react-router-dom';

import { toggleMatchReaction } from '../../services/match';
import { Match } from '../../types';
import { formatDate, formatTime } from '../../utils/date';
import JoinMatchDialog from '../Dialogs/JoinMatchDialog';
import EmojiPicker from '../EmojiPicker';
import PageMetadata from '../PageMetadata';
import Calendar from './Calendar/Calendar';
import GameBanner from './GameBanner';
import MatchCardSkeleton from './MatchCardSkeleton';
import MatchReactions from './MatchReactions';
import Menu from './Menu';
import ProgressBar from './ProgressBar';

interface Props {
  match: Match;
  setPageMetadata?: boolean;
}

const imageAspectRatio = (616 / 353).toFixed(3);

/**
 * @see https://partner.steamgames.com/doc/store/assets/standard
 */
const getSteamImage = (steamAppId: number) =>
  new URL(
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamAppId}/capsule_616x353.jpg`,
  );

export const styles = ({ spacing, breakpoints }: Theme) =>
  ({
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardContent: {
      [breakpoints.up('lg')]: {
        padding: `${spacing(2.5)} ${spacing(2.5)} 0`,
      },
    },
    media: {
      aspectRatio: imageAspectRatio,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      filter: 'drop-shadow(0px 0px 6px #222)',
      borderBottom: `1px solid hsl(0deg 0% 16%)`,
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
  }) as const;

const Separator = () => (
  <Box component="span" sx={{ mx: '0.4em' }}>
    •
  </Box>
);

const MatchCard = ({ match, setPageMetadata }: Props) => {
  const theme = useTheme();
  const sx = styles(theme);

  const { game } = match;
  const image = game.steamAppId ? getSteamImage(game.steamAppId) : null;

  // It should be possible to join a match until the end of its date
  const isJoinable = isFuture(endOfDay(match.date.toDate()));

  const handleEmojiClick = (emoji: string) => toggleMatchReaction(match, emoji);

  if (!game) {
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
              background: `linear-gradient(135deg, hsl(0deg 0% 30%) 0%, hsl(0deg 0% 22%) 100%)`,
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

            {!image && <GameBanner game={game} />}

            {game.maxPlayers ? (
              <Grid container item>
                <ProgressBar
                  value={match.players.length}
                  max={game.maxPlayers}
                />
              </Grid>
            ) : null}
          </Grid>
        </CardMedia>

        <Box
          display="flex"
          flexGrow={1}
          flexDirection="column"
          justifyContent="space-between"
        >
          <CardContent sx={sx.cardContent}>
            <Typography color="textSecondary" mb={2}>
              {formatDate(match.date)} {formatTime(match.date)} Uhr
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
              <Calendar players={match.players} />
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
