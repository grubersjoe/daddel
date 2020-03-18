import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Theme } from '../styles/theme';

type Props = {
  image: string;
  aspectRatio?: string;
};

const useStyles = makeStyles<Theme, Props>(theme => ({
  card: {
    marginBottom: theme.spacing(3),
    paddingBottom: ({ aspectRatio }) => `calc(100% * ${aspectRatio})`,
    backgroundImage: ({ image }) => `url(${image})`,
    backgroundColor: theme.palette.grey[800],
    backgroundSize: 'cover',
    borderRadius: 4,
    overflow: 'hidden',
  },
}));

const ImageBanner: React.FC<Props> = ({ image, aspectRatio = '9/16' }) => {
  const classes = useStyles({ image, aspectRatio });

  return <div className={classes.card} />;
};

export default ImageBanner;
