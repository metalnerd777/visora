import { createContext } from "react";

import type {
  PortfolioProfile,
  Project,
  Photo,
  SiteTexts,
  BlogPost,
  SiteSettings,
} from "../types/portfolio";

export interface PortfolioContextType {
  profile: PortfolioProfile;
  projects: Project[];
  featuredPhotos: Photo[];
  siteTexts: SiteTexts;
  blogPosts: BlogPost[];
  settings: SiteSettings;
  refresh: () => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  setSettings: (settings: SiteSettings) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export default PortfolioContext;
