import slugify from '@sindresorhus/slugify';

import { FALLBACK_GAME_BANNER } from '../../../constants';
import { Game } from '../../../types';
import { supportsWebp } from '../../../utils';

import apex_legends from './out/apex.jpg';
import apex_legends_webp from './out/apex.webp';
import company_of_heroes_2 from './out/coh.jpg';
import company_of_heroes_2_webp from './out/coh.webp';
import counter_strike_global_offensive from './out/csgo.jpg';
import counter_strike_global_offensive_webp from './out/csgo.webp';
import dota_2 from './out/dota.jpg';
import dota_2_webp from './out/dota.webp';
import the_forest from './out/forest.jpg';
import the_forest_webp from './out/forest.webp';
import helldivers from './out/helldivers.jpg';
import helldivers_webp from './out/helldivers.webp';
import hunt_showdown from './out/hunt.jpg';
import hunt_showdown_webp from './out/hunt.webp';
import left_4_dead from './out/left4dead.jpg';
import left_4_dead_webp from './out/left4dead.webp';
import rocket_league from './out/rocket-league.jpg';
import rocket_league_webp from './out/rocket-league.webp';
import smite from './out/smite.jpg';
import smite_webp from './out/smite.webp';
import tabletop_simulator from './out/tabletop-simulator.jpg';
import tabletop_simulator_webp from './out/tabletop-simulator.webp';
import track_mania_nations_forever from './out/trackmania.jpg';
import track_mania_nations_forever_webp from './out/trackmania.webp';
import valorant from './out/valorant.jpg';
import valorant_webp from './out/valorant.webp';

export async function getGameBanner(game: Game) {
  if (!game.name) {
    throw new Error('Game name not set');
  }

  const banner = slugify(game.name, { separator: '_' });
  const webp = await supportsWebp();
  const key = banner && webp ? banner.concat('_webp') : banner;

  return gameBanners[key] || FALLBACK_GAME_BANNER;
}

const gameBanners: {
  [key: string]: string;
} = {
  apex_legends,
  apex_legends_webp,
  company_of_heroes_2,
  company_of_heroes_2_webp,
  counter_strike_global_offensive,
  counter_strike_global_offensive_webp,
  dota_2,
  dota_2_webp,
  the_forest,
  the_forest_webp,
  helldivers,
  helldivers_webp,
  hunt_showdown,
  hunt_showdown_webp,
  left_4_dead,
  left_4_dead_webp,
  rocket_league,
  rocket_league_webp,
  smite,
  smite_webp,
  tabletop_simulator,
  tabletop_simulator_webp,
  track_mania_nations_forever,
  track_mania_nations_forever_webp,
  valorant,
  valorant_webp,
};

export default gameBanners;
