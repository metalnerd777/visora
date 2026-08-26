import { createContext } from "react";

import type {
  PortfolioProfile,
  Project,
  Photo,
  SiteTexts,
} from "../types/portfolio";

export interface PortfolioContextType {
  profile: PortfolioProfile;
  projects: Project[];
  featuredPhotos: Photo[];
  siteTexts: SiteTexts;
  refresh: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export default PortfolioContext;
