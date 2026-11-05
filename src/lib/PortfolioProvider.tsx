import { useState, useCallback } from "react";
import {
  exitDemoMode,
  getStoredInitMode,
  hasBeenInitialized,
  initializePortfolio,
} from "./initializePortfolio";
import type { InitMode } from "./initializePortfolio";
import PortfolioContext from "./PortfolioContext";

import {
  profile as defaultProfile,
  projects as defaultProjects,
  featuredPhotos as defaultFeatured,
  siteTexts as defaultTexts,
  blogPosts as defaultBlogPosts,
  PROFILE_VERSION,
} from "../data/portfolio";
import { defaultSettings, SETTINGS_VERSION } from "../data/settings";
import { emptyPortfolio } from "../data/emptyPortfolio";

import { loadJSON, saveJSON } from "../lib/storage";

import type {
  PortfolioProfile,
  Project,
  Photo,
  SiteTexts,
  BlogPost,
  SiteSettings,
} from "../types/portfolio";

const SETTINGS_KEY = "visora-admin-settings";
const PROFILE_VERSION_KEY = "visora-admin-profile-version";

interface PortfolioState {
  profile: PortfolioProfile;
  projects: Project[];
  featuredPhotos: Photo[];
  siteTexts: SiteTexts;
  blogPosts: BlogPost[];
  settings: SiteSettings;
  initialized: boolean;
  initMode: InitMode | null;
}

function loadProfile(fallback: PortfolioProfile): PortfolioProfile {
  const stored = loadJSON<PortfolioProfile | null>(
    "visora-admin-profile",
    null,
  );

  if (!stored) return fallback;

  const storedVersion = loadJSON<number>(PROFILE_VERSION_KEY, 1);

  const merged: PortfolioProfile = {
    ...fallback,
    ...stored,
    socialLinks: stored.socialLinks ?? fallback.socialLinks,
  };

  // Migración no destructiva: completa campos ausentes y actualiza la versión,
  // pero conserva el contenido que el usuario ya haya escrito.
  if (storedVersion < PROFILE_VERSION) {
    saveJSON("visora-admin-profile", merged);
    saveJSON(PROFILE_VERSION_KEY, PROFILE_VERSION);
  }

  return merged;
}

function loadFeatured(projects: Project[], allFeatured: Photo[]): Photo[] {
  const slugs = loadJSON<string[]>("visora-admin-featured", []);

  if (slugs.length === 0) return allFeatured;

  const result: Photo[] = [];

  for (const slug of slugs) {
    const project = projects.find((p) => p.slug === slug);

    if (project) {
      result.push(...(project.photos ?? []).slice(0, 2));
    }
  }

  return result.length > 0 ? result : allFeatured;
}

function normalizeProjects(
  raw: unknown[],
  fallbackProjects: Project[],
): Project[] {
  return raw.map((item) => {
    const p = item as Record<string, unknown>;

    const slug = (p.slug as string) ?? "";

    const images = (p.images ?? p.photos ?? []) as Array<{
      id?: string;
      url?: string;
      alt?: string;
      title?: string;
    }>;

    let photos = images.map((img) => ({
      id: img.id ?? `photo-${Date.now()}-${Math.random()}`,
      url: img.url ?? "",
      title: img.title ?? img.alt ?? "",
    }));

    if (photos.length === 0) {
      const fallback = fallbackProjects.find((dp) => dp.slug === slug);

      if (fallback) {
        photos = fallback.photos;
      }
    }

    return {
      id: (p.id as string) ?? `proj-${slug}`,
      slug,
      title: (p.title as string) ?? "",
      description: (p.description as string) ?? "",
      cover: (p.cover as string) ?? "",
      photos,
    };
  });
}

function mergeSettings(
  defaults: SiteSettings,
  stored: Partial<SiteSettings> | null,
): SiteSettings {
  return {
    version: stored?.version ?? defaults.version,
    general: { ...defaults.general, ...(stored?.general ?? {}) },
    seo: { ...defaults.seo, ...(stored?.seo ?? {}) },
    appearance: {
      ...defaults.appearance,
      ...(stored?.appearance ?? {}),
      background: {
        ...defaults.appearance.background,
        ...(stored?.appearance?.background ?? {}),
      },
    },
    socials: stored?.socials ?? defaults.socials,
    privacy: { ...defaults.privacy, ...(stored?.privacy ?? {}) },
    site: { ...defaults.site, ...(stored?.site ?? {}) },
  };
}

function readState(): PortfolioState {
  // Primera visita: todavía no hay elección ni datos. Se devuelve un estado
  // neutro en memoria para poder mostrar la bienvenida sin escribir nada.
  if (!hasBeenInitialized()) {
    return {
      profile: emptyPortfolio.profile,
      projects: [],
      featuredPhotos: [],
      siteTexts: emptyPortfolio.siteTexts,
      blogPosts: [],
      settings: emptyPortfolio.settings,
      initialized: false,
      initMode: null,
    };
  }

  const initMode = getStoredInitMode();

  // En modo vacío no se usan los datos de la demo como fallback si alguna
  // clave llegara a faltar. En instalaciones antiguas se mantiene el
  // comportamiento previo (fallback a la demo).
  const useDemoFallback = initMode !== "empty";

  const profile = loadProfile(
    useDemoFallback ? defaultProfile : emptyPortfolio.profile,
  );

  const fallbackProjects = useDemoFallback ? defaultProjects : [];

  const rawProjects = loadJSON<unknown[]>(
    "visora-admin-projects",
    fallbackProjects,
  );

  const projects = normalizeProjects(rawProjects, fallbackProjects);

  const featuredPhotos = loadFeatured(
    projects,
    useDemoFallback ? defaultFeatured : [],
  );

  const siteTexts = loadJSON<SiteTexts>(
    "visora-admin-texts",
    useDemoFallback ? defaultTexts : emptyPortfolio.siteTexts,
  );

  const blogPosts = loadJSON<BlogPost[]>(
    "visora-admin-blog-posts",
    useDemoFallback ? defaultBlogPosts : [],
  );

  const storedSettings = loadJSON<Partial<SiteSettings>>(SETTINGS_KEY, {});

  let settings = mergeSettings(
    useDemoFallback ? defaultSettings : emptyPortfolio.settings,
    storedSettings,
  );

  // Migración no destructiva: solo actualiza la versión; no fuerza la
  // publicación ni reemplaza preferencias existentes.
  if ((storedSettings.version ?? 1) < SETTINGS_VERSION) {
    settings = {
      ...settings,
      version: SETTINGS_VERSION,
    };
    saveJSON(SETTINGS_KEY, settings);
  }

  return {
    profile,
    projects,
    featuredPhotos,
    siteTexts,
    blogPosts,
    settings,
    initialized: true,
    initMode,
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(readState);

  const refresh = useCallback(() => setState(readState()), []);

  const initialize = useCallback((mode: InitMode) => {
    initializePortfolio(mode);
    setState(readState());
  }, []);

  const exitDemo = useCallback(() => {
    if (!exitDemoMode()) return false;

    setState(readState());
    return true;
  }, []);

  const setBlogPosts = useCallback((posts: BlogPost[]) => {
    saveJSON("visora-admin-blog-posts", posts);
    setState((prev) => ({ ...prev, blogPosts: posts }));
  }, []);

  const setSettings = useCallback((settings: SiteSettings) => {
    saveJSON(SETTINGS_KEY, settings);
    setState((prev) => ({ ...prev, settings }));
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        ...state,
        refresh,
        setBlogPosts,
        setSettings,
        initialize,
        exitDemo,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
