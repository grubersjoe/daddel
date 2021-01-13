import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';

import { useStyles as useCardStyles } from './MatchCard';

const useStyles = makeStyles(theme => ({
  bar: {
    transform: 'none',
    marginBottom: 7,
    [theme.breakpoints.up('lg')]: {
      marginBottom: 8,
    },
  },
}));

const MatchCardSkeleton: React.FC = () => {
  const { spacing } = useTheme();
  const classes = useStyles();
  const cardClasses = useCardStyles();

  return (
    <Card className={cardClasses.card} raised>
      <CardMedia
        className={cardClasses.media}
        style={{
          background: `linear-gradient(to bottom, rgb(70, 70, 70) 0%, rgb(50, 50, 50) 100%)`,
        }}
      >
        {/* Lobby progress bar */}
        <Skeleton variant="rect" width="100%" height={8} animation="wave" />
      </CardMedia>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="space-between"
      >
        <CardContent className={cardClasses.cardContent}>
          {/* Date and permalink */}
          <Skeleton
            variant="text"
            width="65%"
            height={22}
            animation="wave"
            style={{
              transform: 'none',
            }}
          />

          {/* Calendar bars */}
          <Skeleton
            variant="text"
            width="85%"
            height={28}
            animation="wave"
            className={classes.bar}
            style={{
              marginTop: spacing(6.25),
              marginLeft: '15%',
            }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={28}
            animation="wave"
            className={classes.bar}
          />
          <Skeleton
            variant="text"
            width="85%"
            height={28}
            animation="wave"
            className={classes.bar}
            style={{
              marginLeft: '15%',
            }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={28}
            animation="wave"
            className={classes.bar}
            style={{
              marginLeft: '30%',
            }}
          />
        </CardContent>
      </Box>
    </Card>
  );
};

export default MatchCardSkeleton;
