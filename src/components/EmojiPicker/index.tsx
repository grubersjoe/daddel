import React, { FunctionComponent, MouseEventHandler, useState } from 'react';
import { Button, Dialog, Popover } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { People as PickerIcon } from './assets/icons';
import { Emoji } from './types';
import Picker from './Picker';

interface Props {
  onEmojiClick: (emoji: Emoji) => void;
}

const EmojiPicker: FunctionComponent<Props> = ({
  onEmojiClick: onEmojiClickProp,
}) => {
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null,
  );

  const onClick: MouseEventHandler<HTMLButtonElement> = event =>
    setAnchorElement(event.currentTarget);

  const onClose = () => setAnchorElement(null);
  const open = Boolean(anchorElement);

  const onEmojiClick = (emoji: Emoji) => {
    onClose();
    onEmojiClickProp(emoji);
  };

  const theme = useTheme();
  const xsView = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Button onClick={onClick} sx={{ px: 1.5, py: 1, minWidth: 0 }}>
        <PickerIcon style={{ width: '1rem', height: '1rem' }} />
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
          <Picker onEmojiClick={onEmojiClick} />
        </Dialog>
      ) : (
        <Popover
          open={open}
          onClose={onClose}
          anchorEl={anchorElement}
          anchorOrigin={{
            vertical: 48,
            horizontal: 'left',
          }}
        >
          <Picker onEmojiClick={onEmojiClick} />
        </Popover>
      )}
    </>
  );
};

export default EmojiPicker;
