import { createContext } from "react";

import type { InitMode, InitialSetupData } from "./initializePortfolio";

import type {
  PortfolioProfile,
  Project,
  Photo,
  SiteTexts,
  BlogPost,
  SiteSettings,
  HeroConfig,
  ContactConfig,
} from "../types/portfolio";

export interface PortfolioContextType {
  profile: PortfolioProfile;
  projects: Project[];
  featuredPhotos: Photo[];
  siteTexts: SiteTexts;
  blogPosts: BlogPost[];
  settings: SiteSettings;
  heroConfig: HeroConfig;
  contactConfig: ContactConfig;
  initialized: boolean;
  initMode: InitMode | null;
  initialize: (mode: InitMode, setupData?: InitialSetupData) => void;
  exitDemo: () => boolean;
  refresh: () => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  setSettings: (settings: SiteSettings) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export default PortfolioContext;
