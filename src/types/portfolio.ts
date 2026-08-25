export interface Photographer {
  name: string;
  profession: string;
  description: string;

  heroImage?: string;
  heroPrimaryButton?: string;
  heroSecondaryButton?: string;

  aboutTitle: string;
  aboutDescription: string;

  contactTitle?: string;
  contactDescription?: string;

  email: string;
  location: string;
  instagram?: string;
  behance?: string;
}

export type PhotoId = number;

export interface Photo {
  id: PhotoId;
  url: string;
  title: string;
}

export interface Project {
  id: string;
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
