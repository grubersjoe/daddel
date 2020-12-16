import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';

import { useStyles } from './MatchCard';

const MatchCardSkeleton: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Card className={classes.card} raised>
      <CardMedia
        className={classes.media}
        style={{
          background: `linear-gradient(to bottom, rgb(60, 60, 60) 0%, rgb(40, 40, 40) 100%)`,
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
        <CardContent className={classes.cardContent}>
          {/* Date and permalink */}
          <Skeleton
            variant="text"
            width="60%"
            height={28}
            animation="wave"
            style={{ marginBottom: theme.spacing(0.5) }}
          />

          {/* Description */}
          <Skeleton
            variant="text"
            width="40%"
            height={28}
            animation="wave"
            style={{ marginBottom: theme.spacing(3) }}
          />

          {/* Calendar bars */}
          <Skeleton
            variant="text"
            width="85%"
            height={40}
            animation="wave"
            style={{ marginTop: theme.spacing(-1), marginLeft: '15%' }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={40}
            animation="wave"
            style={{ marginTop: theme.spacing(-1) }}
          />
          <Skeleton
            variant="text"
            width="85%"
            height={40}
            animation="wave"
            style={{ marginTop: theme.spacing(-1), marginLeft: '15%' }}
          />
        </CardContent>
      </Box>
    </Card>
  );
};

export default MatchCardSkeleton;
