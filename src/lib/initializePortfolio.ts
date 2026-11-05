import { demoPortfolio } from "../data/demo";
import { emptyPortfolio } from "../data/emptyPortfolio";
import { PROFILE_VERSION } from "../data/portfolio";
import { SETTINGS_VERSION } from "../data/settings";
import { loadJSON, saveJSON } from "./storage";

import type { SiteSettings } from "../types/portfolio";

export type InitMode = "demo" | "empty";

const INIT_MODE_KEY = "visora-init-mode";
const LEGACY_INITIALIZED_KEY = "visora-initialized";

/**
 * Preferencias visuales que sobreviven a la salida de la demo.
 * No contienen datos del portafolio: solo apariencia (tema, colores, fuente…).
 */
const APPEARANCE_PREFS_KEY = "visora-appearance-preferences";

/**
 * Claves que contienen datos del portafolio y deben borrarse al salir de la demo.
 * No incluye autenticación, cookies, tema del visitante ni preferencias visuales.
 */
export const PORTFOLIO_DATA_KEYS = [
  "visora-admin-profile",
  "visora-admin-profile-version",
  "visora-admin-hero",
  "visora-admin-about",
  "visora-admin-contact",
  "visora-admin-projects",
  "visora-admin-featured",
  "visora-admin-texts",
  "visora-admin-blog-posts",
  "visora-admin-settings",
];

/** Contenido temporal del editor de blog: también es un cambio hecho en la demo. */
const DEMO_EXTRA_KEYS = ["visora-blog-draft"];

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota exceeded, private mode, or storage disabled — ignore
  }
}

function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage disabled — ignore
  }
}

/** Guarda un valor solo si la clave no existe todavía. */
function writeIfAbsent(key: string, value: unknown): void {
  if (readStorage(key) !== null) return;

  saveJSON(key, value);
}

/** Elección explícita del usuario, o null si nunca eligió un modo. */
export function getStoredInitMode(): InitMode | null {
  const stored = readStorage(INIT_MODE_KEY);

  return stored === "demo" || stored === "empty" ? stored : null;
}

/** Indica si ya hay contenido de Visora guardado en este navegador. */
export function hasPortfolioData(): boolean {
  return PORTFOLIO_DATA_KEYS.some((key) => readStorage(key) !== null);
}

/**
 * Visora se considera inicializada si existe una elección explícita, si hay
 * datos previos (instalaciones antiguas) o si quedó el marcador histórico.
 * En esos casos nunca se vuelve a mostrar la pantalla de bienvenida.
 */
export function hasBeenInitialized(): boolean {
  return (
    getStoredInitMode() !== null ||
    readStorage(LEGACY_INITIALIZED_KEY) !== null ||
    hasPortfolioData()
  );
}

function loadAppearancePreferences(): Partial<SiteSettings["appearance"]> | null {
  return loadJSON<Partial<SiteSettings["appearance"]> | null>(
    APPEARANCE_PREFS_KEY,
    null,
  );
}

/**
 * Inicializa Visora con el modo elegido.
 * Escribe solo claves ausentes: nunca reemplaza datos existentes.
 */
export function initializePortfolio(mode: InitMode): void {
  try {
    // Nunca se inicializa por encima de datos existentes ni de una elección
    // previa: ambas cosas indican que Visora ya fue configurada.
    if (getStoredInitMode() !== null || hasPortfolioData()) return;

    const source = mode === "demo" ? demoPortfolio : emptyPortfolio;

    // Si el usuario salió de la demo, conserva su apariencia al volver a empezar.
    const preservedAppearance = loadAppearancePreferences();
    const settings = preservedAppearance
      ? {
          ...source.settings,
          appearance: {
            ...source.settings.appearance,
            ...preservedAppearance,
            background: {
              ...source.settings.appearance.background,
              ...(preservedAppearance.background ?? {}),
            },
          },
        }
      : source.settings;

    writeIfAbsent("visora-admin-profile", source.profile);
    writeIfAbsent("visora-admin-profile-version", PROFILE_VERSION);
    writeIfAbsent("visora-admin-projects", source.projects);
    writeIfAbsent("visora-admin-featured", []);
    writeIfAbsent("visora-admin-texts", source.siteTexts);
    writeIfAbsent("visora-admin-blog-posts", source.blogPosts);
    writeIfAbsent("visora-admin-settings", {
      ...settings,
      version: SETTINGS_VERSION,
    });

    writeStorage(INIT_MODE_KEY, mode);
    writeStorage(LEGACY_INITIALIZED_KEY, "true");
  } catch (error) {
    console.error("Error al inicializar Visora:", error);
  }
}

/**
 * Abandona el modo demo.
 * Solo elimina claves de datos del portafolio, la elección de modo y el
 * marcador histórico. Conserva autenticación, cookies, tema del visitante y
 * preferencias visuales.
 */
export function exitDemoMode(): boolean {
  if (getStoredInitMode() !== "demo") return false;

  try {
    const storedSettings = loadJSON<Partial<SiteSettings>>(
      "visora-admin-settings",
      {},
    );

    if (storedSettings.appearance) {
      saveJSON(APPEARANCE_PREFS_KEY, storedSettings.appearance);
    }

    for (const key of [...PORTFOLIO_DATA_KEYS, ...DEMO_EXTRA_KEYS]) {
      removeStorage(key);
    }

    removeStorage(INIT_MODE_KEY);
    removeStorage(LEGACY_INITIALIZED_KEY);

    return true;
  } catch (error) {
    console.error("Error al salir del modo demo:", error);
    return false;
  }
}
