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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { projects as defaultProjects } from "../../data/portfolio";

interface ProjectRef {
  slug: string;
  title: string;
  cover: string;
}

const PROJECTS_KEY = "visora-admin-projects";
const FEATURED_KEY = "visora-admin-featured";

function getAllProjects(): ProjectRef[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);

    if (raw) {
      const stored = JSON.parse(raw) as Array<{
        slug: string;
        title: string;
        cover: string;
      }>;

      return stored.map((p) => ({
        slug: p.slug,
        title: p.title,
        cover: p.cover,
      }));
    }
  } catch {
    // ignore
  }

  return defaultProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    cover: p.cover,
  }));
}

function getStoredFeatured(): string[] {
  try {
    const raw = localStorage.getItem(FEATURED_KEY);

    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // ignore
  }

  return [];
}

/* ─── Item sortable (seleccionado) ─── */

function SortableSelected({
  project,
  onRemove,
}: {
  project: ProjectRef;
  onRemove: () => void;
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
          ? "border-[#7C6CFF]/40 shadow-lg shadow-[#7C6CFF]/10"
          : "border-neutral-200/70 dark:border-[#27243A]/70"
      }`}
    >
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-500 active:cursor-grabbing dark:text-[#4A4468] dark:hover:bg-white/5 dark:hover:text-[#6F6A80]"
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
          <img
            src={project.cover}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-300 dark:text-[#4A4468]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      <p className="min-w-0 flex-1 truncate text-sm">{project.title}</p>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-[#6F6A80] dark:hover:bg-red-500/10 dark:hover:text-red-400"
        aria-label="Quitar de destacadas"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/* ─── Página ─── */

function Featured() {
  const allProjects = getAllProjects();
  const [selected, setSelected] = useState<string[]>(getStoredFeatured);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const selectedProjects = selected
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter(Boolean) as ProjectRef[];

  const toggle = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug],
    );
  };

  const remove = (slug: string) => {
    setSelected((prev) => prev.filter((s) => s !== slug));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelected((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    localStorage.setItem(FEATURED_KEY, JSON.stringify(selected));
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
            Administrador
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight">
            Destacadas
          </h1>

          <p className="mt-2 text-sm text-neutral-500 dark:text-[#A8A3B8]">
            {selected.length} proyecto{selected.length !== 1 ? "s" : ""}{" "}
            destacado{selected.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-[#7C6CFF] dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-[#7C6CFF] dark:hover:text-white"
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

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Seleccionados */}
        <div className="flex-1">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Orden de destacadas
          </h2>

          {selectedProjects.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selected}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {selectedProjects.map((project) => (
                    <SortableSelected
                      key={project.slug}
                      project={project}
                      onRemove={() => remove(project.slug)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 py-16 dark:border-[#27243A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-neutral-300 dark:text-[#4A4468]">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>

              <p className="text-sm text-neutral-400 dark:text-[#6F6A80]">
                No hay proyectos destacados.
              </p>

              <p className="text-xs text-neutral-300 dark:text-[#4A4468]">
                Selecciona proyectos de la lista de la derecha.
              </p>
            </div>
          )}
        </div>

        {/* Disponibles */}
        <div className="flex-1">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Proyectos disponibles
          </h2>

          <div className="flex flex-col gap-2">
            {allProjects.map((project) => {
              const isSelected = selected.includes(project.slug);

              return (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => toggle(project.slug)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-[#7C6CFF]/30 bg-[#7C6CFF]/5 dark:border-[#7C6CFF]/30 dark:bg-[#7C6CFF]/10"
                      : "border-neutral-200/70 bg-white/60 hover:border-neutral-300 dark:border-[#27243A]/70 dark:bg-[#161327]/60 dark:hover:border-[#4A4468]"
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isSelected
                        ? "border-[#7C6CFF] bg-[#7C6CFF]"
                        : "border-neutral-300 dark:border-[#4A4468]"
                    }`}
                  >
                    {isSelected && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-white">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  {/* Cover */}
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-white/5">
                    {project.cover ? (
                      <img
                        src={project.cover}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-neutral-300 dark:text-[#4A4468]">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <p className="min-w-0 flex-1 truncate text-sm">
                    {project.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featured;
