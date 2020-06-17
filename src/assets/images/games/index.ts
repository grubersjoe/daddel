import { FALLBACK_GAME } from '../../../constants';
import { supportsWebp } from '../../../utils';

import fallback from './out/fallback.jpg';
import fallbackWebp from './out/fallback.webp';

import apex from './out/apex.jpg';
import apexWebp from './out/apex.webp';
import coh from './out/coh.jpg';
import cohWebp from './out/coh.webp';
import csgo from './out/csgo.jpg';
import csgoWebp from './out/csgo.webp';
import dota from './out/dota.jpg';
import dotaWebp from './out/dota.webp';
import forest from './out/forest.jpg';
import forestWebp from './out/forest.webp';
import helldivers from './out/helldivers.jpg';
import helldiversWebp from './out/helldivers.webp';
import hunt from './out/hunt.jpg';
import huntWebp from './out/hunt.webp';
import left4Dead from './out/left4dead.jpg';
import left4DeadWebp from './out/left4dead.webp';
import rocketLeague from './out/rocket-league.jpg';
import rocketLeagueWebp from './out/rocket-league.webp';
import smite from './out/smite.jpg';
import smiteWebp from './out/smite.webp';
import tabletopSimulator from './out/tabletop-simulator.jpg';
import tabletopSimulatorWebp from './out/tabletop-simulator.webp';
import trackmania from './out/trackmania.jpg';
import trackmaniaWebp from './out/trackmania.webp';
import valorant from './out/valorant.jpg';
import valorantWebp from './out/valorant.webp';

export async function getGameBanner(gameID?: string) {
  const webp = await supportsWebp();
  const key = gameID && webp ? gameID.concat('Webp') : gameID;

  return gameBanners[key || FALLBACK_GAME] || gameBanners[FALLBACK_GAME];
}

const gameBanners: {
  [key: string]: string;
} = {
  apex,
  apexWebp,
  coh,
  cohWebp,
  csgo,
  csgoWebp,
  dota,
  dotaWebp,
  fallback,
  fallbackWebp,
  forest,
  forestWebp,
  helldivers,
  helldiversWebp,
  hunt,
  huntWebp,
  left4Dead,
  left4DeadWebp,
  rocketLeague,
  rocketLeagueWebp,
  smite,
  smiteWebp,
  tabletopSimulator,
  tabletopSimulatorWebp,
  trackmania,
  trackmaniaWebp,
  valorant,
  valorantWebp,
};

export default gameBanners;
