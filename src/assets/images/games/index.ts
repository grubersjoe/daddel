export async function getGameBanner(steamAppId: number) {
  const fileName = String(steamAppId).concat('.webp');
  const url = new URL(`./out/${fileName}`, import.meta.url);

  return url.pathname === '/undefined' ? null : url;
}
