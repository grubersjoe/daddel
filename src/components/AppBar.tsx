import React, { MouseEventHandler } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FilterIcon from '@mui/icons-material/FilterListRounded';
import {
  AppBar as MuiAppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';

type Props = RouteComponentProps & {
  filter?: {
    color: 'inherit' | 'primary' | 'secondary' | 'default';
    enabled: number;
    title: string;
    onClick: MouseEventHandler;
  };
  title?: string;
};

const AppBar: React.FC<Props> = ({ children, filter, title }) => (
  <MuiAppBar position="fixed">
    <Toolbar variant="dense">
      {title && (
        <Typography component="h1" variant="h6">
          {title}
        </Typography>
      )}
      <Box flexGrow={1}>{children}</Box>
      <div>
        {filter && (
          <IconButton
            color={filter.color}
            title={filter.title}
            onClick={filter.onClick}
            size="large"
          >
            <Badge badgeContent={filter.enabled} color="primary" variant="dot">
              <FilterIcon />
            </Badge>
          </IconButton>
        )}
      </div>
    </Toolbar>
  </MuiAppBar>
);

export default withRouter(AppBar);
