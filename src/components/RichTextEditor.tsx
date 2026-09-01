import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { useEditorState } from "@tiptap/react";

import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/core";

interface ActiveState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  h1: boolean;
  h2: boolean;
  h3: boolean;
  para: boolean;
  bullet: boolean;
  ordered: boolean;
  quote: boolean;
  link: boolean;
  left: boolean;
  center: boolean;
  right: boolean;
}

const DEFAULT_ACTIVE: ActiveState = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  h1: false,
  h2: false,
  h3: false,
  para: false,
  bullet: false,
  ordered: false,
  quote: false,
  link: false,
  left: false,
  center: false,
  right: false,
};

function IconButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "bg-(--visora-accent)/15 text-(--visora-accent) dark:bg-(--visora-accent)/25 dark:text-[#B9B1FF]"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:bg-white/5 dark:hover:text-white"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        {children}
      </svg>
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-neutral-200 dark:bg-[#27243A]" />;
}

function setupLink(editor: Editor) {
  const previousUrl = editor.getAttributes("link").href as string | undefined;

  const url = window.prompt("URL del enlace:", previousUrl ?? "https://");

  if (url === null) return;

  if (url.trim() === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : `https://${url}`;

  editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: normalized })
    .run();
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: JSONContent;
  onChange: (doc: JSONContent) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => onChange(ed.getJSON()),
  });

  const active =
    (useEditorState({
      editor,
      selector: ({ editor: ed }) =>
        ed
          ? {
              bold: ed.isActive("bold"),
              italic: ed.isActive("italic"),
              underline: ed.isActive("underline"),
              strike: ed.isActive("strike"),
              h1: ed.isActive("heading", { level: 1 }),
              h2: ed.isActive("heading", { level: 2 }),
              h3: ed.isActive("heading", { level: 3 }),
              para: ed.isActive("paragraph"),
              bullet: ed.isActive("bulletList"),
              ordered: ed.isActive("orderedList"),
              quote: ed.isActive("blockquote"),
              link: ed.isActive("link"),
              left: ed.isActive({ textAlign: "left" }),
              center: ed.isActive({ textAlign: "center" }),
              right: ed.isActive({ textAlign: "right" }),
            }
          : DEFAULT_ACTIVE,
    }) ?? DEFAULT_ACTIVE) as ActiveState;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 dark:border-[#27243A] dark:bg-[#0B0A14]/60">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-100 px-2 py-2 dark:border-[#27243A]">
        <IconButton
          label="Deshacer"
          disabled={!editor?.can().chain().focus().undo().run()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <path d="M9 14L4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 015.5 5.5v0a5.5 5.5 0 01-5.5 5.5H11" />
        </IconButton>

        <IconButton
          label="Rehacer"
          disabled={!editor?.can().chain().focus().redo().run()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <path d="M15 14l5-5-5-5" />
          <path d="M20 9H9.5A5.5 5.5 0 004 14.5v0A5.5 5.5 0 009.5 20H13" />
        </IconButton>

        <Divider />

        <IconButton
          label="Negrita"
          active={active.bold}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <path d="M6 4h8a4 4 0 010 8H6z" />
          <path d="M6 12h9a4 4 0 010 8H6z" />
        </IconButton>

        <IconButton
          label="Cursiva"
          active={active.italic}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <path d="M19 4h-9" />
          <path d="M14 20H5" />
          <path d="M15 4L9 20" />
        </IconButton>

        <IconButton
          label="Subrayado"
          active={active.underline}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <path d="M6 4v6a6 6 0 0012 0V4" />
          <path d="M4 20h16" />
        </IconButton>

        <IconButton
          label="Tachado"
          active={active.strike}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <path d="M16 4H9a3 3 0 00-2.83 4" />
          <path d="M14 12a4 4 0 010 8H6" />
          <path d="M4 12h16" />
        </IconButton>

        <Divider />

        <IconButton
          label="H1"
          active={active.h1}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <path d="M4 6v12M4 12h8M12 6v12" />
          <path d="M17 6l4 2v10" />
          <path d="M17 12h4" />
        </IconButton>

        <IconButton
          label="H2"
          active={active.h2}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <path d="M4 6v12M4 12h8M12 6v12" />
          <path d="M17 18V8l-4 2" />
          <path d="M21 18h-6" />
        </IconButton>

        <IconButton
          label="H3"
          active={active.h3}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <path d="M4 6v12M4 12h8M12 6v12" />
          <path d="M21 8h-4l-2 4 2 3h4" />
          <path d="M15 12h4" />
        </IconButton>

        <IconButton
          label="Párrafo"
          active={active.para}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          <path d="M8 4v16M16 4v16M13 4h-2a5 5 0 000 10h2" />
        </IconButton>

        <Divider />

        <IconButton
          label="Lista con viñetas"
          active={active.bullet}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <path d="M8 6h13M8 12h13M8 18h13" />
          <circle cx="3.5" cy="6" r="0.5" fill="currentColor" />
          <circle cx="3.5" cy="12" r="0.5" fill="currentColor" />
          <circle cx="3.5" cy="18" r="0.5" fill="currentColor" />
        </IconButton>

        <IconButton
          label="Lista numerada"
          active={active.ordered}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <path d="M10 6h11M10 12h11M10 18h11" />
          <path d="M4 6h1v4M4 10h2M4 16h2M4 14h2v4" />
        </IconButton>

        <IconButton
          label="Cita"
          active={active.quote}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </IconButton>

        <Divider />

        <IconButton
          label="Enlace"
          active={active.link}
          onClick={() => editor && setupLink(editor)}
        >
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </IconButton>

        <IconButton
          label="Quitar enlace"
          disabled={!active.link}
          onClick={() => editor?.chain().focus().unsetLink().run()}
        >
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          <path d="M21 7l-6 5" />
        </IconButton>

        <Divider />

        <IconButton
          label="Alinear a la izquierda"
          active={active.left}
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        >
          <path d="M4 6h16M4 10h10M4 14h16M4 18h10" />
        </IconButton>

        <IconButton
          label="Centrar"
          active={active.center}
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        >
          <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />
        </IconButton>

        <IconButton
          label="Alinear a la derecha"
          active={active.right}
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        >
          <path d="M4 6h16M10 10h10M4 14h16M10 18h10" />
        </IconButton>
      </div>

      <EditorContent editor={editor} className="rich-text-editor" />
    </div>
  );
}
