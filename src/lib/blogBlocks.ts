import type { BlogBlock } from "../types/portfolio";
import { sanitizeUrl } from "./validation";
import { detectEmbedProvider } from "./embeds";
import type { BlockDraft } from "./blogAutosave";

export type { BlockDraft } from "./blogAutosave";

export function buildId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function toDraft(block: BlogBlock): BlockDraft {
  if (block.type === "separator") {
    return { id: block.id, type: "separator", column: block.column };
  }

  return {
    id: block.id,
    type: block.type,
    content:
      block.content &&
      typeof block.content === "object" &&
      (block.content as { type?: string }).type === "doc"
        ? (block.content as BlockDraft["content"])
        : undefined,
    url: block.url,
    alt: block.alt,
    caption: block.caption,
    provider: block.provider,
    column: block.column,
  };
}

export function toBlock(draft: BlockDraft): BlogBlock {
  const base: BlogBlock = {
    id: draft.id,
    type: draft.type,
    column: draft.column,
  };

  if (draft.type === "separator") {
    return base;
  }

  if (draft.type === "text") {
    base.content = draft.content;
    return base;
  }

  if (draft.type === "image") {
    base.url = draft.url;
    base.alt = draft.alt;
    base.caption = draft.caption;
    return base;
  }

  base.url = draft.url;
  base.caption = draft.caption;

  const safeUrl = sanitizeUrl(draft.url);

  if (safeUrl) {
    base.provider = draft.provider ?? detectEmbedProvider(safeUrl) ?? undefined;
  }

  return base;
}
