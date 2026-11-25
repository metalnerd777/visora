import { useState, useCallback } from "react";
import {
  exitDemoMode,
  getStoredInitMode,
  hasBeenInitialized,
  initializePortfolio,
} from "./initializePortfolio";
import type { InitMode, InitialSetupData } from "./initializePortfolio";
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
  HeroConfig,
  ContactConfig,
  ProjectVisibility,
} from "../types/portfolio";

const SETTINGS_KEY = "visora-admin-settings";
const PROFILE_VERSION_KEY = "visora-admin-profile-version";

const DEFAULT_HERO_CONFIG: HeroConfig = {
  showSecondary: true,
  heroImageFocusX: 50,
  heroImageFocusY: 50,
  heroGradient: false,
  heroGradientId: "midnight-violet",
  fadeTop: false,
  fadeBottom: true,
  fadeLeft: false,
  fadeRight: false,
  portraitAlign: "center",
  primaryLink: "#projects",
  secondaryLink: "/contacto",
};

const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  emailSubject: "Contacto desde el portfolio",
  whatsappPhone: "",
  whatsappMessage: "Hola, me interesa tu trabajo. ¿Podemos hablar?",
  showForm: true,
  showFaqs: true,
  faqs: [
    {
      id: "faq-1",
      question: "¿Cuál es tu proceso de trabajo y plazos de entrega?",
      answer: "Tras definir el concepto y realizar la sesión, entrego una selección inicial en 48 horas para revisión. La galería final editada en alta resolución se entrega en un plazo de 7 a 14 días laborables.",
    },
    {
      id: "faq-2",
      question: "¿Realizas encargos fuera de tu ciudad o en el extranjero?",
      answer: "Sí, estoy disponible para proyectos editoriales, documentales y comerciales a nivel nacional e internacional. Los viáticos y logística se detallan de forma transparente en el presupuesto.",
    },
    {
      id: "faq-3",
      question: "¿Qué derechos de uso comercial se incluyen?",
      answer: "Todas las entregas comerciales incluyen licencia de uso para medios digitales, web y redes sociales. Para campañas impresas de gran tiraje o publicidad masiva, acordamos la cesión adecuada.",
    },
  ],
};

interface PortfolioState {
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
    const fallback = fallbackProjects.find((dp) => dp.slug === slug);

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

    if (photos.length === 0 && fallback) {
      photos = fallback.photos;
    }

    const visibilityRaw = p.visibility as string | undefined;
    const visibility: ProjectVisibility =
      visibilityRaw === "unlisted" ? "unlisted" : "public";

    return {
      id: (p.id as string) ?? `proj-${slug}`,
      slug,
      title: (p.title as string) ?? "",
      description: (p.description as string) ?? "",
      cover: (p.cover as string) ?? "",
      photos,
      category: (p.category as string | undefined) ?? fallback?.category ?? "",
      year: (p.year as string | undefined) ?? fallback?.year ?? "",
      client: (p.client as string | undefined) ?? fallback?.client ?? "",
      role: (p.role as string | undefined) ?? fallback?.role ?? "",
      externalUrl: (p.externalUrl as string | undefined) ?? fallback?.externalUrl ?? "",
      visibility,
      pin: (p.pin as string | undefined) ?? "",
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
  if (!hasBeenInitialized()) {
    return {
      profile: emptyPortfolio.profile,
      projects: [],
      featuredPhotos: [],
      siteTexts: emptyPortfolio.siteTexts,
      blogPosts: [],
      settings: emptyPortfolio.settings,
      heroConfig: DEFAULT_HERO_CONFIG,
      contactConfig: DEFAULT_CONTACT_CONFIG,
      initialized: false,
      initMode: null,
    };
  }

  const initMode = getStoredInitMode();
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

  if ((storedSettings.version ?? 1) < SETTINGS_VERSION) {
    settings = {
      ...settings,
      version: SETTINGS_VERSION,
    };
    saveJSON(SETTINGS_KEY, settings);
  }

  const storedHero = loadJSON<Partial<HeroConfig>>("visora-admin-hero", {});
  const heroConfig: HeroConfig = {
    ...DEFAULT_HERO_CONFIG,
    ...storedHero,
  };

  const storedContact = loadJSON<Partial<ContactConfig>>("visora-admin-contact", {});
  const contactConfig: ContactConfig = {
    ...DEFAULT_CONTACT_CONFIG,
    ...storedContact,
  };

  return {
    profile,
    projects,
    featuredPhotos,
    siteTexts,
    blogPosts,
    settings,
    heroConfig,
    contactConfig,
    initialized: true,
    initMode,
  };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(readState);

  const refresh = useCallback(() => setState(readState()), []);

  const initialize = useCallback(
    (mode: InitMode, setupData?: InitialSetupData) => {
      initializePortfolio(mode, setupData);
      setState(readState());
    },
    [],
  );

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
