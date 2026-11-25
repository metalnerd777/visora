import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { useLocation } from "react-router-dom";

import Hero from "../components/Hero";
import MasonryGallery from "../components/MasonryGallery";
import ProjectCard from "../components/ProjectCard";
import PhotoViewer from "../components/PhotoViewer";

import { usePortfolio } from "../lib/usePortfolio";
import { useAdmin } from "../lib/useAdmin";
import { usePhotoViewer } from "../lib/usePhotoViewer";

import EditableSection from "./admin/edit/EditableSection";

const EditHeroModal = lazy(() => import("./admin/edit/EditHeroModal"));
const EditFeaturedModal = lazy(() => import("./admin/edit/EditFeaturedModal"));
const EditProjectsModal = lazy(() => import("./admin/edit/EditProjectsModal"));

function Home() {
  const { projects, featuredPhotos, siteTexts } = usePortfolio();
  const location = useLocation();
  const viewer = usePhotoViewer(featuredPhotos);
  const admin = useAdmin();

  const [heroOpen, setHeroOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Los visitantes solo ven los proyectos públicos; el admin ve también los ocultos
  const visibleProjects = useMemo(
    () =>
      admin
        ? projects
        : projects.filter((p) => p.visibility !== "unlisted"),
    [projects, admin],
  );

  // Categorías únicas disponibles
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of visibleProjects) {
      const cat = p.category?.trim();
      if (cat) set.add(cat);
    }
    return Array.from(set);
  }, [visibleProjects]);

  const effectiveCategory =
    activeCategory === "all" || categories.includes(activeCategory)
      ? activeCategory
      : "all";

  const filteredProjects = useMemo(() => {
    let list =
      effectiveCategory === "all"
        ? visibleProjects
        : visibleProjects.filter(
            (p) => p.category?.trim() === effectiveCategory,
          );

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.client && p.client.toLowerCase().includes(q)) ||
          (p.year && p.year.includes(q)),
      );
    }

    return list;
  }, [visibleProjects, effectiveCategory, searchQuery]);

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)
      ?.scrollTo;

    if (!target) return;

    const el = document.getElementById(target);

    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
    }
  }, [location.state]);

  return (
    <>
      {/* Hero Monumental */}
      {admin ? (
        <EditableSection label="Editar portada" onEdit={() => setHeroOpen(true)}>
          <Hero />
        </EditableSection>
      ) : (
        <Hero />
      )}

      {/* Sección 01: Obras Destacadas */}
      <section
        id="featured"
        className="border-t border-neutral-200/80 px-6 py-24 transition-colors dark:border-neutral-800/80 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection
              label="Editar destacadas"
              onEdit={() => setFeaturedOpen(true)}
            >
              <div className="mb-14 max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-(--visora-accent)" />
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                    // 01 · {siteTexts.featuredLabel}
                  </p>
                </div>

                <h2 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                  {siteTexts.featuredTitle}
                </h2>

                <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-300 text-base md:text-lg">
                  {siteTexts.featuredDescription}
                </p>
              </div>
            </EditableSection>
          ) : (
            <div className="mb-14 max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-6 bg-(--visora-accent)" />
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                  // 01 · {siteTexts.featuredLabel}
                </p>
              </div>

              <h2 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                {siteTexts.featuredTitle}
              </h2>

              <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-300 text-base md:text-lg">
                {siteTexts.featuredDescription}
              </p>
            </div>
          )}

          <MasonryGallery
            photos={featuredPhotos}
            onPhotoClick={viewer.openViewer}
          />
        </div>
      </section>

      {/* Sección 02: Catálogo de Proyectos */}
      <section
        id="projects"
        className="border-t border-neutral-200/80 px-6 py-24 transition-colors dark:border-neutral-800/80 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection
              label="Editar proyectos"
              onEdit={() => setProjectsOpen(true)}
              addLabel="Nuevo proyecto"
              onAdd={() => setProjectsOpen(true)}
            >
              <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px w-6 bg-(--visora-accent)" />
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                      // 02 · {siteTexts.projectsLabel}
                    </p>
                  </div>

                  <h2 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                    {siteTexts.projectsTitle}
                  </h2>

                  <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-300 text-base md:text-lg">
                    {siteTexts.projectsDescription}
                  </p>
                </div>

                <div className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                  Total: {visibleProjects.length}{" "}
                  {visibleProjects.length === 1 ? "Álbum" : "Álbumes"}
                </div>
              </div>
            </EditableSection>
          ) : (
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-(--visora-accent)" />
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                    // 02 · {siteTexts.projectsLabel}
                  </p>
                </div>

                <h2 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                  {siteTexts.projectsTitle}
                </h2>

                <p className="mt-4 leading-relaxed text-neutral-600 dark:text-neutral-300 text-base md:text-lg">
                  {siteTexts.projectsDescription}
                </p>
              </div>

              <div className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                Total: {visibleProjects.length}{" "}
                {visibleProjects.length === 1 ? "Álbum" : "Álbumes"}
              </div>
            </div>
          )}

          {/* Filtros por categoría y barra de búsqueda rápida */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {categories.length > 1 ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                    effectiveCategory === "all"
                      ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-950"
                      : "border border-neutral-200/80 bg-white/50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                  }`}
                >
                  Todos ({visibleProjects.length})
                </button>
                {categories.map((cat) => {
                  const count = visibleProjects.filter(
                    (p) => p.category?.trim() === cat,
                  ).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                        effectiveCategory === cat
                          ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-950"
                          : "border border-neutral-200/80 bg-white/50 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            ) : <div />}

            {/* Buscador en vivo */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por serie o cliente..."
                className="w-full rounded-full border border-neutral-200/80 bg-white/60 py-2 pl-9 pr-8 text-xs text-neutral-800 placeholder-neutral-400 outline-none backdrop-blur-sm transition-all focus:border-(--visora-accent) focus:ring-1 focus:ring-(--visora-accent)/20 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200"
              />
              <svg
                className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Grid de proyectos amplio y equilibrado o estado vacío */}
          {filteredProjects.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:gap-14">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-base text-neutral-500 dark:text-neutral-400">
                No se encontraron álbumes que coincidan con &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-3 text-xs uppercase tracking-wider text-(--visora-accent) underline"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Visor Lightbox */}
      {viewer.viewerIndex !== null &&
        featuredPhotos[viewer.viewerIndex] && (
          <PhotoViewer
            imageUrl={featuredPhotos[viewer.viewerIndex].url}
            title={featuredPhotos[viewer.viewerIndex].title}
            currentIndex={viewer.viewerIndex}
            totalPhotos={featuredPhotos.length}
            hasPrevious={viewer.viewerIndex > 0}
            hasNext={viewer.viewerIndex < featuredPhotos.length - 1}
            onPrevious={viewer.showPrevious}
            onNext={viewer.showNext}
            onClose={viewer.closeViewer}
          />
        )}

      {/* Admin modals (lazy loaded) */}
      {admin && (
        <Suspense fallback={null}>
          {heroOpen && (
            <EditHeroModal open={heroOpen} onClose={() => setHeroOpen(false)} />
          )}
          {featuredOpen && (
            <EditFeaturedModal
              open={featuredOpen}
              onClose={() => setFeaturedOpen(false)}
            />
          )}
          {projectsOpen && (
            <EditProjectsModal
              open={projectsOpen}
              onClose={() => setProjectsOpen(false)}
            />
          )}
        </Suspense>
      )}
    </>
  );
}

export default Home;
