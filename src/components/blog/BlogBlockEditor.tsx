import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";

import Field from "../Field";
import ImageUpload from "../ImageUpload";
import ImageCropModal from "../ImageCropModal";
import { RichTextEditor } from "../RichTextEditor";
import { RichTextView } from "../RichTextView";
import EmbedBlock from "../EmbedBlock";

import { emptyParagraphRichText, isRichTextEmpty } from "../../lib/richtext";
import { sanitizeUrl } from "../../lib/validation";
import { detectEmbedProvider, getProviderLabel } from "../../lib/embeds";
import { toBlock } from "../../lib/blogBlocks";
import type { BlockDraft } from "../../lib/blogAutosave";

/* ─── Block editing forms ─── */

function nextWithCaption(draft: BlockDraft, caption: string): BlockDraft {
  const prevCaption = draft.caption ?? "";
  const alt = draft.alt ?? "";
  const syncedAlt = !alt || alt === prevCaption ? caption : alt;

  return { ...draft, caption, alt: syncedAlt };
}

function TextBlockForm({
  draft,
  onChange,
}: {
  draft: BlockDraft;
  onChange: (next: BlockDraft) => void;
}) {
  return (
    <RichTextEditor
      value={draft.content ?? emptyParagraphRichText()}
      onChange={(content) => onChange({ ...draft, content })}
    />
  );
}

function ImageBlockForm({
  draft,
  onChange,
}: {
  draft: BlockDraft;
  onChange: (next: BlockDraft) => void;
}) {
  const [cropOpen, setCropOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <ImageUpload
        label="Imagen"
        image={draft.url}
        onImage={(url) => onChange({ ...draft, url })}
        onRemove={() => onChange({ ...draft, url: "" })}
        className="h-40"
        onCrop={() => setCropOpen(true)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Pie de foto (opcional)"
          value={draft.caption ?? ""}
          onChange={(v) => onChange(nextWithCaption(draft, v))}
          placeholder="Texto que se muestra bajo la imagen"
        />

        <Field
          label="Texto alternativo (ALT)"
          value={draft.alt ?? ""}
          onChange={(v) => onChange({ ...draft, alt: v })}
          placeholder="Descripción de la imagen"
        />
      </div>

      {draft.url && (
        <ImageCropModal
          open={cropOpen}
          onClose={() => setCropOpen(false)}
          image={draft.url}
          free
          onExport={(dataUrl) => {
            onChange({ ...draft, url: dataUrl });
            setCropOpen(false);
          }}
        />
      )}
    </div>
  );
}

function EmbedBlockForm({
  draft,
  onChange,
}: {
  draft: BlockDraft;
  onChange: (next: BlockDraft) => void;
}) {
  const safeUrl = sanitizeUrl(draft.url);
  const provider = draft.provider ?? (safeUrl ? detectEmbedProvider(safeUrl) : null);

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="URL"
        value={draft.url ?? ""}
        onChange={(v) => onChange({ ...draft, url: v })}
        placeholder="https://youtube.com/watch?v=..."
      />

      {provider && (
        <p className="text-xs text-neutral-500 dark:text-[#A8A3B8]">
          Proveedor detectado: {getProviderLabel(provider)}
        </p>
      )}

      <Field
        label="Pie de foto (opcional)"
        value={draft.caption ?? ""}
        onChange={(v) => onChange({ ...draft, caption: v })}
        placeholder="Texto que se muestra bajo el embed"
      />
    </div>
  );
}

function BlockPreview({
  block,
  onChange,
}: {
  block: BlockDraft;
  onChange: (next: BlockDraft) => void;
}) {
  if (block.type === "text") {
    if (block.content) {
      return (
        <div className="max-h-40 overflow-hidden px-4 py-3 opacity-90">
          <RichTextView content={block.content} />
        </div>
      );
    }

    return (
      <p className="px-4 py-3 text-sm text-neutral-400 dark:text-[#6F6A80]">
        Bloque de texto vacío
      </p>
    );
  }

  if (block.type === "image") {
    return block.url ? (
      <div className="flex flex-col gap-3 p-3">
        <img
          src={block.url}
          alt={block.alt ?? ""}
          className="h-40 w-full rounded-xl object-cover"
        />

        <input
          type="text"
          value={block.caption ?? ""}
          onChange={(e) => onChange(nextWithCaption(block, e.target.value))}
          placeholder="Pie de foto (opcional)"
          className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-2.5 text-left text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
        />

        <input
          type="text"
          value={block.alt ?? ""}
          onChange={(e) => onChange({ ...block, alt: e.target.value })}
          placeholder="Texto alternativo (ALT) — descripción de la imagen"
          className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-2.5 text-left text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
        />
      </div>
    ) : (
      <p className="px-4 py-3 text-sm text-neutral-400 dark:text-[#6F6A80]">
        Sin imagen
      </p>
    );
  }

  if (block.type === "separator") {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 text-neutral-300 dark:text-[#3a3650]">
          <span className="h-px flex-1 bg-current" />
          <span className="text-[10px] uppercase tracking-[0.2em]">
            separador
          </span>
          <span className="h-px flex-1 bg-current" />
        </div>
      </div>
    );
  }

  return block.url ? (
    <div className="opacity-90">
      <EmbedBlock block={toBlock(block)} />
    </div>
  ) : (
    <p className="px-4 py-3 text-sm text-neutral-400 dark:text-[#6F6A80]">
      Sin URL
    </p>
  );
}

