import React, { MouseEventHandler } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import FilterIcon from '@material-ui/icons/FilterListRounded';
import IconButton from '@material-ui/core/IconButton';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

type Props = RouteComponentProps & {
  filter?: {
    color: 'inherit' | 'primary' | 'secondary' | 'default';
    enabled: number;
    title: string;
    onClick: MouseEventHandler;
  };
  title?: string;
};

const useStyles = makeStyles(theme =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    children: {
      flexGrow: 1,
    },
  }),
);

const AppBar: React.FC<Props> = ({ children, filter, title }) => {
  const classes = useStyles();

  return (
    <MuiAppBar position="fixed" color="default">
      <Toolbar variant="dense">
        {title && (
          <Typography variant="h6" style={{ marginBottom: 0 }}>
            {title}
          </Typography>
        )}
        <div className={classes.children}>{children}</div>
        <div>
          {filter && (
            <IconButton
              color={filter.color}
              title={filter.title}
              onClick={filter.onClick}
            >
              <Badge
                badgeContent={filter.enabled}
                color="primary"
                variant="dot"
              >
                <FilterIcon />
              </Badge>
            </IconButton>
          )}
        </div>
      </Toolbar>
    </MuiAppBar>
  );
};

export default withRouter(AppBar);
