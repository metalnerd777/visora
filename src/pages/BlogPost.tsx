import EmbedBlock from "../components/EmbedBlock";

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
  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-3xl">
        {/* Volver */}
        <button
          type="button"
          onClick={onBack}
          className="mb-10 text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:text-[#7C6CFF]"
        >
          ← Volver al blog
        </button>

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
