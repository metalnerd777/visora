import { PostBodyBlock } from "../../components/PostBody";
import { resizeUrl } from "../../lib/image";
import BlogPostBar from "../BlogPostBar";

import type { BlogBlock } from "../../types/portfolio";
import type { BlogPostDesignProps } from "../types";

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Row =
  | { kind: "full"; block: BlogBlock }
  | { kind: "pair"; left: BlogBlock | null; right: BlogBlock | null };

type Side = "left" | "right";

function buildRows(blocks: BlogBlock[]): Row[] {
  const rows: Row[] = [];
  let current: { left: BlogBlock | null; right: BlogBlock | null } = {
    left: null,
    right: null,
  };
  let lastAuto: Side = "right";

  const flush = () => {
    if (current.left || current.right) {
      rows.push({ kind: "pair", left: current.left, right: current.right });
    }

    current = { left: null, right: null };
  };

  for (const block of blocks) {
    if (block.column === "full") {
      flush();
      rows.push({ kind: "full", block });
      continue;
    }

    let side: Side;
    if (block.column === "left" || block.column === "right") {
      side = block.column;
    } else if (current.left && !current.right) {
      side = "right";
    } else if (current.right && !current.left) {
      side = "left";
    } else {
      lastAuto = lastAuto === "right" ? "left" : "right";
      side = lastAuto;
    }

    if (current[side]) flush();

    current[side] = block;
  }

  flush();

  return rows;
}

function ColumnsBlogPost({ post, onBack, onEdit, onDelete, preview }: BlogPostDesignProps) {
  const rows = buildRows(post.blocks);

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-14 md:pb-24">
      <div className="mx-auto max-w-6xl">
        {!preview && (
          <BlogPostBar
            post={post}
            onBack={onBack}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}

        <header className="mt-12 mb-10 md:text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            {formatDate(post.date)}
          </p>

          <h1 className="mt-4 text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
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

        <div className="flex flex-col gap-14 md:gap-y-14">
          {rows.map((row, index) => {
            if (row.kind === "full") {
              return (
                <div key={index} className="w-full">
                  <PostBodyBlock block={row.block} />
                </div>
              );
            }

            const hasBoth = row.left && row.right;

            return (
              <div
                key={index}
                className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-10"
              >
                {row.left && (
                  <div className={hasBoth ? "md:col-start-1" : "md:col-span-2"}>
                    <PostBodyBlock block={row.left} />
                  </div>
                )}

                {row.right && (
                  <div className={hasBoth ? "md:col-start-2" : "md:col-span-2"}>
                    <PostBodyBlock block={row.right} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default ColumnsBlogPost;