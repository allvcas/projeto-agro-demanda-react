/* Safe localStorage read/write helpers */
export function storageGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storageSet(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded or private mode — silently ignore */
  }
}

export function storageRemove(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
