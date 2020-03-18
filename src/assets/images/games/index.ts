import csgo from './out/csgo.jpg';
import csgoWebp from './out/csgo.webp';
import helldivers from './out/helldivers.jpg';
import helldiversWebp from './out/helldivers.webp';
import tabletopSimulator from './out/tabletop-simulator.jpg';
import tabletopSimulatorWebp from './out/tabletop-simulator.webp';

const gameBanners = {
  csgo,
  csgoWebp,
  helldivers,
  helldiversWebp,
  tabletopSimulator,
  tabletopSimulatorWebp,
};

export type GameBanner = typeof gameBanners;

export default gameBanners;
