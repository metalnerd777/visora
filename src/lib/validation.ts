export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isNonEmpty(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isPhone(value: string): boolean {
  return /^\+?[0-9 ]{6,18}$/.test(value.replace(/[\s-]/g, ""));
}

export function isNumberInRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function isSafeUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;

    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeUrl(value: string | undefined | null): string | null {
  const v = value?.trim();

  if (!v) return null;

  return isSafeUrl(v) ? v : null;
}

export function sanitizeText(value: string): string {
  let result = "";

  for (const char of value) {
    const code = char.charCodeAt(0);

    if (
      code !== 0x09 &&
      code !== 0x0a &&
      code !== 0x0d &&
      !(code < 0x20 || code === 0x7f)
    ) {
      result += char;
    }
  }

  return result;
}
