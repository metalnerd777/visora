export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch {
    // ignore
  }

  return fallback;
}

export function saveJSON(key: string, data: unknown): void {
  localStorage.setItem(key, JSON.stringify(data));
}
