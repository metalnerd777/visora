import { useState } from "react";
import { Link } from "react-router-dom";

import PhotoViewer from "../components/PhotoViewer";

import { usePortfolio } from "../lib/usePortfolio";
import { useAdmin } from "../lib/useAdmin";
import { usePhotoViewer } from "../lib/usePhotoViewer";
import { resizeUrl } from "../lib/image";
import { isSafeUrl } from "../lib/validation";

import type { Project } from "../types/portfolio";

interface ProjectPageProps {
  project: Project;
  onBack: () => void;
}

function getUnlockedKey(slug: string): string {
  return `visora-pin-unlocked-${slug}`;
}

function isPinUnlocked(slug: string, pin?: string): boolean {
  if (!pin || !pin.trim()) return true;
  try {
    return sessionStorage.getItem(getUnlockedKey(slug)) === pin.trim();
  } catch {
    return false;
  }
}

function ProjectPage({ project, onBack }: ProjectPageProps) {
  const { projects, siteTexts } = usePortfolio();
  const admin = useAdmin();
  const [layoutMode, setLayoutMode] = useState<"masonry" | "grid">("masonry");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [unlocked, setUnlocked] = useState(() =>
    isPinUnlocked(project.slug, project.pin),
  );

  const { viewerIndex, openViewer, closeViewer, showPrevious, showNext } =
    usePhotoViewer(project.photos);

  const viewerPhoto =
    viewerIndex !== null ? project.photos[viewerIndex] : null;

  // Para el loop de siguiente proyecto, excluir álbumes ocultos para visitantes públicos
  const navigableProjects = admin
    ? projects
    : projects.filter((p) => p.visibility !== "unlisted");

  const currentProjectIndex = navigableProjects.findIndex(
    (p) => p.slug === project.slug,
  );
  const nextProject =
    navigableProjects.length > 1 && currentProjectIndex !== -1
      ? navigableProjects[(currentProjectIndex + 1) % navigableProjects.length]
      : null;

  const requiresPin = Boolean(project.pin?.trim()) && !admin && !unlocked;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === project.pin?.trim()) {
      try {
        sessionStorage.setItem(getUnlockedKey(project.slug), pinInput.trim());
      } catch {
        // ignore storage errors
      }
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const hasSpecs = Boolean(
    project.client ||
      project.role ||
      project.year ||
      project.category ||
      (project.externalUrl && isSafeUrl(project.externalUrl)),
  );

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-8 md:pb-28">
      <div className="mx-auto max-w-7xl">
        {/* Navegación superior */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 pb-6 dark:border-neutral-800/80">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            <span>Volver a la galería</span>
          </button>

          {/* Selector de visualización de fotos */}
          {!requiresPin && project.photos.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-100/70 p-1 text-xs tracking-wider dark:border-neutral-800 dark:bg-neutral-900/60">
              <button
                type="button"
                onClick={() => setLayoutMode("masonry")}
                className={`rounded-full px-3 py-1 font-medium transition-all ${
                  layoutMode === "masonry"
                    ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
                title="Mostrar proporciones originales sin recortar"
              >
                Muro Natural
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode("grid")}
                className={`rounded-full px-3 py-1 font-medium transition-all ${
                  layoutMode === "grid"
                    ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
                title="Cuadrícula uniforme"
              >
                Cuadrícula
              </button>
            </div>
          )}
        </div>

        {/* Encabezado de la Obra */}
        <header className="mb-14">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="h-px w-6 bg-(--visora-accent)" />
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
                {project.category ? `${project.category} // ` : "Colección // "}
                {project.photos.length}{" "}
                {project.photos.length === 1
                  ? siteTexts.workNounSingular
                  : siteTexts.workNounPlural}
              </p>

              {admin && project.visibility === "unlisted" && (
                <span className="rounded-full bg-amber-500/15 px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest text-amber-600 dark:text-amber-300">
                  Oculto · Solo con enlace
                </span>
              )}
              {admin && project.pin && (
                <span className="rounded-full bg-neutral-200 px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  🔒 PIN: {project.pin}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl">
              {project.title}
            </h1>

            {project.description && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                {project.description}
              </p>
            )}
          </div>

          {/* Ficha técnica del proyecto (Cliente, Rol, Año, Enlace externo) */}
          {hasSpecs && (
            <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-neutral-200/70 py-6 sm:grid-cols-4 dark:border-neutral-800/80">
              {project.client && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                    Cliente / Encargo
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-neutral-900 dark:text-white">
                    {project.client}
                  </dd>
                </div>
              )}

              {project.role && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                    Rol / Disciplina
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-neutral-900 dark:text-white">
                    {project.role}
                  </dd>
                </div>
              )}

              {project.year && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                    Año
                  </dt>
                  <dd className="mt-1.5 font-mono text-sm font-medium text-neutral-900 dark:text-white">
                    {project.year}
                  </dd>
                </div>
              )}

              {project.externalUrl && isSafeUrl(project.externalUrl) && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
                    Enlace
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-(--visora-accent) underline-offset-4 hover:underline"
                    >
                      <span>Ver proyecto</span>
                      <span>↗</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </header>

        {/* Pantalla de acceso por PIN para álbumes privados de clientes */}
        {requiresPin ? (
          <div className="mx-auto my-16 max-w-md rounded-3xl border border-neutral-200/80 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/70">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-(--visora-accent)/10 text-(--visora-accent)">
              🔒
            </div>
            <h2 className="text-2xl font-light text-neutral-900 dark:text-white">
              Álbum protegido
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Ingresa el código de acceso proporcionado para ver esta galería privada.
            </p>

            <form onSubmit={handlePinSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Código de acceso"
                autoFocus
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm tracking-widest outline-none transition-colors focus:border-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
              />
              {pinError && (
                <p className="text-xs text-red-500">
                  El código ingresado no es correcto.
                </p>
              )}
              <button
                type="submit"
                className="mt-1 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-(--visora-accent) dark:bg-white dark:text-neutral-950 dark:hover:bg-(--visora-accent) dark:hover:text-white"
              >
                Desbloquear álbum
              </button>
            </form>
          </div>
        ) : layoutMode === "masonry" ? (
          /* Muro Masonry con zoom suave */
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
            {project.photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openViewer(photo.id)}
                className="zoom-frame group mb-6 block w-full break-inside-avoid rounded-2xl text-left cursor-pointer"
              >
                <img
                  src={resizeUrl(photo.url, 1600)}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="zoom-image h-auto"
                />

                <div className="pointer-events-none absolute inset-0 bg-neutral-950/0 transition-colors duration-500 group-hover:bg-neutral-950/15" />
              </button>
            ))}
          </div>
        ) : (
          /* Cuadrícula clásica uniforme con zoom suave */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {project.photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openViewer(photo.id)}
                className="zoom-frame group aspect-[4/3] rounded-2xl text-left cursor-pointer"
              >
                <img
                  src={resizeUrl(photo.url, 1600)}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="zoom-image"
                />

                <div className="pointer-events-none absolute inset-0 bg-neutral-950/0 transition-colors duration-500 group-hover:bg-neutral-950/15" />
              </button>
            ))}
          </div>
        )}

        {/* Navegación al Siguiente Proyecto */}
        {nextProject && nextProject.slug !== project.slug && (
          <nav className="mt-24 border-t border-neutral-200/80 pt-16 dark:border-neutral-800">
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
              Siguiente serie
            </p>
            <Link
              to={`/proyecto/${nextProject.slug}`}
              className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/40 p-8 transition-all duration-500 hover:border-(--visora-accent) hover:bg-white/80 hover:shadow-2xl dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:hover:border-(--visora-accent) dark:hover:bg-neutral-900/90 md:flex-row md:items-center"
            >
              <div>
                <span className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-(--visora-accent)">
                  Explorar proyecto →
                </span>
                <h2 className="text-3xl font-light text-neutral-900 transition-colors group-hover:text-(--visora-accent) dark:text-white md:text-4xl">
                  {nextProject.title}
                </h2>
                {nextProject.description && (
                  <p className="mt-2 line-clamp-2 max-w-xl text-sm text-neutral-500 dark:text-neutral-400">
                    {nextProject.description}
                  </p>
                )}
              </div>

              {nextProject.cover && (
                <div className="zoom-frame h-28 w-44 shrink-0 rounded-2xl">
                  <img
                    src={resizeUrl(nextProject.cover, 640)}
                    alt={nextProject.title}
                    className="zoom-image"
                  />
                </div>
              )}
            </Link>
          </nav>
        )}
      </div>

      {/* Visor Lightbox */}
      {viewerPhoto && (
        <PhotoViewer
          imageUrl={viewerPhoto.url}
          title={viewerPhoto.title}
          currentIndex={viewerIndex ?? 0}
          totalPhotos={project.photos.length}
          hasPrevious={(viewerIndex ?? 0) > 0}
          hasNext={(viewerIndex ?? 0) < project.photos.length - 1}
          onPrevious={showPrevious}
          onNext={showNext}
          onClose={closeViewer}
        />
      )}
    </main>
  );
}

export default ProjectPage;
