import type { ComponentType } from "react";

import type { BlogPost, Project, ThemeId } from "../types/portfolio";

export interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export interface ProjectPageProps {
  project: Project;
  onBack: () => void;
}

export interface BlogPostPageProps {
  post: BlogPost;
  onBack: () => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}

export interface NotFoundProps {
  title?: string;
}

export interface ThemePages {
  Home: ComponentType;
  ProjectPage: ComponentType<ProjectPageProps>;
  AboutPage: ComponentType;
  BlogPage: ComponentType;
  BlogPostPage: ComponentType<BlogPostPageProps>;
  ContactPage: ComponentType;
  NotFound: ComponentType<NotFoundProps>;
}

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  description: string;
  swatch: string[];
  minimal: boolean;
  Header: ComponentType<HeaderProps>;
  Footer: ComponentType;
  pages: ThemePages;
}

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  swatch: string[];
  minimal: boolean;
}