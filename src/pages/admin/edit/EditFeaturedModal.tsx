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

import Modal from "../../../components/Modal";
import SaveButton from "../../../components/SaveButton";
import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { projects as defaultProjects } from "../../../data/portfolio";

interface ProjectRef {
  slug: string;
  title: string;
  cover: string;
}

function getAllProjects(): ProjectRef[] {
  return loadJSON<Array<{ slug: string; title: string; cover: string }>>(
    "visora-admin-projects",
    defaultProjects.map((p) => ({ slug: p.slug, title: p.title, cover: p.cover })),
  );
}

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
          ? "border-(--visora-accent)/40 shadow-lg shadow-(--visora-accent)/10"
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
        ) : null}
      </div>

      <p className="min-w-0 flex-1 truncate text-sm">{project.title}</p>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-[#6F6A80] dark:hover:bg-red-500/10 dark:hover:text-red-400"
        aria-label="Quitar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function EditFeaturedModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const allProjects = getAllProjects();
  const [selected, setSelected] = useState<string[]>(
    () => loadJSON<string[]>("visora-admin-featured", []),
  );

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
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
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
    saveJSON("visora-admin-featured", selected);
    refresh();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar Destacadas"
      wide
      actions={<SaveButton onClick={handleSave} />}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Selected */}
          <div>
            <p className="mb-3 text-sm font-medium">
              Orden de destacadas ({selected.length})
            </p>

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
              <p className="text-sm text-neutral-400 dark:text-[#6F6A80]">
                Selecciona proyectos de la lista.
              </p>
            )}
          </div>

          {/* Available */}
          <div>
            <p className="mb-3 text-sm font-medium">Proyectos disponibles</p>

            <div className="grid gap-2 sm:grid-cols-2">
              {allProjects.map((project) => {
                const isSelected = selected.includes(project.slug);

                return (
                  <button
                    key={project.slug}
                    type="button"
                    onClick={() => toggle(project.slug)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-(--visora-accent)/30 bg-(--visora-accent)/5 dark:border-(--visora-accent)/30 dark:bg-(--visora-accent)/10"
                        : "border-neutral-200/70 bg-white/60 hover:border-neutral-300 dark:border-[#27243A]/70 dark:bg-[#161327]/60 dark:hover:border-[#4A4468]"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        isSelected
                          ? "border-(--visora-accent) bg-(--visora-accent)"
                          : "border-neutral-300 dark:border-[#4A4468]"
                      }`}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-white">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-white/5">
                      {project.cover ? (
                        <img
                          src={project.cover}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
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
    </Modal>
  );
}

export default EditFeaturedModal;
