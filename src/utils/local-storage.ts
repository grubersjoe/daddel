export enum STORAGE_KEY {
  FREQUENTLY_USED_EMOJIS = 'daddel-frequently-used-emojis',
}

export function getStorageItem(
  key: STORAGE_KEY,
  storage: Storage = localStorage,
): unknown {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
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
