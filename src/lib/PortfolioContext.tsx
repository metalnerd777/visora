import { createContext } from "react";

import type {
  PortfolioProfile,
  Project,
  Photo,
  SiteTexts,
  BlogPost,
} from "../types/portfolio";

export interface PortfolioContextType {
  profile: PortfolioProfile;
  projects: Project[];
  featuredPhotos: Photo[];
  siteTexts: SiteTexts;
  blogPosts: BlogPost[];
  refresh: () => void;
  setBlogPosts: (posts: BlogPost[]) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export default PortfolioContext;
