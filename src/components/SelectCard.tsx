import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  image: string;
  isSelected?: boolean;
  onClick?: () => void;
  title: string;
};

const useStyles = makeStyles(theme => ({
  card: {
    display: 'inline-flex',
    borderRadius: 4,
    overflow: 'hidden',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
}));

const SelectCard: React.FC<Props> = ({
  image,
  isSelected = false,
  onClick,
  title,
}) => {
  const classes = useStyles();

  return (
    <div
      className={classes.card}
      title={title}
      onClick={onClick}
      style={{
        filter: isSelected ? 'grayscale(0%)' : 'grayscale(100%)',
      }}
    >
      <img src={image} alt={title} className={classes.image} />
    </div>
  );
};

export default SelectCard;
