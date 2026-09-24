import PostBody from "../../../components/PostBody";

import { useAdmin } from "../../../lib/useAdmin";
import { resizeUrl } from "../../../lib/image";

import type { BlogPostPageProps } from "../../types";

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EditorialBlogPost({
  post,
  onBack,
  onEdit,
  onDelete,
}: BlogPostPageProps) {
  const admin = useAdmin();

  const handleDelete = () => {
    if (
      !confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.")
    ) {
      return;
    }

    onDelete(post.slug);
  };

  return (
    <main>
      {/* Cabecera */}
      <header className="border-b border-[#1C1C1F]/15 px-6 py-14 md:px-10 md:py-20 dark:border-[#E9E6DF]/15">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/50 transition-colors hover:text-black dark:text-[#F3EFE6]/50 dark:hover:text-[#F3EFE6]"
            >
              <span>←</span>
              Volver al blog
            </button>

            {admin && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(post.slug)}
                  className="border border-(--visora-accent)/40 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-(--visora-accent) transition-colors hover:bg-(--visora-accent)/10"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="border border-red-400/40 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-red-500 transition-colors hover:bg-red-500/10"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-black/45 dark:text-[#F3EFE6]/45">
            {formatDate(post.date)}
          </p>

          <h1 className="mt-5 text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-[#F3EFE6] sm:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-xl leading-relaxed text-black/65 dark:text-[#F3EFE6]/65">
              {post.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* Portada */}
      {post.cover && (
        <div className="px-6 md:px-10">
          <img
            src={resizeUrl(post.cover, 2000)}
            alt={post.title}
            fetchPriority="high"
            style={{
              objectPosition: `${post.coverFocusX ?? 50}% ${post.coverFocusY ?? 50}%`,
            }}
            className="mx-auto w-full max-w-6xl object-cover"
          />
        </div>
      )}

      {/* Artículo */}
      <article className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-2xl [&_p]:text-black/75 [&_p]:dark:text-[#F3EFE6]/75">
          <PostBody blocks={post.blocks} />
        </div>
      </article>
    </main>
  );
}

export default EditorialBlogPost;