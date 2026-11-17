import { useNavigate } from "react-router-dom";

import { resizeUrl } from "../lib/image";

import type { BlogPost } from "../types/portfolio";

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getReadingTime(blocks?: BlogPost["blocks"]): number {
  if (!blocks || blocks.length === 0) return 2;
  let wordCount = 0;
  for (const block of blocks) {
    if (block.type === "text" && block.text) {
      wordCount += block.text.trim().split(/\s+/).length;
    }
  }
  return Math.max(2, Math.ceil(wordCount / 180));
}

function BlogCard({ post }: BlogCardProps) {
  const navigate = useNavigate();
  const readingMinutes = getReadingTime(post.blocks);

  return (
    <button
      type="button"
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="group relative block w-full text-left cursor-pointer"
    >
      <div className="zoom-frame aspect-[16/10] rounded-3xl">
        {post.cover ? (
          <>
            <img
              src={resizeUrl(post.cover, 1400)}
              alt={post.title}
              loading="lazy"
              decoding="async"
              style={{
                objectPosition: `${post.coverFocusX ?? 50}% ${post.coverFocusY ?? 50}%`,
              }}
              className="zoom-image"
            />

            <div className="pointer-events-none absolute inset-0 bg-neutral-950/0 transition-colors duration-500 group-hover:bg-neutral-950/15" />

            {/* Fecha y tiempo de lectura */}
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
              <p className="rounded-full bg-neutral-950/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
                {formatDate(post.date)}
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-(--visora-accent)/10 p-8 text-center transition-colors group-hover:bg-(--visora-accent)/15">
            <h3 className="text-2xl font-light tracking-tight text-neutral-900 dark:text-white md:text-3xl">
              {post.title}
            </h3>
          </div>
        )}
      </div>

      <div className="mt-5 px-1">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-(--visora-accent)">
          <span>Ensayo</span>
          <span>·</span>
          <span>{readingMinutes} min de lectura</span>
        </div>

        <h3 className="mt-1.5 text-2xl font-light tracking-tight text-neutral-900 transition-colors duration-300 group-hover:text-(--visora-accent) dark:text-white md:text-2xl">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 leading-relaxed text-neutral-600 dark:text-neutral-400 text-sm">
            {post.excerpt}
          </p>
        )}
      </div>
    </button>
  );
}

export default BlogCard;
