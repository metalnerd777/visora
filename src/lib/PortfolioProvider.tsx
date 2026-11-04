import { useState, useCallback } from "react";
import { initializePortfolio } from "./initializePortfolio";
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

function loadProfile(): PortfolioProfile {
  const stored = loadJSON<PortfolioProfile | null>(
    "visora-admin-profile",
    null,
  );

  if (!stored) return defaultProfile;

  const storedVersion = loadJSON<number>(PROFILE_VERSION_KEY, 1);

  const merged: PortfolioProfile = {
    ...defaultProfile,
    ...stored,
    socialLinks: stored.socialLinks ?? defaultProfile.socialLinks,
  };

  if (storedVersion >= PROFILE_VERSION) return merged;

  const refreshed: PortfolioProfile = {
    ...merged,
    name: defaultProfile.name,
    profession: defaultProfile.profession,
    description: defaultProfile.description,
    aboutTitle: defaultProfile.aboutTitle,
    aboutDescription: defaultProfile.aboutDescription,
    contactTitle: defaultProfile.contactTitle,
    contactDescription: defaultProfile.contactDescription,
    heroPrimaryButton: defaultProfile.heroPrimaryButton,
    heroSecondaryButton: defaultProfile.heroSecondaryButton,
    socialLinks: defaultProfile.socialLinks,
  };

  saveJSON("visora-admin-profile", refreshed);
  saveJSON(PROFILE_VERSION_KEY, PROFILE_VERSION);

  return refreshed;
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

function normalizeProjects(raw: unknown[]): Project[] {
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
      const fallback = defaultProjects.find((dp) => dp.slug === slug);

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

function readState() {
  initializePortfolio();
  const profile = loadProfile();

  const rawProjects = loadJSON<unknown[]>(
    "visora-admin-projects",
    defaultProjects,
  );

  const projects = normalizeProjects(rawProjects);

  const featuredPhotos = loadFeatured(projects, defaultFeatured);

  const siteTexts = loadJSON<SiteTexts>("visora-admin-texts", defaultTexts);

  const blogPosts = loadJSON<BlogPost[]>(
    "visora-admin-blog-posts",
    defaultBlogPosts,
  );

  const storedSettings = loadJSON<Partial<SiteSettings>>(SETTINGS_KEY, {});

  let settings = mergeSettings(defaultSettings, storedSettings);

  if ((storedSettings.version ?? 1) < SETTINGS_VERSION) {
    settings = {
      ...settings,
      version: SETTINGS_VERSION,
      site: { ...settings.site, published: true },
    };
    saveJSON(SETTINGS_KEY, settings);
  }

  return { profile, projects, featuredPhotos, siteTexts, blogPosts, settings };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(readState);

  const refresh = useCallback(() => setState(readState()), []);

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
      value={{ ...state, refresh, setBlogPosts, setSettings }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
