import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { usePortfolio } from "./usePortfolio";
import { useAdmin } from "./useAdmin";
import {
  clearAutosave,
  loadAutosave,
  type AutosaveDraft,
} from "./blogAutosave";

import type { EditorResult } from "../pages/admin/edit/BlogPostEditor";

export function useBlogList() {
  const { blogPosts } = usePortfolio();
  const navigate = useNavigate();
  const admin = useAdmin();

  const [editorOpen, setEditorOpen] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState<AutosaveDraft | null>(
    null,
  );
  const [pendingDraft, setPendingDraft] = useState<AutosaveDraft | null>(() =>
    admin ? loadAutosave() : null,
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const openNew = () => {
    setRestoredDraft(null);
    setEditorOpen(true);
  };

  const openEdit = (postSlug: string) => {
    navigate(`/blog/${postSlug}`, { state: { editSlug: postSlug } });
  };

  const openRecover = () => {
    const draft = admin ? loadAutosave() : null;

    if (!draft) return;

    setRestoredDraft(draft);
    setEditorOpen(true);
  };

  const discardDraft = () => {
    clearAutosave();
    setPendingDraft(null);
  };

  const closeEditor = (result?: EditorResult) => {
    setEditorOpen(false);
    setRestoredDraft(null);

    setPendingDraft(admin ? loadAutosave() : null);

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
    // Un visitante nunca ve el aviso de autoguardado, aunque quede uno guardado.
    pendingDraft: admin ? pendingDraft : null,
    toast,
    visiblePosts,
    openNew,
    openEdit,
    openRecover,
    discardDraft,
    closeEditor,
  };
}
