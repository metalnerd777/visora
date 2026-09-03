import { useRef, useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";
import { processImages, type ImageProcessResult } from "../../../lib/image";
import { useImageDrop } from "../../../lib/useImageDrop";

import { projects as defaultProjects } from "../../../data/portfolio";

interface AdminProject {
  slug: string;
  title: string;
  description: string;
  cover: string;
  images: FormImage[];
}

interface FormImage {
  id: string;
  url: string;
  alt: string;
  file?: File;
}

function findImageIdByUrl(images: FormImage[], url: string): string | undefined {
  return images.find((img) => img.url === url)?.id;
}

function loadAllProjects(): AdminProject[] {
  const raw = loadJSON<Array<Record<string, unknown>>>(
    "visora-admin-projects",
    defaultProjects.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      cover: p.cover,
      images: p.photos.map((ph) => ({ id: ph.id, url: ph.url, alt: ph.title })),
    })),
  );

  return raw.map((p) => {
    const slug = (p.slug as string) ?? "";
    const imgs = (p.images ?? p.photos ?? []) as Array<Record<string, unknown>>;

    let images = imgs.map((img) => ({
      id: (img.id as string) ?? `img-${Date.now()}-${Math.random()}`,
      url: (img.url as string) ?? "",
      alt: (img.alt as string) ?? (img.title as string) ?? "",
    }));

    if (images.length === 0) {
      const fallback = defaultProjects.find((dp) => dp.slug === slug);

      if (fallback) {
        images = fallback.photos.map((ph) => ({
          id: ph.id,
          url: ph.url,
          alt: ph.title,
        }));
      }
    }

    return {
      slug,
      title: (p.title as string) ?? "",
      description: (p.description as string) ?? "",
      cover: (p.cover as string) ?? "",
      images,
    };
  });
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* ─── Sortable project row ─── */

