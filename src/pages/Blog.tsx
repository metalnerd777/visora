import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import BlogCard from "../components/BlogCard";

import { isAuthenticated } from "../lib/auth";
import { usePortfolio } from "../lib/usePortfolio";
import { clearAutosave, loadAutosave, type AutosaveDraft } from "../lib/blogAutosave";

import type { BlogPost } from "../types/portfolio";
import type { EditorResult } from "./admin/edit/BlogPostEditor";

const BlogPostEditor = lazy(() =>
  import("./admin/edit/BlogPostEditor").then((m) => ({ default: m.BlogPostEditor })),
);

function BlogPage() {
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

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <header className="mb-16 flex items-end justify-between max-w-3xl">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
              Blog
            </p>

            <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-6xl">
              Historias y proceso
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              Experiencias, sesiones y detrás de cámara de mi trabajo.
            </p>
          </div>

          {admin && !editorOpen && (
            <button
              type="button"
              onClick={openNew}
              className="mb-2 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-500/30 bg-white/80 px-4 py-2 text-xs font-medium text-green-600 shadow-lg backdrop-blur-md transition-colors hover:border-green-500 hover:bg-green-50 dark:bg-[#161327]/80 dark:text-green-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nueva publicación
            </button>
          )}
        </header>

        {/* Aviso de autoguardado pendiente */}
        {admin && !editorOpen && pendingDraft && (
          <div
            role="alert"
            className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-300/50 bg-amber-50/70 p-5 backdrop-blur-sm dark:border-amber-400/20 dark:bg-amber-400/10 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>

              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-[#F5F3FF]">
                  Se encontró una versión no guardada de esta publicación
                </p>
                <p className="text-xs text-neutral-500 dark:text-[#A8A3B8]">
                  Puedes recuperar tu borrador o descartarlo.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={discardDraft}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-[#27243A] dark:text-[#A8A3B8]"
              >
                Descartar
              </button>

              <button
                type="button"
                onClick={openRecover}
                className="rounded-full bg-amber-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-600"
              >
                Recuperar
              </button>
            </div>
          </div>
        )}

        {/* Toast de confirmación */}
        {toast && (
          <div
            role="status"
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[var(--visora-btn-radius)] bg-neutral-900/90 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur-md dark:bg-[#F5F3FF]/90 dark:text-black"
          >
            {toast}
          </div>
        )}

        {/* Editor inline */}
        {admin && editorOpen && (
          <Suspense
            fallback={
              <div className="mb-16 h-64 animate-pulse rounded-3xl bg-neutral-100 dark:bg-white/5" />
            }
          >
            <BlogPostEditor
              initial={editing}
              restoredDraft={restoredDraft}
              onClose={closeEditor}
            />
          </Suspense>
        )}

        {/* Publicaciones */}
        <section aria-label="Publicaciones">
          {visiblePosts.length > 0 ? (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <div key={post.slug} className="relative">
                  {admin && (
                    <button
                      type="button"
                      onClick={() => openEdit(post)}
                      aria-label={`Editar ${post.title}`}
                      className="absolute -top-2 right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-(--visora-accent)/30 bg-white/80 text-(--visora-accent) shadow-lg backdrop-blur-md transition-colors hover:border-(--visora-accent) hover:bg-(--visora-accent)/10 dark:bg-[#161327]/80"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}

                  {post.status === "draft" && (
                    <span className="absolute right-0 top-8 z-10 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white shadow">
                      Borrador
                    </span>
                  )}

                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-neutral-400 dark:text-[#6F6A80]">
              {admin
                ? "Aún no tienes publicaciones."
                : "Todavía no hay publicaciones."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default BlogPage;
