import {
  Box,
  ButtonBase,
  ButtonBaseProps,
  ButtonGroup,
  SxProps,
} from '@mui/material';
import React, { FunctionComponent, SVGProps, memo } from 'react';

import { categoryIcons } from './assets/icons';
import { CategoryName } from './types';
import { getCategoryContainerId } from './utils';

interface Props {
  active?: CategoryName;
}

interface ButtonProps extends ButtonBaseProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

const BUTTON_FONT_SIZE = '20px';

const NavButton: FunctionComponent<ButtonProps> = ({
  icon: Icon,
  ...buttonProps
}) => (
  <ButtonBase
    focusRipple
    sx={{
      py: 1,
      px: 1.25,
      color: 'grey.300',
      borderRadius: 1,
    }}
    {...buttonProps}
  >
    <Icon
      style={{
        display: 'inline-block',
        width: '1em',
        height: '1em',
        fontSize: BUTTON_FONT_SIZE,
        userSelect: 'none',
      }}
    />
  </ButtonBase>
);

const CategoryNav: FunctionComponent<Props> = ({ active }) => {
  const styles: SxProps = {
    '&': {
      position: 'relative',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -9,
      left: 0,
      width: `calc(${BUTTON_FONT_SIZE} + 1.25rem)`,
      height: '2px',
      backgroundColor: 'primary.light',
      transition: 'transform 300ms ease-in-out',
      transform: `translateX(${
        100 * categoryIcons.findIndex(([category]) => category === active)
      }%)`,
    },
  };

  return (
    <Box sx={{ mb: 2, pt: 1, overflow: 'auto' }} className="hide-scrollbar">
      <Box
        sx={{
          px: 1,
          pb: 1,
          borderBottom: 1,
          borderColor: 'grey.700',
        }}
      >
        <ButtonGroup sx={active ? styles : undefined}>
          {categoryIcons.map(([category, icon]) => (
            <NavButton
              icon={icon}
              title={category}
              onClick={() => {
                const element = document.getElementById(
                  getCategoryContainerId(category),
                );

                if (element) {
                  element.scrollIntoView();
                }
              }}
              key={category}
            />
          ))}
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default memo(CategoryNav);
