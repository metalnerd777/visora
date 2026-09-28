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

function ClassicBlogPost({ post, onBack, onEdit, onDelete, preview }: BlogPostDesignProps) {
  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-3xl">
        {!preview && (
          <BlogPostBar
            post={post}
            onBack={onBack}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}

        <header className="mt-12 mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            {formatDate(post.date)}
          </p>

          <h1 className="mt-4 text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              {post.excerpt}
            </p>
          )}
        </header>

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

        <article>
          <PostBody blocks={post.blocks} />
        </article>
      </div>
    </main>
  );
}

export default ClassicBlogPost;