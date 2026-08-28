export function slugify(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const slug = normalized
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "publicacion";
}

export function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;

  let i = 2;

  while (existing.includes(`${base}-${i}`)) {
    i += 1;
  }

  return `${base}-${i}`;
}
