import {
  profile,
  projects,
  featuredPhotos,
  siteTexts,
  blogPosts,
} from "./portfolio";

import { defaultSettings } from "./settings";

/**
 * Datos oficiales de la demo de Visora.
 * Reutiliza las fuentes actuales para evitar duplicar contenido.
 */
export const demoPortfolio = {
  profile,
  projects,
  featuredPhotos,
  siteTexts,
  blogPosts,
  settings: defaultSettings,
} as const;
