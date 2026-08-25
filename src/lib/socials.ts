export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

export function behanceUrl(user: string): string {
  return `https://behance.net/${user.replace(/^@/, "")}`;
}
