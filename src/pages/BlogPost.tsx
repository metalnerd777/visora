import PostBody from "../components/PostBody";

import { useAdmin } from "../lib/useAdmin";
import { resizeUrl } from "../lib/image";

import type { BlogPost } from "../types/portfolio";

interface BlogPostPageProps {
  post: BlogPost;
  onBack: () => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BlogPostPage({ post, onBack, onEdit, onDelete }: BlogPostPageProps) {
  const admin = useAdmin();

  const handleDelete = () => {
    if (!confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")) {
      return;
    }

    onDelete(post.slug);
  };

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-3xl">
        {/* Volver + acciones admin */}
        <div className="mb-10 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:text-(--visora-accent)"
          >
            ← Volver al blog
          </button>

          {admin && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(post.slug)}
                className="inline-flex items-center gap-1.5 rounded-full border border-(--visora-accent)/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-(--visora-accent) shadow-lg backdrop-blur-md transition-colors hover:border-(--visora-accent) hover:bg-(--visora-accent)/10 dark:bg-[#161327]/80"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-red-500 shadow-lg backdrop-blur-md transition-colors hover:border-red-400 hover:bg-red-50 dark:bg-[#161327]/80 dark:text-red-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Encabezado */}
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            {formatDate(post.date)}
          </p>

          <h1 className="mt-4 text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
            {post.excerpt}
          </p>
        </header>

        {/* Portada */}
        {post.cover && (
          <img
            src={resizeUrl(post.cover, 1800)}
            alt={post.title}
            fetchPriority="high"
            style={{
              objectPosition: `${post.coverFocusX ?? 50}% ${post.coverFocusY ?? 50}%`,
            }}
            className="mb-12 h-auto w-full rounded-3xl object-cover"
          />
        )}

        {/* Contenido por bloques */}
        <article>
          <PostBody blocks={post.blocks} />
        </article>
      </div>
    </main>
  );
}

export default BlogPostPage;
