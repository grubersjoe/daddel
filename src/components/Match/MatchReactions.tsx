import React, { Fragment, FunctionComponent } from 'react';
import {
  Box,
  Button,
  Fade,
  Popover,
  Typography,
  useTheme,
} from '@mui/material';

import { Reaction } from '../../types';
import useFetchUsers from '../../hooks/useFetchUsers';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  reactions: Array<Reaction>;
  onClick: (emoji: string) => void;
}

function prettyPrintNames(names: Array<string>): string {
  const str = names.slice(0, names.length - 1).join(', ');

  if (str.length > 0) {
    return str.concat(` und ${names[names.length - 1]}`);
  }

  return str.concat(names[0]);
}

const MatchReactions: FunctionComponent<Props> = ({ reactions, onClick }) => {
  const [users, usersLoading] = useFetchUsers();

  const [anchorElements, setAnchorElements] = React.useState<{
    [key: string]: HTMLElement | undefined;
  }>({});

  const handlePopoverOpen = (
    key: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorElements({ [key]: event.currentTarget });
  };

  const handlePopoverClose = () => {
    setAnchorElements({});
  };

  const theme = useTheme();
  const mdViewUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      {reactions.map(({ emoji, userRefs }) => (
        <Fragment key={emoji}>
          <Fade in={true}>
            <Button
              onClick={() => onClick(emoji)}
              onMouseEnter={event => handlePopoverOpen(emoji, event)}
              onMouseLeave={() => handlePopoverClose()}
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
              sx={{
                pointerEvents: 'none',
              }}
            >
              <Typography variant="body2" sx={{ px: 1, py: 0.75 }}>
                {usersLoading || !users ? (
                  <>Lade…</>
                ) : (
                  <>
                    {prettyPrintNames(
                      userRefs.map(
                        userRef => users.get(userRef.id)?.nickname ?? '⁉️',
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
