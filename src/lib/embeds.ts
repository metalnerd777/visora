import type { EmbedProvider } from "../types/portfolio";

const providerLabels: Record<EmbedProvider, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  instagram: "Instagram",
  facebook: "Facebook",
  behance: "Behance",
  flickr: "Flickr",
};

const ALLOWED_HOSTS: Record<EmbedProvider, string[]> = {
  youtube: ["youtube.com", "youtu.be", "www.youtube.com", "m.youtube.com"],
  vimeo: ["vimeo.com", "player.vimeo.com"],
  instagram: ["instagram.com", "www.instagram.com"],
  facebook: ["facebook.com", "www.facebook.com", "fb.watch"],
  behance: ["behance.net", "www.behance.net"],
  flickr: ["flickr.com", "www.flickr.com"],
};

export function getProviderLabel(provider: EmbedProvider): string {
  return providerLabels[provider];
}

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    // If it doesn't parse as a URL but looks like a path, try https prepended
    return null;
  }
}

export function detectEmbedProvider(rawUrl: string): EmbedProvider | null {
  const url = rawUrl.trim();
  const hostname = getHostname(url);

  if (!hostname) return null;

  for (const provider of Object.keys(ALLOWED_HOSTS) as EmbedProvider[]) {
    if (ALLOWED_HOSTS[provider].some((h) => h === hostname || hostname.endsWith(`.${h}`))) {
      return provider;
    }
  }

  return null;
}

export function toEmbeddableUrl(
  url: string,
  provider: EmbedProvider
): string | null {
  if (provider === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/
    );

    return match
      ? `https://www.youtube-nocookie.com/embed/${match[1]}`
      : null;
  }

  if (provider === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);

    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }

  return null;
}
