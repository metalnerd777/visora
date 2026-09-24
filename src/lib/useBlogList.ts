import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { usePortfolio } from "./usePortfolio";
import { isAuthenticated } from "./auth";
import {
  clearAutosave,
  loadAutosave,
  type AutosaveDraft,
} from "./blogAutosave";

import type { BlogPost } from "../types/portfolio";
import type { EditorResult } from "../pages/admin/edit/BlogPostEditor";

export function useBlogList() {
  const { blogPosts } = usePortfolio();
  const location = useLocation();

  const [admin, setAdmin] = useState(isAuthenticated());

  const [initialPost] = useState<BlogPost | null>(() => {
    const editSlug = (location.state as { editSlug?: string } | null)?.editSlug;

    if (editSlug && isAuthenticated()) {
      return blogPosts.find((p) => p.slug === editSlug) ?? null;
    }

    return null;
  });

  const [editorOpen, setEditorOpen] = useState(Boolean(initialPost));
  const [editing, setEditing] = useState<BlogPost | null>(initialPost);
  const [restoredDraft, setRestoredDraft] = useState<AutosaveDraft | null>(
    null,
  );
  const [pendingDraft, setPendingDraft] = useState<AutosaveDraft | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const isAdmin = isAuthenticated();
      setAdmin(isAdmin);
      setPendingDraft(isAdmin ? loadAutosave() : null);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const openNew = () => {
    setEditing(null);
    setRestoredDraft(null);
    setEditorOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setRestoredDraft(null);
    setEditorOpen(true);
  };

  const openRecover = () => {
    if (!pendingDraft) return;

    setEditing(null);
    setRestoredDraft(pendingDraft);
    setEditorOpen(true);
  };

  const discardDraft = () => {
    clearAutosave();
    setPendingDraft(null);
  };

  const closeEditor = (result?: EditorResult) => {
    setEditorOpen(false);
    setEditing(null);
    setRestoredDraft(null);

    setPendingDraft(isAuthenticated() ? loadAutosave() : null);

    if (result === "saved-draft") {
      setToast("Borrador guardado.");
    } else if (result === "published") {
      setToast("Publicación publicada.");
    }
  };

  const visiblePosts = [...blogPosts]
    .filter((p) => admin || p.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    admin,
    editorOpen,
    editing,
    restoredDraft,
    pendingDraft,
    toast,
    visiblePosts,
    openNew,
    openEdit,
    openRecover,
    discardDraft,
    closeEditor,
  };
}