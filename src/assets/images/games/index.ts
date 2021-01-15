import slugify from '@sindresorhus/slugify';

import { Game } from '../../../types';
import { supportsWebp } from '../../../utils';

export async function getGameBanner(game: Game): Promise<string | null> {
  const slug = slugify(game.name, { separator: '-' });
  const fileName = slug.concat((await supportsWebp()) ? '.webp' : '.jpg');

  try {
    return (await import(`./out/${fileName}`)).default;
  } catch {
    return null;
  }
}
