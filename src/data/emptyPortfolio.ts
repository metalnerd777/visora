import type {
  BlogPost,
  Photo,
  PortfolioProfile,
  Project,
  SiteSettings,
  SiteTexts,
} from "../types/portfolio";

import { defaultSettings } from "./settings";

/**
 * Estado inicial para "Comenzar desde cero".
 * Solo contiene estructuras y textos neutros: no reutiliza el contenido de la demo.
 */
export const emptyProfile: PortfolioProfile = {
  name: "Mi portafolio",
  profession: "Fotografía",
  description: "",

  heroImage: "",
  heroPrimaryButton: "Ver portfolio",
  heroSecondaryButton: "Contacto",

  aboutTitle: "Sobre mí",
  aboutDescription: "",

  contactTitle: "Hablemos.",
  contactDescription: "",

  email: "",
  location: "",

  socialLinks: [],
};

export const emptySiteTexts: SiteTexts = {
  workNounSingular: "proyecto",
  workNounPlural: "proyectos",

  featuredLabel: "Destacados",
  featuredTitle: "Trabajos destacados",
  featuredDescription: "",

  projectsLabel: "Portafolio",
  projectsTitle: "Proyectos",
  projectsDescription: "",
};

export const emptyProjects: Project[] = [];
export const emptyFeaturedPhotos: Photo[] = [];
export const emptyBlogPosts: BlogPost[] = [];

/**
 * Parte de los valores por defecto de apariencia (tema, modo, colores, radio)
 * para no duplicar configuración, pero reemplaza los datos de marca de la demo.
 */
export const emptySettings: SiteSettings = {
  ...defaultSettings,
  general: {
    ...defaultSettings.general,
    brandName: emptyProfile.name,
    profession: emptyProfile.profession,
  },
  socials: [],
};

export const emptyPortfolio = {
  profile: emptyProfile,
  projects: emptyProjects,
  featuredPhotos: emptyFeaturedPhotos,
  siteTexts: emptySiteTexts,
  blogPosts: emptyBlogPosts,
  settings: emptySettings,
} as const;
