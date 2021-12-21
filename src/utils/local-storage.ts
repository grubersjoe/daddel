export const STORAGE_KEYS = {
  matchFilter: 'daddel-match-filter',
  matchFilterEnabled: 'daddel-match-filter-enabled',
};

export function getStorageItem<T>(
  key: string,
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
  key: string,
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
