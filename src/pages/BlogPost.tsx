import { useEffect, useState } from "react";

import EmbedBlock from "../components/EmbedBlock";

import { isAuthenticated } from "../lib/auth";

import type { BlogPost, BlogBlock } from "../types/portfolio";

interface BlogPostPageProps {
  post: BlogPost;
  onBack: () => void;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Block({ block }: { block: BlogBlock }) {
  if (block.type === "text" && block.text) {
    return (
      <p className="my-6 text-base leading-relaxed text-neutral-600 dark:text-[#C9C4D8] md:text-lg md:leading-relaxed">
        {block.text}
      </p>
    );
  }

  if (block.type === "image" && block.url) {
    return (
      <figure className="my-10">
        <img
          src={`${block.url}?auto=format&w=1600&q=85`}
          alt={block.alt ?? ""}
          loading="lazy"
          decoding="async"
          className="w-full rounded-2xl"
        />

        {block.caption && (
          <figcaption className="mt-3 text-center text-sm text-neutral-500 dark:text-[#A8A3B8]">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "embed") {
    return <EmbedBlock block={block} />;
  }

  return null;
}

function BlogPostPage({ post, onBack }: BlogPostPageProps) {
  const [admin, setAdmin] = useState(isAuthenticated());

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-3xl">
        {/* Volver + acciones admin */}
        <div className="mb-10 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:text-[#7C6CFF]"
          >
            ← Volver al blog
          </button>

          {admin && (
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#7C6CFF]/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-[#7C6CFF] shadow-lg backdrop-blur-md transition-colors hover:border-[#7C6CFF] hover:bg-[#7C6CFF]/10 dark:bg-[#161327]/80"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar
              </button>

              <button
                type="button"
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
        <img
          src={`${post.cover}?auto=format&w=1800&q=85`}
          alt={post.title}
          fetchPriority="high"
          className="mb-12 w-full rounded-3xl"
        />

        {/* Contenido por bloques */}
        <article>
          {post.blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </article>
      </div>
    </main>
  );
}

export default BlogPostPage;
