import React, { ComponentType, FunctionComponent } from 'react';
import ReactTimeAgo, { ReactTimeagoProps } from 'react-timeago';
// @ts-ignore
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
// @ts-ignore
import localeDE from 'react-timeago/lib/language-strings/de';

const TimeAgo: FunctionComponent<ReactTimeagoProps<ComponentType>> = props => (
  <ReactTimeAgo formatter={buildFormatter(localeDE)} {...props} />
);

export default TimeAgo;
