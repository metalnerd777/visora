import { lazy, Suspense } from "react";

import { Link } from "react-router-dom";

import { useBlogList } from "../../../lib/useBlogList";
import { resizeUrl } from "../../../lib/image";

const BlogPostEditor = lazy(() =>
  import("../../../pages/admin/edit/BlogPostEditor").then((m) => ({
    default: m.BlogPostEditor,
  })),
);

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const issue = "Nº 03";

function EditorialBlog() {
  const {
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
  } = useBlogList();

  return (
    <main>
      {/* Encabezado */}
      <header className="border-b border-[#1C1C1F]/15 px-6 py-14 md:px-10 md:py-20 dark:border-[#E9E6DF]/15">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
              {issue} · Blog
            </p>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-[#F3EFE6] sm:text-5xl md:text-6xl">
              Historias y proceso
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/60 dark:text-[#F3EFE6]/60">
              Experiencias, sesiones y detrás de cámara de mi trabajo.
            </p>
          </div>

          {admin && !editorOpen && (
            <button
              type="button"
              onClick={openNew}
              className="shrink-0 border border-green-500/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-green-600 transition-colors hover:bg-green-500/10 dark:text-green-400"
            >
              + Nueva publicación
            </button>
          )}
        </div>
      </header>

      <div className="px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Aviso de autoguardado */}
          {admin && !editorOpen && pendingDraft && (
            <div
              role="alert"
              className="mb-10 flex flex-col gap-4 border border-amber-500/40 bg-amber-100/30 p-5 dark:bg-amber-400/10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-black dark:text-[#F3EFE6]">
                  Borrador sin guardar encontrado
                </p>
                <p className="mt-1 text-xs text-black/60 dark:text-[#F3EFE6]/60">
                  Puedes recuperar tu borrador o descartarlo.
                </p>
              </div>

              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={discardDraft}
                  className="border border-black/30 px-4 py-2 text-xs uppercase tracking-[0.15em] text-black/70 transition-colors hover:border-black dark:border-[#F3EFE6]/30 dark:text-[#F3EFE6]/70"
                >
                  Descartar
                </button>

                <button
                  type="button"
                  onClick={openRecover}
                  className="bg-amber-500 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white transition-colors hover:bg-amber-600"
                >
                  Recuperar
                </button>
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div
              role="status"
              className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-black/20 bg-white px-6 py-3 text-sm text-black shadow-2xl dark:border-[#F3EFE6]/20 dark:bg-[#0B0A14] dark:text-[#F3EFE6]"
            >
              {toast}
            </div>
          )}

          {/* Editor inline */}
          {admin && editorOpen && (
            <Suspense
              fallback={
                <div className="mb-16 h-64 animate-pulse border border-[#1C1C1F]/10 bg-neutral-100 dark:bg-white/5" />
              }
            >
              <BlogPostEditor
                initial={editing}
                restoredDraft={restoredDraft}
                onClose={closeEditor}
              />
            </Suspense>
          )}

          {/* Índice de publicaciones */}
          {visiblePosts.length > 0 ? (
            <div className="divide-y divide-[#1C1C1F]/15 border-t-2 border-double border-[#1C1C1F]/20 dark:divide-[#E9E6DF]/15 dark:border-[#E9E6DF]/20">
              {visiblePosts.map((post) => (
                <EditorialBlogRow
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  cover={post.cover}
                  isDraft={post.status === "draft"}
                  admin={admin}
                  onEdit={() => openEdit(post)}
                />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-black/50 dark:text-[#F3EFE6]/50">
              {admin
                ? "Aún no tienes publicaciones."
                : "Todavía no hay publicaciones."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function EditorialBlogRow({
  slug,
  title,
  excerpt,
  date,
  cover,
  isDraft,
  admin,
  onEdit,
}: {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  cover?: string;
  isDraft: boolean;
  admin: boolean;
  onEdit: () => void;
}) {
  return (
    <article className="group relative grid grid-cols-12 items-center gap-4 py-10">
      <Link
        to={`/blog/${slug}`}
        className="absolute inset-0 z-10"
        aria-label={title}
      />

      <div className="col-span-12 md:col-span-3">
        <p className="text-xs uppercase tracking-[0.2em] text-black/45 dark:text-[#F3EFE6]/45">
          {formatDate(date)}
        </p>

        {isDraft && (
          <span className="mt-2 inline-block bg-amber-500/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white">
            Borrador
          </span>
        )}
      </div>

      <div className="col-span-12 md:col-span-6">
        <h2 className="text-2xl font-semibold uppercase leading-tight tracking-tight text-black transition-colors group-hover:text-black/60 dark:text-[#F3EFE6] md:text-3xl dark:group-hover:text-[#F3EFE6]/60">
          {title}
        </h2>

        {excerpt && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/60 dark:text-[#F3EFE6]/60">
            {excerpt}
          </p>
        )}
      </div>

      <div className="col-span-12 hidden gap-4 md:col-span-3 md:flex md:items-center md:justify-end">
        {cover && (
          <img
            src={resizeUrl(cover, 800)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-20 w-28 object-cover"
          />
        )}

        <span className="text-black/40 dark:text-[#F3EFE6]/40">→</span>
      </div>

      {admin && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute right-3 top-3 z-20 border border-(--visora-accent)/40 bg-white/80 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-(--visora-accent) backdrop-blur-sm transition-colors hover:bg-(--visora-accent)/10"
        >
          ✎ Editar
        </button>
      )}
    </article>
  );
}

export default EditorialBlog;