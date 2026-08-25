import type { EmbedProvider } from "../types/portfolio";

const providerLabels: Record<EmbedProvider, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  instagram: "Instagram",
  facebook: "Facebook",
  behance: "Behance",
  flickr: "Flickr",
};

export function getProviderLabel(provider: EmbedProvider): string {
  return providerLabels[provider];
}

export function detectEmbedProvider(url: string): EmbedProvider | null {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }

  if (url.includes("vimeo.com")) {
    return "vimeo";
  }

  if (url.includes("instagram.com")) {
    return "instagram";
  }

  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return "facebook";
  }

  if (url.includes("behance.net")) {
    return "behance";
  }

  if (url.includes("flickr.com")) {
    return "flickr";
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
