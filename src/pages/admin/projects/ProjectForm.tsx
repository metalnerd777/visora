import { useState } from "react";

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
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate, useParams } from "react-router-dom";

import { projects as defaultProjects } from "../../../data/portfolio";

interface FormImage {
  id: string;
  url: string;
  alt: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  cover: string;
  images: FormImage[];
}

const STORAGE_KEY = "visora-admin-projects";

function getStoredProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }

  return defaultProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    cover: p.cover,
    images: p.photos.map((ph) => ({ id: ph.id, url: ph.url, alt: ph.title })),
  }));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/* ─── Imagen sortable (grid) ─── */

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
        isDragging ? "ring-2 ring-[#7C6CFF]/40 shadow-lg" : ""
      }`}
    >
      <div className="aspect-square">
        <img
          src={image.url}
          alt={image.alt}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Overlay controls */}
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Top: drag + cover badge */}
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
            <span className="rounded-md bg-[#7C6CFF] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
              Portada
            </span>
          )}
        </div>

        {/* Bottom: actions */}
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
                className="flex h-7 items-center rounded-lg bg-black/40 px-2 text-[10px] uppercase tracking-wider text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
              >
                Portada
              </button>
            )}

            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-red-500/80 hover:text-white"
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

/* ─── Formulario ─── */

function getInitialData(slug?: string): ProjectFormData {
  if (!slug) {
    return { title: "", description: "", cover: "", images: [] };
  }

  const stored = getStoredProjects();
  const existing = stored.find((p: { slug: string }) => { return p.slug === slug; });

  if (existing) {
    return {
      title: existing.title,
      description: existing.description,
      cover: existing.cover,
      images: existing.images ?? [],
    };
  }

  return { title: "", description: "", cover: "", images: [] };
}

function ProjectForm() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEditing = Boolean(slug);

  const [data, setData] = useState<ProjectFormData>(() => getInitialData(slug));
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<ProjectFormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleImageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.images.findIndex((img) => img.id === active.id);
        const newIndex = prev.images.findIndex((img) => img.id === over.id);

        return { ...prev, images: arrayMove(prev.images, oldIndex, newIndex) };
      });
    }
  };

  const addImages = (files: FileList | null) => {
    if (!files) return;

    const newImages: FormImage[] = Array.from(files).map((file) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^.]+$/, ""),
    }));

    setData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (id: string) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  const updateImageAlt = (id: string, alt: string) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.map((img) =>
        img.id === id ? { ...img, alt } : img,
      ),
    }));
  };

  const setImageAsCover = (id: string) => {
    const img = data.images.find((i) => i.id === id);

    if (img) update({ cover: img.url });
  };

  const handleSave = () => {
    if (!data.title.trim()) return;

    const projectSlug = slug || slugify(data.title);

    const stored = getStoredProjects();
    const exists = stored.findIndex((p: { slug: string }) => { return p.slug === projectSlug; });

    const projectData = {
      slug: projectSlug,
      title: data.title.trim(),
      description: data.description.trim(),
      cover: data.cover,
      images: data.images,
    };

    if (exists >= 0) {
      stored[exists] = projectData;
    } else {
      stored.push(projectData);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setSaved(true);

    setTimeout(() => navigate("/admin/proyectos"), 600);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
            Administrador · Proyectos
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight">
            {isEditing ? "Editar proyecto" : "Nuevo proyecto"}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/proyectos")}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-sm text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!data.title.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-[#7C6CFF] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-[#7C6CFF] dark:hover:text-white"
          >
            {saved ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Guardado
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Guardar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Columna izquierda: campos */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Información */}
          <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
            <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
              Información
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                  Título
                </label>

                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Nombre del proyecto"
                  className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                  Descripción
                </label>

                <textarea
                  value={data.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Describe el proyecto..."
                  rows={3}
                  className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
                />
              </div>
            </div>
          </section>

          {/* Portada */}
          <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
            <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
              Imagen de portada
            </h2>

              {data.cover ? (
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={data.cover}
                  alt="Portada"
                  className="h-48 w-full object-cover sm:h-56"
                />

                <div className="absolute bottom-3 left-3 flex gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-black/60">
                    Cambiar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) update({ cover: URL.createObjectURL(file) });
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => update({ cover: "" })}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-red-400/60 hover:bg-black/60"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex h-48 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 transition-colors hover:border-[#7C6CFF]/30 dark:border-[#27243A] sm:h-56">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-neutral-300 dark:text-[#4A4468]">
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

                    if (file) update({ cover: URL.createObjectURL(file) });
                  }}
                />
              </label>
            )}
          </section>
        </div>

        {/* Columna derecha: imágenes */}
        <section className="flex-1 rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
              Imágenes ({data.images.length})
            </h2>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-[#7C6CFF]/40 hover:text-[#7C6CFF] dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#7C6CFF]/40 dark:hover:text-[#7C6CFF]">
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
                onChange={(e) => addImages(e.target.files)}
              />
            </label>
          </div>

          {data.images.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleImageDragEnd}
            >
              <SortableContext
                items={data.images.map((img) => img.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {data.images.map((image) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      isCover={data.cover === image.url}
                      onRemove={() => removeImage(image.id)}
                      onSetCover={() => setImageAsCover(image.id)}
                      onAltChange={(alt) => updateImageAlt(image.id, alt)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 transition-colors hover:border-[#7C6CFF]/30 dark:border-[#27243A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-neutral-300 dark:text-[#4A4468]">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>

              <div className="text-center">
                <p className="text-sm text-neutral-400 dark:text-[#6F6A80]">
                  Arrastra imágenes aquí
                </p>

                <p className="mt-1 text-xs text-neutral-300 dark:text-[#4A4468]">
                  o haz clic para seleccionar
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addImages(e.target.files)}
              />
            </label>
          )}
        </section>
      </div>
    </div>
  );
}

export default ProjectForm;
