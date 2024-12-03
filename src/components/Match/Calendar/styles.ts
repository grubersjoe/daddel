import { Theme } from '@mui/material/styles';

export const styles = (theme: Theme) =>
  ({
    root: {
      position: 'relative',
      pt: 3.5, // space for legend
      fontSize: theme.typography.pxToRem(14),
    },
    timeLabel: {
      position: 'absolute',
      top: 0,
      height: '100%',
      borderLeft: 'solid 1px rgba(255, 255, 255, 0.2)',
      paddingLeft: '0.45em',
      lineHeight: 1,
      color: theme.palette.grey[300],
    },
    bar: {
      position: 'relative',
      top: 0,
      height: 28, // a round number is preferable here (Skeleton)
      marginBottom: '7px',
      padding: '0.25em 0.75em',
      color: theme.palette.getContrastText(theme.palette.grey[300]),
      backgroundColor: theme.palette.grey[300],
      borderRadius: '4px',
      userSelect: 'none',

      [theme.breakpoints.up('lg')]: {
        marginBottom: '8px',
      },
    },
    textOverflow: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }) as const;
