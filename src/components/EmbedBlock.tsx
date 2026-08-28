import type { BlogBlock } from "../types/portfolio";
import {
  detectEmbedProvider,
  getProviderLabel,
  toEmbeddableUrl,
} from "../lib/embeds";
import { sanitizeUrl } from "../lib/validation";

function EmbedBlock({ block }: { block: BlogBlock }) {
  if (!block.url) return null;

  const provider = block.provider ?? detectEmbedProvider(block.url);

  if (!provider) return null;

  const embedUrl = toEmbeddableUrl(block.url, provider);
  const safeLink = sanitizeUrl(block.url);
  const label = getProviderLabel(provider);

  if (embedUrl) {
    return (
      <figure className="my-10">
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            src={embedUrl}
            title={block.caption ?? label}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>

        {block.caption && (
          <figcaption className="mt-3 text-center text-sm text-neutral-500 dark:text-[#A8A3B8]">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (!safeLink) return null;

  return (
    <figure className="my-10">
      <a
        href={safeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-2xl border border-neutral-200 px-6 py-5 transition-colors hover:border-neutral-400 dark:border-[#27243A] dark:hover:border-[#4A4468]"
      >
        <span className="text-sm uppercase tracking-[0.2em] text-neutral-500 dark:text-[#A8A3B8]">
          {label}
        </span>

        <span className="text-sm text-neutral-900 transition-colors hover:text-[#7C6CFF] dark:text-[#F5F3FF]">
          Ver publicación →
        </span>
      </a>

      {block.caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-500 dark:text-[#A8A3B8]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

export default EmbedBlock;
