import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';

import green from '@material-ui/core/colors/green';
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';

import { Theme } from '../styles/theme';

type Props = {
  value: number;
  max: number;
};

function calcBarColor(value: number, max: number) {
  const STEPS = 5;

  if (value > max) {
    throw new Error(`Value ${value} must be less than maximum ${max}`);
  }

  const colorIndex = Math.round((value * STEPS) / max);

  switch (colorIndex) {
    case 0:
      return 'transparent';
    case 1:
      return green[500];
    case 2:
      return green[500];
    case 3:
      return yellow[500];
    case 4:
      return orange[500];
    case 5:
      return red[500];
    default:
      throw new Error('This should not happen');
  }
}

const useStyles = makeStyles<Theme, Props>(theme => ({
  root: {
    width: '100%',
    height: 8,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[700],
  },
  barColorPrimary: {
    backgroundColor: ({ value, max }) => calcBarColor(value, max),
  },
}));

export const ProgressBar: React.FC<Props> = ({ value, max }) => {
  const classes = useStyles({ value, max });

  return (
    <LinearProgress
      classes={{
        root: classes.root,
        colorPrimary: classes.colorPrimary,
        barColorPrimary: classes.barColorPrimary,
      }}
      variant="determinate"
      value={(value / max) * 100}
    />
  );
};

export default ProgressBar;
