export enum STORAGE_KEY {
  FREQUENTLY_USED_EMOJIS = 'daddel-frequently-used-emojis',
}

export function getStorageItem<T>(
  key: STORAGE_KEY,
  storage: Storage = localStorage,
): T | null {
  try {
    const value = storage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
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
    console.error(`Unable to set storage item ${key}.`);
  }
}
