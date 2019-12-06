import React from 'react';
import ReactTimeAgo, { ReactTimeagoProps } from 'react-timeago';

// @ts-ignore
import localeDE from 'react-timeago/lib/language-strings/de';
// @ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const TimeAgo: React.FC<ReactTimeagoProps<React.ComponentType>> = props => (
  <ReactTimeAgo formatter={buildFormatter(localeDE)} {...props} />
);

export default TimeAgo;
