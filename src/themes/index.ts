import type { ThemeId } from "../types/portfolio";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Home from "../pages/Home";
import ProjectPage from "../pages/Project";
import AboutPage from "../pages/About";
import BlogPage from "../pages/Blog";
import BlogPostPage from "../pages/BlogPost";
import ContactPage from "../pages/Contact";
import NotFound from "../pages/NotFound";

import EditorialHeader from "./editorial/EditorialHeader";
import EditorialFooter from "./editorial/EditorialFooter";

import EditorialHome from "./editorial/pages/EditorialHome";
import EditorialProjectPage from "./editorial/pages/EditorialProject";
import EditorialAboutPage from "./editorial/pages/EditorialAbout";
import EditorialBlogPage from "./editorial/pages/EditorialBlog";
import EditorialBlogPostPage from "./editorial/pages/EditorialBlogPost";
import EditorialContactPage from "./editorial/pages/EditorialContact";
import EditorialNotFound from "./editorial/pages/EditorialNotFound";

import type { ThemeDefinition, ThemeOption } from "./types";

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "minimal",
    label: "Minimal",
    description:
      "Glass y aire: tipografía ligera, esquinas redondeadas y foco absoluto en la fotografía.",
    swatch: ["#F7F7FA", "#7C6CFF"],
    minimal: true,
  },
  {
    id: "editorial",
    label: "Editorial",
    description:
      "Revista de autor: display serif, reglas finas, numeración editorial y ritmo tipográfico marcado.",
    swatch: ["#F3EFE6", "#9A7B4F"],
    minimal: false,
  },
];

export function themeOptionFor(id: string): ThemeOption {
  return (
    THEME_OPTIONS.find((t) => t.id === id) ??
    THEME_OPTIONS[0]
  );
}

export const minimalTheme: ThemeDefinition = {
  id: "minimal",
  label: "Minimal",
  description:
    "Glass y aire: tipografía ligera, esquinas redondeadas y foco absoluto en la fotografía.",
  swatch: ["#F7F7FA", "#7C6CFF"],
  minimal: true,
  Header,
  Footer,
  pages: {
    Home,
    ProjectPage,
    AboutPage,
    BlogPage,
    BlogPostPage,
    ContactPage,
    NotFound,
  },
};

export const editorialTheme: ThemeDefinition = {
  id: "editorial",
  label: "Editorial",
  description:
    "Revista de autor: display serif, reglas finas, numeración editorial y ritmo tipográfico marcado.",
  swatch: ["#F3EFE6", "#9A7B4F"],
  minimal: false,
  Header: EditorialHeader,
  Footer: EditorialFooter,
  pages: {
    Home: EditorialHome,
    ProjectPage: EditorialProjectPage,
    AboutPage: EditorialAboutPage,
    BlogPage: EditorialBlogPage,
    BlogPostPage: EditorialBlogPostPage,
    ContactPage: EditorialContactPage,
    NotFound: EditorialNotFound,
  },
};

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  minimal: minimalTheme,
  editorial: editorialTheme,
};

export function themeFor(id: string): ThemeDefinition {
  return THEMES[id as ThemeId] ?? minimalTheme;
}