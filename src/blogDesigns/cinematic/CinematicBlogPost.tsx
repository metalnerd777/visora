import PostBody from "../../components/PostBody";
import { resizeUrl } from "../../lib/image";
import BlogPostBar from "../BlogPostBar";

import type { BlogPostDesignProps } from "../types";

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CinematicBlogPost({
  post,
  onBack,
  onEdit,
  onDelete,
  preview,
}: BlogPostDesignProps) {
  return (
    <main className="pb-20 transition-colors md:pb-24">
      {/* Portada full-bleed */}
      {post.cover ? (
        <div className="relative">
          <img
            src={resizeUrl(post.cover, 2400)}
            alt={post.title}
            fetchPriority="high"
            style={{
              objectPosition: `${post.coverFocusX ?? 50}% ${post.coverFocusY ?? 50}%`,
            }}
            className="h-[52vh] w-full object-cover md:h-[72vh]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-10 md:pb-14">
            <div className="mx-auto max-w-4xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                {formatDate(post.date)}
              </p>

              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 pt-10 md:px-10 md:pt-14">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-[#6F6A80]">
              {formatDate(post.date)}
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-900 dark:text-[#F5F3FF] sm:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Barra de acciones */}
      {!preview && (
        <div className="px-6 py-8 md:px-10">
          <div className="mx-auto max-w-4xl">
            <BlogPostBar
              post={post}
              onBack={onBack}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      )}

      {/* Artículo */}
      <article className="px-6 md:px-10">
        <div className="mx-auto max-w-4xl">
          <PostBody blocks={post.blocks} />
        </div>
      </article>
    </main>
  );
}

export default CinematicBlogPost;