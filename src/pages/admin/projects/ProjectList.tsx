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
import { Link, useNavigate } from "react-router-dom";

import { projects as defaultProjects } from "../../../data/portfolio";

interface AdminProject {
  slug: string;
  title: string;
  description: string;
  cover: string;
  imageCount: number;
  images?: Array<{ id: string; url: string; alt: string }>;
}

const STORAGE_KEY = "visora-admin-projects";

function getStoredProjects(): AdminProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw) as AdminProject[];
    }
  } catch {
    // ignore
  }

  return defaultProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    cover: p.cover,
    imageCount: p.photos.length,
    images: p.photos.map((ph) => ({ id: ph.id, url: ph.url, alt: ph.title })),
  }));
}

function saveProjects(projects: AdminProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/* ─── Tarjeta sortable ─── */

function ProjectCard({
  project,
  onDelete,
}: {
  project: AdminProject;
  onDelete: (slug: string) => void;
}) {
  const navigate = useNavigate();

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
      className={`group flex items-center gap-4 rounded-2xl border bg-white/60 p-4 backdrop-blur-sm transition-all dark:bg-[#161327]/60 md:p-5 ${
        isDragging
          ? "border-[#7C6CFF]/40 shadow-lg shadow-[#7C6CFF]/10"
          : "border-neutral-200/70 hover:border-[#7C6CFF]/20 dark:border-[#27243A]/70"
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-xl text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-neutral-500 active:cursor-grabbing dark:text-[#4A4468] dark:hover:bg-white/5 dark:hover:text-[#6F6A80]"
        {...attributes}
        {...listeners}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      {/* Cover */}
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-white/5">
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-neutral-300 dark:text-[#4A4468]">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{project.title}</p>

        <p className="mt-0.5 truncate text-xs text-neutral-400 dark:text-[#6F6A80]">
          {project.description || "Sin descripción"}
        </p>

        <p className="mt-1 text-xs text-neutral-400 dark:text-[#6F6A80]">
          {project.imageCount} imagen{project.imageCount !== 1 ? "es" : ""}
        </p>
      </div>

      {/* Acciones */}
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => navigate(`/admin/proyectos/${project.slug}/editar`)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-[#6F6A80] dark:hover:bg-white/5 dark:hover:text-[#F5F3FF]"
          aria-label="Editar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => onDelete(project.slug)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-[#6F6A80] dark:hover:bg-red-500/10 dark:hover:text-red-400"
          aria-label="Eliminar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Lista de proyectos ─── */

function ProjectList() {
  const [projects, setProjects] = useState<AdminProject[]>(getStoredProjects);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((prev) => {
        const oldIndex = prev.findIndex((p) => p.slug === active.id);
        const newIndex = prev.findIndex((p) => p.slug === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex);

        saveProjects(reordered);

        return reordered;
      });
    }
  };

  const handleDelete = (slug: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;

    setProjects((prev) => {
      const updated = prev.filter((p) => p.slug !== slug);

      saveProjects(updated);

      return updated;
    });
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
            Proyectos
          </h1>

          <p className="mt-2 text-sm text-neutral-500 dark:text-[#A8A3B8]">
            {projects.length} proyecto{projects.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Link
          to="/admin/proyectos/nuevo"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-[#7C6CFF] dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-[#7C6CFF] dark:hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo proyecto
        </Link>
      </div>

      {/* Lista */}
      {projects.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.slug)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 py-20 dark:border-[#27243A]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-neutral-300 dark:text-[#4A4468]">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>

          <p className="text-sm text-neutral-400 dark:text-[#6F6A80]">
            No hay proyectos todavía.
          </p>

          <Link
            to="/admin/proyectos/nuevo"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
          >
            Crear primer proyecto
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
