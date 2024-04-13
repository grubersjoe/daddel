import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
}

const DEFAULT_DESCRIPTION = 'Plane Spieleabende mit Deinen Freunden';

const PageMetadata = ({ title, description }: Props) => (
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
