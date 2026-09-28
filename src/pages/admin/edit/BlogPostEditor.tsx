import { useEffect, useRef, useState } from "react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import ImageUpload from "../../../components/ImageUpload";
import ImageCropModal from "../../../components/ImageCropModal";
import { BlogBlockEditor } from "../../../components/blog/BlogBlockEditor";

import { usePortfolio } from "../../../lib/usePortfolio";
import { slugify, uniqueSlug } from "../../../lib/slug";
import { emptyParagraphRichText } from "../../../lib/richtext";
import { buildId, toDraft, toBlock } from "../../../lib/blogBlocks";
import {
  clearAutosave,
  saveAutosave,
  type AutosaveDraft,
  type BlockDraft,
} from "../../../lib/blogAutosave";

import type { BlogPost, BlogPostDesignId, BlogPostStatus } from "../../../types/portfolio";
import { BLOG_DESIGN_OPTIONS, blogDesignFor } from "../../../blogDesigns";

type BlockDraftType = "text" | "image" | "embed" | "separator";

const AUTOSAVE_INTERVAL = 20_000;

/* ─── Main editor ─── */

interface BlogPostEditorProps {
  initial: BlogPost | null;
  restoredDraft?: AutosaveDraft | null;
  onClose: (result?: EditorResult) => void;
}

export type EditorResult = "saved-draft" | "published" | "discarded" | "cancelled";

const STATUS_OPTIONS: { value: BlogPostStatus; label: string }[] = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
];

