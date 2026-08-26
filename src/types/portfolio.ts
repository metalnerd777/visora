export type SocialPlatform =
  | "instagram"
  | "behance"
  | "vimeo"
  | "linkedin"
  | "twitter"
  | "facebook"
  | "flickr"
  | "youtube"
  | string;

export interface SocialLink {
  platform: SocialPlatform;
  handle: string;
}

export interface PortfolioProfile {
  name: string;
  profession: string;
  description: string;

  avatar?: string;

  heroImage?: string;
  heroPrimaryButton?: string;
  heroSecondaryButton?: string;

  aboutTitle: string;
  aboutDescription: string;

  contactTitle?: string;
  contactDescription?: string;

  email: string;
  location: string;
  socialLinks: SocialLink[];
}

export interface Photo {
  id: string;
  url: string;
  title: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  photos: Photo[];
}

export interface SiteTexts {
  workNounSingular: string;
  workNounPlural: string;

  featuredLabel: string;
  featuredTitle: string;
  featuredDescription: string;

  projectsLabel: string;
  projectsTitle: string;
  projectsDescription: string;
}

export type EmbedProvider =
  | "youtube"
  | "vimeo"
  | "instagram"
  | "facebook"
  | "behance"
  | "flickr";

export interface BlogBlock {
  id: string;
  type: "text" | "image" | "embed";
  text?: string;
  url?: string;
  alt?: string;
  caption?: string;
  provider?: EmbedProvider;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  blocks: BlogBlock[];
}
