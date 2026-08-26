import { useEffect, useState } from "react";

import BlogCard from "../components/BlogCard";

import { blogPosts } from "../data/portfolio";
import { isAuthenticated } from "../lib/auth";

function BlogPage() {
  const sortedPosts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const [admin, setAdmin] = useState(isAuthenticated());

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

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

          {admin && (
            <button
              type="button"
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

        {/* Publicaciones */}
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default BlogPage;
