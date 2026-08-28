import { useState, useCallback } from "react";

import PortfolioContext from "./PortfolioContext";

import {
  profile as defaultProfile,
  projects as defaultProjects,
  featuredPhotos as defaultFeatured,
  siteTexts as defaultTexts,
  blogPosts as defaultBlogPosts,
} from "../data/portfolio";

import { loadJSON, saveJSON } from "../lib/storage";

import type {
  PortfolioProfile,
  Project,
  Photo,
  SiteTexts,
  BlogPost,
} from "../types/portfolio";

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

function readState() {
  const profile = loadJSON<PortfolioProfile>(
    "visora-admin-profile",
    defaultProfile,
  );

  const rawProjects = loadJSON<unknown[]>("visora-admin-projects", defaultProjects);

  const projects = normalizeProjects(rawProjects);

  const featuredPhotos = loadFeatured(projects, defaultFeatured);

  const siteTexts = loadJSON<SiteTexts>("visora-admin-texts", defaultTexts);

  const blogPosts = loadJSON<BlogPost[]>("visora-admin-blog-posts", defaultBlogPosts);

  return { profile, projects, featuredPhotos, siteTexts, blogPosts };
}

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(readState);

  const refresh = useCallback(() => setState(readState()), []);

  const setBlogPosts = useCallback((posts: BlogPost[]) => {
    saveJSON("visora-admin-blog-posts", posts);
    setState((prev) => ({ ...prev, blogPosts: posts }));
  }, []);

  return (
    <PortfolioContext.Provider
      value={{ ...state, refresh, setBlogPosts }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
