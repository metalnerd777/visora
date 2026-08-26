import type { SocialPlatform } from "../types/portfolio";

const platformUrls: Partial<Record<string, (handle: string) => string>> = {
  instagram: (h) => `https://instagram.com/${h.replace(/^@/, "")}`,
  behance: (h) => `https://behance.net/${h.replace(/^@/, "")}`,
  linkedin: (h) => `https://linkedin.com/in/${h.replace(/^@/, "")}`,
  vimeo: (h) => `https://vimeo.com/${h.replace(/^@/, "")}`,
  twitter: (h) => `https://x.com/${h.replace(/^@/, "")}`,
  facebook: (h) => `https://facebook.com/${h.replace(/^@/, "")}`,
  flickr: (h) => `https://flickr.com/people/${h}`,
  youtube: (h) => `https://youtube.com/@${h.replace(/^@/, "")}`,
};

export function socialUrl(platform: SocialPlatform, handle: string): string {
  const builder = platformUrls[platform];

  if (builder) {
    return builder(handle);
  }

  return `https://${platform}.com/${handle.replace(/^@/, "")}`;
}

export function socialLabel(platform: SocialPlatform): string {
  if (platform === "twitter") return "X / Twitter";

  return (
    platform.charAt(0).toUpperCase() + platform.slice(1)
  );
}
