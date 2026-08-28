import type { JSONContent } from "@tiptap/core";

export function emptyRichText(): JSONContent {
  return { type: "doc", content: [] };
}

export function emptyParagraphRichText(): JSONContent {
  return { type: "doc", content: [{ type: "paragraph" }] };
}

function extractText(node: JSONContent | undefined | null, out: string[]): void {
  if (!node) return;

  if (node.text) {
    out.push(node.text);
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      extractText(child, out);
    }
  }
}

export function richTextToText(doc: JSONContent | unknown): string {
  if (!doc || typeof doc !== "object") return "";

  const out: string[] = [];

  extractText(doc as JSONContent, out);

  return out
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isRichTextEmpty(doc: JSONContent | unknown): boolean {
  return richTextToText(doc).length === 0;
}
