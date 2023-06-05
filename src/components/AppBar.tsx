import FilterIcon from '@mui/icons-material/FilterListRounded';
import {
  Badge,
  Box,
  Container,
  IconButton,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import React, {
  FunctionComponent,
  MouseEventHandler,
  ReactElement,
} from 'react';

interface Props {
  children?: ReactElement;
  filter?: {
    color: 'inherit' | 'primary' | 'secondary' | 'default';
    enabled: number;
    title: string;
    onClick: MouseEventHandler;
  };
  title?: string;
}

const AppBar: FunctionComponent<Props> = ({ children, filter, title }) => (
  <MuiAppBar position="fixed">
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        {title && (
          <Container>
            <Typography component="h1" variant="h6">
              {title}
            </Typography>
          </Container>
        )}
        {children && <Box flexGrow={1}>{children}</Box>}
        <div>
          {filter && (
            <IconButton
              color={filter.color}
              title={filter.title}
              onClick={filter.onClick}
              size="large"
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
    </Box>
  </MuiAppBar>
);

export default AppBar;