function formatInputDate(date: string): string {
  return date ? date.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

export function BlogPostEditor({
  initial,
  restoredDraft,
  onClose,
}: BlogPostEditorProps) {
  const { blogPosts, setBlogPosts } = usePortfolio();

  const editingSlug = initial?.slug ?? null;
  const isNew = !initial;
  const savedDraft = isNew ? restoredDraft ?? null : null;

  const [title, setTitle] = useState(savedDraft?.title ?? initial?.title ?? "");
  const [slug, setSlug] = useState(
    savedDraft?.slug ?? initial?.slug ?? "",
  );
  const [slugTouched, setSlugTouched] = useState(
    savedDraft?.slugTouched ?? Boolean(initial),
  );
  const [excerpt, setExcerpt] = useState(
    savedDraft?.excerpt ?? initial?.excerpt ?? "",
  );
  const [cover, setCover] = useState(
    savedDraft?.cover ?? initial?.cover ?? "",
  );
  const [coverFocusX, setCoverFocusX] = useState(
    savedDraft?.coverFocusX ?? initial?.coverFocusX ?? 50,
  );
  const [coverFocusY, setCoverFocusY] = useState(
    savedDraft?.coverFocusY ?? initial?.coverFocusY ?? 50,
  );
  const [date, setDate] = useState(
    formatInputDate(savedDraft?.date ?? initial?.date ?? ""),
  );
  const [status, setStatus] = useState<BlogPostStatus>(
    savedDraft?.status ?? initial?.status ?? "draft",
  );
  const [design, setDesign] = useState<BlogPostDesignId>(
    savedDraft?.design ?? initial?.design ?? "classic",
  );

  const [blocks, setBlocks] = useState<BlockDraft[]>(
    savedDraft
      ? savedDraft.blocks
      : initial
        ? initial.blocks.map(toDraft)
        : [],
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const [cropOpen, setCropOpen] = useState(false);
  const [coverCropOpen, setCoverCropOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<string>(() =>
    isNew && savedDraft ? JSON.stringify(savedDraft) : "",
  );

  const currentSnapshot = JSON.stringify({
    title,
    slug,
    slugTouched,
    excerpt,
    cover,
    coverFocusX,
    coverFocusY,
    date,
    status,
    design,
    blocks,
  });

  const dirty = isNew && currentSnapshot !== savedSnapshot;

  const currentSnapshotRef = useRef(currentSnapshot);
  const savedSnapshotRef = useRef(savedSnapshot);

  useEffect(() => {
    currentSnapshotRef.current = currentSnapshot;
    savedSnapshotRef.current = savedSnapshot;
  }, [currentSnapshot, savedSnapshot]);

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!slugTouched) {
      setSlug(slugify(value));
    }
  };

  const handleAdd = (type: BlockDraftType) => {
    const draft: BlockDraft =
      type === "text"
        ? { id: buildId(), type, content: emptyParagraphRichText() }
        : { id: buildId(), type };

    setBlocks((prev) => [...prev, draft]);
    setEditingId(type === "separator" ? null : draft.id);
  };

  const updateBlock = (id: string, next: BlockDraft) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? next : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));

    if (editingId === id) setEditingId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      const target = index + dir;

      if (index < 0 || target < 0 || target >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];

      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === active.id);
        const newIndex = prev.findIndex((b) => b.id === over.id);

        if (oldIndex < 0 || newIndex < 0) return prev;

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    if (!isNew) return;

    if (currentSnapshot === savedSnapshot) return;

    const timer = setTimeout(() => {
      saveAutosave(JSON.parse(currentSnapshot) as AutosaveDraft);
      setSavedSnapshot(currentSnapshot);
      setSavedAt(Date.now());
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [currentSnapshot, savedSnapshot, isNew]);

  useEffect(() => {
    if (!isNew) return;

    const flush = () => {
      try {
        const current = currentSnapshotRef.current;
        if (current !== savedSnapshotRef.current) {
          saveAutosave(JSON.parse(current) as AutosaveDraft);
          savedSnapshotRef.current = current;
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("beforeunload", flush);

    return () => window.removeEventListener("beforeunload", flush);
  }, [isNew]);

  const validate = (): string | null => {
    if (!title.trim()) return "El título es obligatorio.";

    if (!slug.trim()) return "El slug es obligatorio.";

    return null;
  };

  const doSave = (targetStatus: BlogPostStatus) => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const existingSlugs = blogPosts
      .filter((p) => p.slug !== editingSlug)
      .map((p) => p.slug);

    const finalSlug = editingSlug ?? uniqueSlug(slug, existingSlugs);

    const post: BlogPost = {
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim(),
      cover: cover.trim(),
      coverFocusX,
      coverFocusY,
      date: date || new Date().toISOString().slice(0, 10),
      status: targetStatus,
      design,
      blocks: blocks.map(toBlock),
    };

    if (editingSlug) {
      setBlogPosts(blogPosts.map((p) => (p.slug === editingSlug ? post : p)));
    } else {
      setBlogPosts([...blogPosts, post]);
    }

    clearAutosave();
    onClose(targetStatus === "published" ? "published" : "saved-draft");
  };

  const handleCancel = () => {
    if (!isNew) {
      onClose("cancelled");
      return;
    }

    const empty =
      !title.trim() &&
      !excerpt.trim() &&
      !cover.trim() &&
      blocks.length === 0;

    if (empty) {
      clearAutosave();
      onClose("cancelled");
      return;
    }

    if (
      window.confirm(
        "Se encontrará una versión no guardada. ¿Descartar los cambios de esta publicación?",
      )
    ) {
      clearAutosave();
      onClose("discarded");
    }
  };

  const previewPost: BlogPost = {
    slug,
    title: title.trim() || "Sin título",
    excerpt: excerpt.trim(),
    cover: cover.trim(),
    coverFocusX,
    coverFocusY,
    date,
    status,
    design,
    blocks: blocks.map(toBlock),
  };

  return (
    <section
      aria-label="Editor de publicación"
      className="mb-16 rounded-3xl border border-(--visora-accent)/20 bg-white/70 p-5 shadow-xl backdrop-blur-xl dark:bg-[#161327]/70 md:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF]">
          {initial ? "Editar publicación" : "Nueva publicación"}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {isNew && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-neutral-400 dark:text-[#6F6A80]"
              role="status"
              aria-live="polite"
            >
              {dirty ? (
                <>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-(--visora-accent)" />
                  Guardando...
                </>
              ) : savedAt ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Guardado hace unos segundos
                </>
              ) : null}
            </span>
          )}

          <span
            className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em] ${
              status === "published"
                ? "bg-green-500/15 text-green-600 dark:text-green-400"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
            }`}
          >
            {status === "published" ? "Publicado" : "Borrador"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Field
          label="Título"
          value={title}
          onChange={handleTitleChange}
          placeholder="Título de la publicación"
          required
        />

        <Field
          label="Slug"
          value={slug}
          onChange={(v) => {
            setSlug(slugify(v));
            setSlugTouched(true);
          }}
          placeholder="mi-publicacion"
        />
        <p className="-mt-3 text-xs text-neutral-400 dark:text-[#6F6A80]">
          Se genera automáticamente desde el título. Puedes editarlo.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Extracto
          </label>

          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Resumen para el listado del blog..."
            rows={3}
            className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <ImageUpload
            label="Portada"
            image={cover}
            onImage={(url) => setCover(url)}
            onRemove={() => setCover("")}
            className="h-48 sm:h-64"
            onCrop={() => setCoverCropOpen(true)}
          />

          {cover && (
            <button
              type="button"
              onClick={() => setCropOpen(true)}
              className="self-start rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-600 transition-colors hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-(--visora-accent)/40 dark:hover:text-(--visora-accent)"
            >
              Ajustar posición de la portada
            </button>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
              Fecha
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:[color-scheme:dark]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
              Estado
            </label>

            <div className="flex gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    status === option.value
                      ? "border-(--visora-accent) bg-(--visora-accent)/10 text-(--visora-accent) dark:text-[#B9B1FF]"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-400 dark:border-[#27243A] dark:text-[#A8A3B8]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Diseño de la entrada
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            {BLOG_DESIGN_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDesign(option.id)}
                className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors ${
                  design === option.id
                    ? "border-(--visora-accent) bg-(--visora-accent)/10"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-[#27243A] dark:hover:border-[#4A4468]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    {option.swatch.map((color) => (
                      <span
                        key={color}
                        aria-hidden="true"
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>

                  <span className="text-sm font-medium text-neutral-900 dark:text-[#F5F3FF]">
                    {option.label}
                  </span>
                </span>

                <span className="text-xs leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500 dark:text-[#A8A3B8]">
              Contenido
            </h3>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAdd("text")}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-(--visora-accent)/40 dark:hover:text-(--visora-accent)"
              >
                + Texto
              </button>

              <button
                type="button"
                onClick={() => handleAdd("image")}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-(--visora-accent)/40 dark:hover:text-(--visora-accent)"
              >
                + Imagen
              </button>

              <button
                type="button"
                onClick={() => handleAdd("embed")}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-(--visora-accent)/40 dark:hover:text-(--visora-accent)"
              >
                + Embed
              </button>

              <button
                type="button"
                onClick={() => handleAdd("separator")}
                className="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-(--visora-accent)/40 dark:hover:text-(--visora-accent)"
              >
                + Separador
              </button>
            </div>
          </div>

          {blocks.length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-neutral-200 py-10 text-center text-sm text-neutral-400 dark:border-[#27243A] dark:text-[#6F6A80]">
              Aún no hay bloques. Agrega texto, imágenes, embeds o separadores.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {blocks.map((block) => (
                    <BlogBlockEditor
                      key={block.id}
                      block={block}
                      editing={editingId === block.id}
                      onToggleEdit={() =>
                        setEditingId(editingId === block.id ? null : block.id)
                      }
                      onChange={(next) => updateBlock(block.id, next)}
                      onRemove={() => removeBlock(block.id)}
                      onMove={(dir) => moveBlock(block.id, dir)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Errores */}
        {error && (
          <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end dark:border-[#27243A]">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-neutral-200 px-5 py-3 text-sm text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-full border border-neutral-200 px-5 py-3 text-sm text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468]"
          >
            Vista previa
          </button>

          <button
            type="button"
            onClick={() => doSave("draft")}
            className="rounded-full border border-amber-400/50 px-5 py-3 text-sm text-amber-600 transition-colors hover:bg-amber-50 dark:border-amber-400/30 dark:text-amber-400 dark:hover:bg-amber-400/10"
          >
            Guardar borrador
          </button>

          <button
            type="button"
            onClick={() => doSave("published")}
            className="rounded-[var(--visora-btn-radius)] bg-neutral-900 px-6 py-3 text-sm text-white transition-colors hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Crop modal (focal point) */}
      <ImageCropModal
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        image={cover}
        aspect={16 / 10}
        onSave={(x, y) => {
          setCoverFocusX(x);
          setCoverFocusY(y);
        }}
      />

      {/* Crop modal (free recortar) */}
      {cover && (
        <ImageCropModal
          open={coverCropOpen}
          onClose={() => setCoverCropOpen(false)}
          image={cover}
          free
          onExport={(dataUrl) => {
            setCover(dataUrl);
            setCoverFocusX(50);
            setCoverFocusY(50);
            setCoverCropOpen(false);
          }}
        />
      )}

      {/* Preview modal */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Vista previa"
        wide
      >
        {(() => {
          const Design = blogDesignFor(previewPost.design).Page;

          return (
            <Design
              post={previewPost}
              onBack={() => setPreviewOpen(false)}
              onEdit={() => setPreviewOpen(false)}
              onDelete={() => setPreviewOpen(false)}
              preview
            />
          );
        })()}
      </Modal>
    </section>
  );
}
