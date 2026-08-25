import { useNavigate } from "react-router-dom";

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

function BlogCard({ post }: BlogCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="group text-left"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
        <img
          src={`${post.cover}?auto=format&w=1400&q=85`}
          alt={post.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* Fecha en pill de cristal */}
        <p className="absolute left-4 top-4 rounded-full bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/90 backdrop-blur-md">
          {formatDate(post.date)}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-light tracking-tight text-neutral-900 transition-colors group-hover:text-[#7C6CFF] dark:text-[#F5F3FF] md:text-2xl">
          {post.title}
        </h3>

        <p className="mt-3 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
          {post.excerpt}
        </p>
      </div>
    </button>
  );
}

export default BlogCard;
