import PostBody from "../../components/PostBody";
import { resizeUrl } from "../../lib/image";
import BlogPostBar from "../BlogPostBar";

import type { BlogPostDesignProps } from "../types";

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function MagazineBlogPost({
  post,
  onBack,
  onEdit,
  onDelete,
  preview,
}: BlogPostDesignProps) {
  return (
    <main className="pb-20 transition-colors md:pb-24">
      {/* Cabecera de revista */}
      <header className="border-b-2 border-double border-black/15 px-6 py-12 dark:border-white/15 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          {!preview && (
            <div className="mb-10">
              <BlogPostBar
                post={post}
                onBack={onBack}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          )}

          <div className="flex items-start justify-between gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-white/50">
                {formatDate(post.date)} · Artículo
              </p>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-white sm:text-5xl md:text-6xl font-[family-name:var(--visora-font-display)]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-black/65 dark:text-white/65">
                  {post.excerpt}
                </p>
              )}
            </div>

            <span className="hidden shrink-0 items-center gap-3 pb-1 md:flex">
              <span className="h-px w-10 bg-black/30 dark:bg-white/30" />
              <span className="text-sm font-semibold text-black/40 dark:text-white/40">
                Nº
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Portada */}
      {post.cover && (
        <div className="px-6 pt-12 md:px-10">
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
        <div className="mx-auto max-w-2xl [&_p]:text-black/75 [&_p]:dark:text-white/75">
          <PostBody blocks={post.blocks} />
        </div>
      </article>
    </main>
  );
}

export default MagazineBlogPost;