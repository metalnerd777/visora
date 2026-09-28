import { useEffect, useState } from "react";

import { usePortfolio } from "./usePortfolio";
import { isAuthenticated } from "./auth";
import {
  clearAutosave,
  loadAutosave,
  type AutosaveDraft,
} from "./blogAutosave";

import type { EditorResult } from "../pages/admin/edit/BlogPostEditor";

export function useBlogList() {
  const { blogPosts } = usePortfolio();

  const [admin, setAdmin] = useState(isAuthenticated());

  const [editorOpen, setEditorOpen] = useState(false);
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
    setRestoredDraft(null);
    setEditorOpen(true);
  };

  const openRecover = () => {
    if (!pendingDraft) return;

    setRestoredDraft(pendingDraft);
    setEditorOpen(true);
  };

  const discardDraft = () => {
    clearAutosave();
    setPendingDraft(null);
  };

  const closeEditor = (result?: EditorResult) => {
    setEditorOpen(false);
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
    restoredDraft,
    pendingDraft,
    toast,
    visiblePosts,
    openNew,
    openRecover,
    discardDraft,
    closeEditor,
  };
}