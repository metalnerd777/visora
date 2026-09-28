import type { ComponentType } from "react";

import type { BlogPost, BlogPostDesignId } from "../types/portfolio";

export interface BlogPostDesignProps {
  post: BlogPost;
  onBack: () => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
  preview?: boolean;
}

export interface BlogDesignDefinition {
  id: BlogPostDesignId;
  label: string;
  description: string;
  swatch: string[];
  Page: ComponentType<BlogPostDesignProps>;
}