function ColumnPicker({
  column,
  onChange,
}: {
  column: BlockDraft["column"];
  onChange: (next: BlockDraft["column"]) => void;
}) {
  const options: { value: BlockDraft["column"]; label: string; title: string }[] = [
    { value: "auto", label: "Auto", title: "Automático (alterna columnas)" },
    { value: "left", label: "←", title: "Columna izquierda" },
    { value: "right", label: "→", title: "Columna derecha" },
    { value: "full", label: "⇔", title: "Ancho completo" },
  ];

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg bg-neutral-100 p-0.5 dark:bg-white/5"
      role="group"
      aria-label="Posición del bloque en dos columnas"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.title}
          title={option.title}
          onClick={() => onChange(option.value)}
          className={`flex h-6 items-center justify-center rounded-md px-1.5 text-xs transition-colors ${
            (column ?? "auto") === option.value
              ? "bg-white text-neutral-800 shadow-sm dark:bg-[#2A273F] dark:text-[#F5F3FF]"
              : "text-neutral-400 hover:text-neutral-700 dark:text-[#6F6A80] dark:hover:text-[#A8A3B8]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MiniButton({
  label,
  onClick,
  children,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1 transition-colors ${
        danger
          ? "text-neutral-400 hover:bg-red-50 hover:text-red-500 dark:text-[#6F6A80] dark:hover:bg-red-500/10 dark:hover:text-red-400"
          : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:text-[#6F6A80] dark:hover:bg-white/5 dark:hover:text-[#F5F3FF]"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        {children}
      </svg>
    </button>
  );
}

/* ─── Sortable block card ─── */

export function BlogBlockEditor({
  block,
  editing,
  onToggleEdit,
  onChange,
  onRemove,
  onMove,
}: {
  block: BlockDraft;
  editing: boolean;
  onToggleEdit: () => void;
  onChange: (next: BlockDraft) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  const typeLabel =
    block.type === "text"
      ? "Texto"
      : block.type === "image"
        ? "Imagen"
        : block.type === "embed"
          ? "Embed"
          : "Separador";

  const isEmpty =
    block.type === "text"
      ? isRichTextEmpty(block.content)
      : block.type === "image"
        ? !block.url
        : block.type === "embed"
          ? !block.url
          : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-2xl border bg-white/60 transition-all dark:bg-[#0B0A14]/40 ${
        isDragging
          ? "border-(--visora-accent)/40 shadow-xl shadow-(--visora-accent)/10"
          : "border-neutral-200 dark:border-[#27243A]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 px-3 py-2 dark:border-[#27243A]">
        <button
          type="button"
          aria-label="Reordenar"
          title="Arrastrar para reordenar"
          className="-ml-1 flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-500 active:cursor-grabbing dark:text-[#4A4468] dark:hover:bg-white/5 dark:hover:text-[#6F6A80]"
          {...attributes}
          {...listeners}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <circle cx="8" cy="4" r="1.5" />
            <circle cx="16" cy="4" r="1.5" />
            <circle cx="8" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
            <circle cx="8" cy="16" r="1.5" />
            <circle cx="16" cy="16" r="1.5" />
          </svg>
        </button>

        <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500 dark:bg-white/5 dark:text-[#A8A3B8]">
          {typeLabel}
        </span>

        {isEmpty && (
          <span className="text-[11px] text-neutral-400 dark:text-[#6F6A80]">
            vacío
          </span>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          <ColumnPicker
            column={block.column}
            onChange={(column) => onChange({ ...block, column })}
          />

          <div className="flex items-center gap-0.5">
            <MiniButton label="Subir" onClick={() => onMove(-1)}>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </MiniButton>

            <MiniButton label="Bajar" onClick={() => onMove(1)}>
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </MiniButton>

            {block.type !== "separator" && (
              <MiniButton
                label={editing ? "Cerrar" : "Editar"}
                onClick={onToggleEdit}
              >
                {editing ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                )}
              </MiniButton>
            )}

            <MiniButton label="Eliminar" onClick={onRemove} danger>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </MiniButton>
          </div>
        </div>
      </div>

      {editing || block.type === "image" ? (
        <div className="p-3">
          {block.type === "text" && (
            <TextBlockForm draft={block} onChange={onChange} />
          )}
          {block.type === "image" && (
            <ImageBlockForm draft={block} onChange={onChange} />
          )}
          {block.type === "embed" && (
            <EmbedBlockForm draft={block} onChange={onChange} />
          )}
        </div>
      ) : (
        <BlockPreview block={block} onChange={onChange} />
      )}
    </div>
  );
}
