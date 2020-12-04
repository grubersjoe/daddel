import slugify from '@sindresorhus/slugify';

import { Game } from '../../../types';
import { supportsWebp } from '../../../utils';

const cache: {
  [key: string]: string | null;
} = {};

export async function getGameBanner(game: Game): Promise<string | null> {
  if (!game.name) {
    throw new Error('Game name not set');
  }

  const slug = slugify(game.name, { separator: '-' });
  const fileName = slug.concat((await supportsWebp()) ? '.webp' : '.jpg');

  if (cache[fileName] === undefined) {
    try {
      cache[fileName] = (await import(`./out/${fileName}`)).default;
    } catch {
      cache[fileName] = null;
    }
  }

  return cache[fileName];
}