function SortableRow({
  project,
  onEdit,
  onDelete,
}: {
  project: AdminProject;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border bg-white/60 p-3 backdrop-blur-sm transition-all dark:bg-[#161327]/60 ${
        isDragging
          ? "border-(--visora-accent)/40 shadow-lg"
          : "border-neutral-200/70 dark:border-[#27243A]/70"
      }`}
    >
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-neutral-300 hover:text-neutral-500 active:cursor-grabbing dark:text-[#4A4468] dark:hover:text-[#6F6A80]"
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

      <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-white/5">
        {project.cover ? (
          <img src={project.cover} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{project.title}</p>
        <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
          {project.images.length} imagen{project.images.length !== 1 ? "es" : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-[#6F6A80] dark:hover:bg-white/5 dark:hover:text-[#F5F3FF]"
        aria-label="Editar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-[#6F6A80] dark:hover:bg-red-500/10 dark:hover:text-red-400"
        aria-label="Eliminar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Sortable image tile ─── */

function SortableImage({
  image,
  isCover,
  onRemove,
  onSetCover,
  onAltChange,
}: {
  image: FormImage;
  isCover: boolean;
  onRemove: () => void;
  onSetCover: () => void;
  onAltChange: (alt: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-white/5 ${
        isDragging ? "ring-2 ring-(--visora-accent)/40 shadow-lg" : ""
      }`}
    >
      <div className="aspect-square">
        <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-start justify-between p-2">
          <button
            type="button"
            className="flex h-7 w-7 cursor-grab items-center justify-center rounded-lg bg-black/40 text-white/80 backdrop-blur-sm active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <circle cx="8" cy="4" r="1.5" />
              <circle cx="16" cy="4" r="1.5" />
              <circle cx="8" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
              <circle cx="8" cy="16" r="1.5" />
              <circle cx="16" cy="16" r="1.5" />
            </svg>
          </button>

          {isCover && (
            <span className="rounded-md bg-(--visora-accent) px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              Portada
            </span>
          )}
        </div>

        <div className="flex items-end justify-between p-2">
          <input
            type="text"
            value={image.alt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Alt text"
            className="w-36 rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-xs text-white placeholder:text-white/50 backdrop-blur-sm focus:border-white/40 focus:outline-none"
          />

          <div className="flex gap-1">
            {!isCover && (
              <button
                type="button"
                onClick={onSetCover}
                className="flex h-7 items-center rounded-lg bg-black/40 px-2 text-[10px] uppercase tracking-wider text-white/80 backdrop-blur-sm hover:bg-black/60 hover:text-white"
              >
                Portada
              </button>
            )}

            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 text-white/80 backdrop-blur-sm hover:bg-red-500/80 hover:text-white"
              aria-label="Eliminar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main modal ─── */

type View = "list" | "form";

function EditProjectsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const [projects, setProjects] = useState<AdminProject[]>(loadAllProjects);
  const [view, setView] = useState<View>("list");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* form state */
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCover, setFormCover] = useState("");
  const [formCoverFile, setFormCoverFile] = useState<File | null>(null);
  const [formImages, setFormImages] = useState<FormImage[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState<number>(0);
  const [saveTotal, setSaveTotal] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const saveAll = (updated: AdminProject[]) => {
    setProjects(updated);
    saveJSON("visora-admin-projects", updated);
    refresh();
  };

  /* list reorder */
  const handleListDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.slug === active.id);
      const newIndex = projects.findIndex((p) => p.slug === over.id);

      saveAll(arrayMove(projects, oldIndex, newIndex));
    }
  };

  /* list actions */
  const handleDelete = (slug: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;

    saveAll(projects.filter((p) => p.slug !== slug));
  };

  const openNew = () => {
    setEditingSlug(null);
    setFormTitle("");
    setFormDesc("");
    setFormCover("");
    setFormCoverFile(null);
    setFormImages([]);
    setFormError(null);
    setView("form");
  };

  const openEdit = (slug: string) => {
    const project = projects.find((p) => p.slug === slug);

    if (!project) return;

    setEditingSlug(slug);
    setFormTitle(project.title);
    setFormDesc(project.description);
    setFormCover(project.cover);
    setFormCoverFile(null);
    setFormImages([...project.images]);
    setFormError(null);
    setView("form");
  };

  const saveForm = async () => {
    if (!formTitle.trim()) {
      setFormError("El título es obligatorio.");
      return;
    }

    const slug = editingSlug || slugify(formTitle);

    const generatedSlug = slugify(formTitle);
    const slugConflict =
      !editingSlug &&
      projects.some((p) => p.slug === generatedSlug) &&
      generatedSlug !== slug;

    if (slugConflict) {
      setFormError("Ya existe un proyecto con este nombre.");
      return;
    }

    if (formImages.length === 0) {
      setFormError("Agrega al menos una imagen al proyecto.");
      return;
    }

    const toCompress = [
      ...formImages.filter((img) => img.file),
      ...(formCoverFile && !formImages.some((img) => img.url === formCover)
        ? [{ id: "cover", file: formCoverFile } as FormImage]
        : []),
    ];

    setSaving(true);
    setSaveError(null);
    setFormError(null);
    setSaveTotal(toCompress.length);
    setSaveProgress(0);

    try {
      const compressed = new Map<string, ImageProcessResult>();

      if (toCompress.length > 0) {
        const results = await processImages(
          toCompress.map((img) => img.file as File),
        );

        results.forEach((result, idx) => {
          const img = toCompress[idx];
          if (img) compressed.set(img.id, result);
          setSaveProgress(idx + 1);
        });
      }

      const imageData: FormImage[] = formImages.map((img) => {
        const result = compressed.get(img.id);
        return result
          ? { id: img.id, url: result.url, alt: img.alt }
          : { id: img.id, url: img.url, alt: img.alt };
      });

      let cover = formCover || imageData[0].url;

      if (formCover && formCoverFile) {
        const result = compressed.get("cover");
        if (result) cover = result.url;
      } else if (formCover) {
        const coverId = findImageIdByUrl(formImages, formCover);
        if (coverId && compressed.get(coverId)) cover = compressed.get(coverId)!.url;
      }

      const updated: AdminProject = {
        slug,
        title: formTitle.trim(),
        description: formDesc.trim(),
        cover,
        images: imageData,
      };

      const existing = projects.findIndex((p) => p.slug === slug);

      if (existing >= 0) {
        const next = [...projects];
        next[existing] = updated;
        saveAll(next);
      } else {
        saveAll([...projects, updated]);
      }

      setView("list");
    } catch (err) {
      setSaveError(
        (err as Error).message || "Error al comprimir las imágenes",
      );
    } finally {
      setSaving(false);
    }
  };

  /* image helpers */
  const addFiles = (files: File[]) => {
    if (files.length === 0) return;
    setSaveError(null);

    const newImages: FormImage[] = files.map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(file),
      alt: "",
      file,
    }));

    setFormImages((prev) => [...prev, ...newImages]);

    if (!formCover && newImages.length > 0) {
      setFormCover(newImages[0].url);
    }
  };

  const addImages = (files: FileList | null) => {
    if (!files) return;
    addFiles(Array.from(files));
  };

  const { isDragging, dragProps } = useImageDrop(addFiles);

  const handleCoverFile = (file: File | undefined) => {
    if (!file) return;
    setSaveError(null);
    setFormCover(URL.createObjectURL(file));
    setFormCoverFile(file);
  };

  const removeImage = (id: string) => {
    setFormImages((prev) => prev.filter((img) => img.id !== id));
  };

  const updateImageAlt = (id: string, alt: string) => {
    setFormImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, alt } : img)),
    );
  };

  const setImageAsCover = (id: string) => {
    const img = formImages.find((i) => i.id === id);

    if (img) setFormCover(img.url);
  };

  const handleImageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formImages.findIndex((img) => img.id === active.id);
      const newIndex = formImages.findIndex((img) => img.id === over.id);

      setFormImages(arrayMove(formImages, oldIndex, newIndex));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Proyectos" wide>
      {view === "list" ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-[#A8A3B8]">
              {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
            </p>

            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo
            </button>
          </div>

          {projects.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleListDragEnd}
            >
              <SortableContext
                items={projects.map((p) => p.slug)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {projects.map((project) => (
                    <SortableRow
                      key={project.slug}
                      project={project}
                      onEdit={() => openEdit(project.slug)}
                      onDelete={() => handleDelete(project.slug)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="py-10 text-center text-sm text-neutral-400 dark:text-[#6F6A80]">
              No hay proyectos todavía.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <button
            type="button"
            onClick={() => setView("list")}
            className="self-start text-xs uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:text-[#F5F3FF]"
          >
            ← Volver a la lista
          </button>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: info */}
            <div className="flex flex-col gap-5">
              <Field
                label="Título"
                value={formTitle}
                onChange={setFormTitle}
                placeholder="Nombre del proyecto"
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                  Descripción
                </label>

                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe el proyecto..."
                  rows={3}
                  className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
                />
              </div>

              {/* Cover */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                  Portada
                </label>

                {formCover ? (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={formCover}
                      alt="Portada"
                      className="h-40 w-full object-cover"
                    />

                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md hover:border-white/60 hover:bg-black/60">
                        Cambiar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            void handleCoverFile(file);
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setFormCover("");
                          setFormCoverFile(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md hover:border-red-400/60 hover:bg-black/60"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-(--visora-accent)/30 dark:border-[#27243A]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-neutral-300 dark:text-[#4A4468]">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>

                    <span className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                      Seleccionar portada
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        void handleCoverFile(file);
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Right: images */}
            <div
              {...dragProps}
              className={`flex flex-col gap-3 rounded-2xl transition-colors ${
                isDragging ? "bg-(--visora-accent)/10 p-2" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                  Imágenes ({formImages.length})
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-(--visora-accent)/40 dark:hover:text-(--visora-accent)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Agregar
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addImages(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {saving && (
                <div className="flex flex-col gap-2 rounded-xl border border-(--visora-accent)/30 bg-(--visora-accent)/5 p-3">
                  <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-[#C9C4D8]">
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-(--visora-accent) border-t-transparent" />
                      Comprimiendo y guardando imágenes…
                    </span>
                    <span>
                      {saveProgress}/{saveTotal || formImages.length}
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-[#27243A]">
                    <div
                      className="h-full rounded-full bg-(--visora-accent) transition-all duration-200"
                      style={{
                        width: `${saveTotal > 0 ? (saveProgress / saveTotal) * 100 : 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {saveError && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {saveError}
                </p>
              )}

              {formImages.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleImageDragEnd}
                >
                  <SortableContext
                    items={formImages.map((img) => img.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {formImages.map((image) => (
                        <SortableImage
                          key={image.id}
                          image={image}
                          isCover={formCover === image.url}
                          onRemove={() => removeImage(image.id)}
                          onSetCover={() => setImageAsCover(image.id)}
                          onAltChange={(alt) => updateImageAlt(image.id, alt)}
                        />
                      ))}

                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 text-xs text-neutral-400 transition-colors hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#6F6A80]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Agregar
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            addImages(e.target.files);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors ${
                    isDragging
                      ? "border-(--visora-accent) bg-(--visora-accent)/10"
                      : "border-neutral-200 hover:border-(--visora-accent)/30 dark:border-[#27243A]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-neutral-300 dark:text-[#4A4468]">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>

                  <p
                    className={`text-xs ${isDragging ? "text-(--visora-accent)" : "text-neutral-400 dark:text-[#6F6A80]"}`}
                  >
                    {isDragging
                      ? "Suelta las imágenes aquí"
                      : "Arrastra las imágenes aquí o haz clic"}
                  </p>

                  <span className="text-[11px] text-neutral-400 dark:text-[#6F6A80]">
                    JPG, PNG, WebP · máx 90 MB c/u
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addImages(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-[#27243A]">
            <div className="flex flex-1 flex-col items-start justify-center gap-1">
              {formError && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {formError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => void saveForm()}
              disabled={!formTitle.trim() || saving}
              className="inline-flex items-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-6 py-3 text-sm text-white transition-colors hover:bg-(--visora-accent) disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
            >
              {saving ? "Guardando…" : "Guardar proyecto"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default EditProjectsModal;
