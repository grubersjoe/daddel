export enum STORAGE_KEY {
  MATCH_FILTER = 'daddel-match-filter',
  MATCH_FILTER_ENABLED = 'daddel-match-filter-enabled',
  FREQUENTLY_USED_EMOJIS = 'daddel-frequently-used-emojis',
}

export function getStorageItem<T>(
  key: STORAGE_KEY,
  storage: Storage = localStorage,
): T | null {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    return null;
  }
}

export function setStorageItem(
  key: STORAGE_KEY,
  value: unknown,
  storage: Storage = localStorage,
): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // eslint-disable-next-line no-console
    console.error(`Unable to set storage item ${key}.`);
  }
}
