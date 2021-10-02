import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, CardMedia, Skeleton } from '@mui/material';
import { Theme } from '@mui/system';

import { styles as cardStyles } from './MatchCard';

const styles = (theme: Theme) =>
  ({
    bar: {
      transform: 'none',
      marginBottom: '7px',
      [theme.breakpoints.up('lg')]: {
        marginBottom: '8px',
      },
    },
  } as const);

const MatchCardSkeleton: React.FC = () => {
  const theme = useTheme();
  const sx = styles(theme);
  const cardSx = cardStyles(theme);

  return (
    <Card sx={cardSx.card} raised>
      <CardMedia
        sx={{
          ...cardSx.media,
          ...{
            background: `linear-gradient(to bottom, rgb(70, 70, 70) 0%, rgb(50, 50, 50) 100%)`,
          },
        }}
      >
        {/* Lobby progress bar */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={8}
          animation="wave"
        />
      </CardMedia>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        justifyContent="space-between"
      >
        <CardContent sx={cardSx.cardContent}>
          {/* Date and permalink */}
          <Skeleton
            variant="text"
            width="65%"
            height={22}
            animation="wave"
            sx={{
              transform: 'none',
            }}
          />

          {/* Calendar bars */}
          <Skeleton
            variant="text"
            width="85%"
            height={28}
            animation="wave"
            sx={{
              ...sx.bar,
              mt: 6.25,
              ml: '15%',
            }}
          />
          <Skeleton
            variant="text"
            width="80%"
            height={28}
            animation="wave"
            sx={sx.bar}
          />
          <Skeleton
            variant="text"
            width="85%"
            height={28}
            animation="wave"
            sx={{
              ...sx.bar,
              ...{
                ml: '15%',
              },
            }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={28}
            animation="wave"
            sx={{
              ...sx.bar,
              ...{
                ml: '30%',
              },
            }}
          />
        </CardContent>
      </Box>
    </Card>
  );
};

export default MatchCardSkeleton;
