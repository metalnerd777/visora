import type { JSONContent } from "@tiptap/core";
import { sanitizeUrl } from "../lib/validation";

function renderNodes(
  nodes: JSONContent[] | undefined,
): React.ReactNode[] {
  return (nodes ?? []).map((node, i) => (
    <NodeRenderer key={i} node={node} />
  ));
}

function NodeRenderer({ node }: { node: JSONContent }) {
  const align = node.attrs?.textAlign;
  const alignClass =
    align === "center"
      ? " text-center"
      : align === "right"
        ? " text-right"
        : "";

  switch (node.type) {
    case "paragraph":
      return <p className={`my-6 text-base leading-relaxed text-neutral-600 dark:text-[#C9C4D8] md:text-lg${alignClass}`}>{renderNodes(node.content)}</p>;

    case "heading": {
      const level = node.attrs?.level ?? 2;

      const cls =
        level === 1
          ? "mt-10 mb-5 text-3xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF]"
          : level === 3
            ? "mt-8 mb-4 text-xl font-medium tracking-tight text-neutral-900 dark:text-[#F5F3FF]"
            : "mt-9 mb-5 text-2xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF]";

      if (level === 1) return <h1 className={cls}>{renderNodes(node.content)}</h1>;
      if (level === 3) return <h3 className={cls}>{renderNodes(node.content)}</h3>;
      return <h2 className={cls}>{renderNodes(node.content)}</h2>;
    }

    case "bulletList":
      return <ul className="my-6 list-disc space-y-2 pl-6 text-neutral-600 dark:text-[#C9C4D8]">{renderNodes(node.content)}</ul>;

    case "orderedList":
      return <ol className="my-6 list-decimal space-y-2 pl-6 text-neutral-600 dark:text-[#C9C4D8]">{renderNodes(node.content)}</ol>;

    case "listItem":
      return <li>{renderNodes(node.content)}</li>;

    case "blockquote":
      return (
        <blockquote className="my-8 border-l-[3px] border-solid border-(--visora-accent) pl-5 text-lg italic leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
          {renderNodes(node.content)}
        </blockquote>
      );

    case "hardBreak":
      return <br />;

    case "text": {
      const { marks } = node;
      let inner: React.ReactNode = node.text ?? "";

      if (marks && marks.length > 0) {
        for (const mark of marks) {
          switch (mark.type) {
            case "bold":
              inner = <strong>{inner}</strong>;
              break;
            case "italic":
              inner = <em>{inner}</em>;
              break;
            case "underline":
              inner = <u>{inner}</u>;
              break;
            case "strike":
              inner = <s>{inner}</s>;
              break;
            case "link": {
              const href =
                typeof mark.attrs?.href === "string"
                  ? sanitizeUrl(mark.attrs.href)
                  : null;

              inner = href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--visora-accent) underline underline-offset-2"
                >
                  {inner}
                </a>
              ) : (
                inner
              );
              break;
            }
          }
        }
      }

      return <>{inner}</>;
    }

    default:
      return null;
  }
}

export function RichTextView({ content }: { content: JSONContent | unknown }) {
  if (!content || typeof content !== "object") return null;

  const doc = content as JSONContent;

  if (doc.type !== "doc") return null;

  return <div className="rich-text-view">{renderNodes(doc.content)}</div>;
}
