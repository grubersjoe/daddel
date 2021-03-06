import React from 'react';
import { Helmet } from 'react-helmet';

type Props = {
  title?: string;
  description?: string;
};

const DEFAULT_DESCRIPTION = 'Plane Spieleabende mit Deinen FreundInnen';

const PageMetadata: React.FC<Props> = ({ title, description }) => (
  <Helmet
    title={title ?? 'Daddel'}
    meta={[
      {
        property: 'og:description',
        content: description ?? DEFAULT_DESCRIPTION,
      },
      {
        property: 'og:title',
        content: title,
      },
    ]}
  />
);

export default PageMetadata;
