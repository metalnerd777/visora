import type { JSONContent } from "@tiptap/core";

import type { BlogColumn, BlogPostDesignId, BlogPostStatus, EmbedProvider } from "../types/portfolio";

export interface BlockDraft {
  id: string;
  type: "text" | "image" | "embed" | "separator";
  content?: JSONContent;
  url?: string;
  alt?: string;
  caption?: string;
  provider?: EmbedProvider;
  column?: BlogColumn;
}

export interface AutosaveDraft {
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  cover: string;
  coverFocusX: number;
  coverFocusY: number;
  date: string;
  status: BlogPostStatus;
  design?: BlogPostDesignId;
  blocks: BlockDraft[];
}

export const AUTOSAVE_KEY = "visora-blog-draft";

export function loadAutosave(): AutosaveDraft | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);

    if (raw) {
      return JSON.parse(raw) as AutosaveDraft;
    }
  } catch {
    // ignore
  }

  return null;
}

export function saveAutosave(draft: AutosaveDraft): void {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export function clearAutosave(): void {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch {
    // ignore
  }
}
