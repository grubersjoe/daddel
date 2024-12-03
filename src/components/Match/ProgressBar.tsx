import LinearProgress from '@mui/material/LinearProgress';
import { green, grey, orange, red, yellow } from '@mui/material/colors';

interface Props {
  value: number;
  max: number;
}

function calcBarColor(value: number, max: number) {
  const STEPS = 5;

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
      throw new Error(`Undefined color index ${colorIndex}`);
  }
}

export const ProgressBar = ({ value, max }: Props) => {
  value = Math.min(value, max);

  if (value < 1) {
    return null;
  }

  return (
    <LinearProgress
      sx={{
        width: '100%',
        height: 8,
        filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.75))',
        backgroundColor: grey[700],
        '& .MuiLinearProgress-bar': {
          backgroundColor: calcBarColor(value, max),
        },
      }}
      variant="determinate"
      value={(value / max) * 100}
    />
  );
};

export default ProgressBar;
