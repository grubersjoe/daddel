import slugify from '@sindresorhus/slugify';

import { Game } from '../../../types';

export async function getGameBanner(game: Game) {
  const fileName = slugify(game.name, { separator: '-' }).concat('.jpg');
  const url = new URL(`./out/${fileName}`, import.meta.url);

  return url.pathname === '/undefined' ? null : url;
}
