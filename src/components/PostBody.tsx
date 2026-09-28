import EmbedBlock from "./EmbedBlock";
import { RichTextView } from "./RichTextView";

import { resizeUrl } from "../lib/image";

import type { BlogBlock } from "../types/portfolio";

export function PostBodyBlock({ block }: { block: BlogBlock }) {
  if (block.type === "text") {
    if (block.content) {
      return <RichTextView content={block.content} />;
    }

    if (block.text) {
      return (
        <p className="my-6 text-base leading-relaxed text-neutral-600 dark:text-[#C9C4D8] md:text-lg md:leading-relaxed">
          {block.text}
        </p>
      );
    }

    return null;
  }

  if (block.type === "image" && block.url) {
    return (
      <figure className="my-10">
        <img
          src={resizeUrl(block.url, 1600)}
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

  if (block.type === "separator") {
    return (
      <hr className="my-12 border-t border-neutral-200 dark:border-[#27243A]" />
    );
  }

  return null;
}

function PostBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <PostBodyBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

export default PostBody;
