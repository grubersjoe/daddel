import {
  Box,
  Button,
  Fade,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Fragment, MouseEvent, useState } from 'react';

import { LOCALE } from '../../constants';
import useUsers from '../../hooks/useUsers';
import { MatchReaction } from '../../types';

interface Props {
  reactions: Array<MatchReaction>;
  onClick: (emoji: string) => void;
}

const listFormatter = new Intl.ListFormat(LOCALE);

const MatchReactions = ({ reactions, onClick }: Props) => {
  const { users, loading } = useUsers();

  const theme = useTheme();
  const mdViewUp = useMediaQuery(theme.breakpoints.up('md'));

  const [anchorElements, setAnchorElements] = useState<
    Record<string, HTMLElement | undefined>
  >({});

  const handlePopoverOpen = (key: string, event: MouseEvent<HTMLElement>) => {
    setAnchorElements({ [key]: event.currentTarget });
  };

  const handlePopoverClose = () => {
    setAnchorElements({});
  };

  return (
    <>
      {reactions.map(({ emoji, userRefs }) => (
        <Fragment key={emoji}>
          <Fade in={true}>
            <Button
              onClick={() => {
                onClick(emoji);
              }}
              onMouseEnter={event => {
                handlePopoverOpen(emoji, event);
              }}
              onMouseLeave={() => {
                handlePopoverClose();
              }}
              sx={{
                px: 1.25,
                py: 0.75,
                minWidth: 'auto',
                lineHeight: 1,
                '&.MuiButton-root': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <Box component="span" sx={{ mr: 0.75, fontSize: 18 }}>
                {emoji}
              </Box>
              {userRefs.length}
            </Button>
          </Fade>

          {mdViewUp && userRefs.length > 0 && (
            <Popover
              open={Boolean(anchorElements[emoji])}
              onClose={handlePopoverClose}
              anchorEl={anchorElements[emoji]}
              anchorOrigin={{
                vertical: 40,
                horizontal: 'left',
              }}
              elevation={16}
              disableRestoreFocus
              disableScrollLock
              sx={{
                pointerEvents: 'none',
              }}
            >
              <Typography variant="body2" sx={{ px: 1, py: 0.75 }}>
                {loading ? (
                  <>Lade…</>
                ) : (
                  <>
                    {listFormatter.format(
                      userRefs.map(
                        userRef => users[userRef.id]?.nickname ?? 'unbekannt',
                      ),
                    )}
                  </>
                )}
              </Typography>
            </Popover>
          )}
        </Fragment>
      ))}
    </>
  );
};

export default MatchReactions;
