export function getStorageItem<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
}

export function setStorageItem(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`Unable to set local storage item ${key}.`);
  }
}
