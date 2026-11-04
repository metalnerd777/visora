import { demoPortfolio } from "../data/demo";
import { PROFILE_VERSION } from "../data/portfolio";
import { SETTINGS_VERSION } from "../data/settings";
import { saveJSON } from "./storage";

const INITIALIZED_KEY = "visora-initialized";

const STORAGE_KEYS = [
  "visora-admin-profile",
  "visora-admin-projects",
  "visora-admin-featured",
  "visora-admin-texts",
  "visora-admin-blog-posts",
  "visora-admin-settings",
];

/**
 * Inicializa Visora con los datos de demostración.
 * No sobrescribe información que ya exista.
 */
export function initializePortfolio(): void {
  try {
    if (localStorage.getItem(INITIALIZED_KEY) !== null) {
      return;
    }

    const hasExistingData = STORAGE_KEYS.some(
      (key) => localStorage.getItem(key) !== null,
    );

    if (hasExistingData) {
      localStorage.setItem(INITIALIZED_KEY, "true");
      return;
    }

    saveJSON("visora-admin-profile", demoPortfolio.profile);
    saveJSON("visora-admin-profile-version", PROFILE_VERSION);
    saveJSON("visora-admin-projects", demoPortfolio.projects);
    saveJSON("visora-admin-featured", []);
    saveJSON("visora-admin-texts", demoPortfolio.siteTexts);
    saveJSON("visora-admin-blog-posts", demoPortfolio.blogPosts);
    saveJSON("visora-admin-settings", {
      ...demoPortfolio.settings,
      version: SETTINGS_VERSION,
    });

    localStorage.setItem(INITIALIZED_KEY, "true");
  } catch (error) {
    console.error("Error al inicializar Visora:", error);
  }
}
