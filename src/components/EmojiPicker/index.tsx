import React, {
  FunctionComponent,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import {
  Box,
  Button,
  Dialog,
  Popover,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { People as PickerIcon } from './assets/icons';
import { Emoji } from './types';
import Picker from './Picker';

interface Props {
  onEmojiClick: (emoji: Emoji) => void;
}

const EmojiPicker: FunctionComponent<Props> = ({ onEmojiClick }) => {
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null,
  );

  const onClick: MouseEventHandler<HTMLButtonElement> = event =>
    setAnchorElement(event.currentTarget);

  const onClose = () => setAnchorElement(null);
  const open = Boolean(anchorElement);

  const handleEmojiClick = useCallback(
    (emoji: Emoji) => {
      onClose();
      onEmojiClick(emoji);
    },
    [onEmojiClick],
  );

  const theme = useTheme();
  const xsView = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Button
        onClick={onClick}
        sx={{
          height: 32,
          px: 1.25,
          minWidth: 'auto',
          fontWeight: 700,
          '&.MuiButton-root': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <PickerIcon style={{ width: '1rem', height: '1rem' }} />
        <Box component="span" sx={{ ml: 0.5 }}>
          +
        </Box>
      </Button>

      {xsView ? (
        <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          PaperProps={{
            sx: {
              alignSelf: 'flex-end',
            },
          }}
        >
          <Picker onEmojiClick={handleEmojiClick} />
        </Dialog>
      ) : (
        <Popover
          open={open}
          onClose={onClose}
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 40,
            horizontal: 'left',
          }}
        >
          <Picker onEmojiClick={handleEmojiClick} />
        </Popover>
      )}
    </>
  );
};

export default EmojiPicker;
