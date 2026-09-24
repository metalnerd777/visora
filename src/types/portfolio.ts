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
  heroImageMobile?: string;
  heroImageFocusX?: number;
  heroImageFocusY?: number;
  heroImageMobileFocusX?: number;
  heroImageMobileFocusY?: number;
  heroPrimaryButton?: string;
  heroSecondaryButton?: string;

  aboutTitle: string;
  aboutDescription: string;
  aboutImage?: string;
  aboutImageFocusX?: number;
  aboutImageFocusY?: number;

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

export type WatermarkStyle = "tiling" | "corner";

export type EmbedProvider =
  | "youtube"
  | "vimeo"
  | "instagram"
  | "facebook"
  | "behance"
  | "flickr";

export interface BlogBlock {
  id: string;
  type: "text" | "image" | "embed" | "separator";
  text?: string;
  content?: unknown;
  url?: string;
  alt?: string;
  caption?: string;
  provider?: EmbedProvider;
}

export type ThemeMode = "system" | "light" | "dark";

export type ThemeId = "minimal" | "editorial";

export interface SiteSettings {
  version?: number;
  general: {
    brandName: string;
    profession: string;
    language: string;
    favicon: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
    noindex: boolean;
  };
  appearance: {
    theme: ThemeId;
    mode: ThemeMode;
    primaryColor: string;
    background: { color1: string; color2: string };
    fontFamily: string;
    borderRadius: "sm" | "md" | "lg";
    buttonStyle: "pill" | "rounded" | "square";
  };
  socials: SocialLink[];
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
    notice: string;
    protectImages: boolean;
    cookieNotice: string;
    watermarkEnabled: boolean;
    watermarkStyle: WatermarkStyle;
    watermarkOpacity: number;
    watermarkText: string;
  };
  site: {
    published: boolean;
  };
}

export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  coverFocusX?: number;
  coverFocusY?: number;
  date: string;
  status: BlogPostStatus;
  blocks: BlogBlock[];
}
