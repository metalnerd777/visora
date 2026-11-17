import { useState } from "react";
import { Link } from "react-router-dom";

import PhotoViewer from "../../../components/PhotoViewer";

import { usePortfolio } from "../../../lib/usePortfolio";
import { useAdmin } from "../../../lib/useAdmin";
import { usePhotoViewer } from "../../../lib/usePhotoViewer";
import { resizeUrl } from "../../../lib/image";
import { isSafeUrl } from "../../../lib/validation";

import type { ProjectPageProps } from "../../types";

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

function EditorialProject({ project, onBack }: ProjectPageProps) {
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
    <main>
      {/* Cabecera del proyecto con voz de revista de arte */}
      <header className="border-b border-double border-[#1C1C1F]/20 px-6 py-14 md:px-10 md:py-20 dark:border-[#E9E6DF]/20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="group flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/50 transition-colors hover:text-black dark:text-[#F3EFE6]/50 dark:hover:text-[#F3EFE6]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <span>Índice de obras</span>
            </button>

            {!requiresPin && project.photos.length > 1 && (
              <div className="flex items-center gap-1 border border-black/15 bg-black/5 p-0.5 text-[11px] uppercase tracking-widest dark:border-[#F3EFE6]/15 dark:bg-[#F3EFE6]/5">
                <button
                  type="button"
                  onClick={() => setLayoutMode("masonry")}
                  className={`px-3 py-1 font-semibold transition-colors ${
                    layoutMode === "masonry"
                      ? "bg-black text-white dark:bg-[#F3EFE6] dark:text-black"
                      : "text-black/60 hover:text-black dark:text-[#F3EFE6]/60 dark:hover:text-white"
                  }`}
                >
                  Flujo Proporcional
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("grid")}
                  className={`px-3 py-1 font-semibold transition-colors ${
                    layoutMode === "grid"
                      ? "bg-black text-white dark:bg-[#F3EFE6] dark:text-black"
                      : "text-black/60 hover:text-black dark:text-[#F3EFE6]/60 dark:hover:text-white"
                  }`}
                >
                  Retícula
                </button>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between gap-8">
            <div>
              {(project.category ||
                (admin && project.visibility === "unlisted") ||
                (admin && project.pin)) && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {project.category && (
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-black/55 dark:text-[#F3EFE6]/55">
                      {project.category}
                    </span>
                  )}
                  {admin && project.visibility === "unlisted" && (
                    <span className="border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-700 dark:text-amber-300">
                      Oculto · Solo con enlace
                    </span>
                  )}
                  {admin && project.pin && (
                    <span className="border border-black/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-black/70 dark:border-white/20 dark:text-white/70">
                      🔒 PIN: {project.pin}
                    </span>
                  )}
                </div>
              )}

              <h1 className="max-w-3xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-[#F3EFE6] sm:text-5xl md:text-6xl">
                {project.title}
              </h1>
            </div>

            <span className="hidden shrink-0 items-center gap-3 pb-2 md:flex">
              <span className="h-px w-10 bg-black/30 dark:bg-[#F3EFE6]/30" />
              <span className="font-mono text-sm font-semibold tracking-wider text-black/50 dark:text-[#F3EFE6]/50">
                VOL. {project.photos.length.toString().padStart(2, "0")}
              </span>
            </span>
          </div>

          {project.description && (
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/75 dark:text-[#F3EFE6]/75">
              {project.description}
            </p>
          )}

          {/* Ficha técnica editorial */}
          {hasSpecs ? (
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[#1C1C1F]/15 pt-6 sm:grid-cols-4 dark:border-[#E9E6DF]/15">
              {project.client && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/45 dark:text-[#F3EFE6]/45">
                    Cliente / Comisión
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-black dark:text-[#F3EFE6]">
                    {project.client}
                  </dd>
                </div>
              )}

              {project.role && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/45 dark:text-[#F3EFE6]/45">
                    Dirección / Rol
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-black dark:text-[#F3EFE6]">
                    {project.role}
                  </dd>
                </div>
              )}

              {project.year && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/45 dark:text-[#F3EFE6]/45">
                    Año
                  </dt>
                  <dd className="mt-1.5 font-mono text-sm font-semibold text-black dark:text-[#F3EFE6]">
                    {project.year}
                  </dd>
                </div>
              )}

              {project.externalUrl && isSafeUrl(project.externalUrl) && (
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/45 dark:text-[#F3EFE6]/45">
                    Referencia
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-(--visora-accent) underline"
                    >
                      <span>Ver publicación</span>
                      <span>↗</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-black/45 dark:text-[#F3EFE6]/45">
              Registro // {project.photos.length}{" "}
              {project.photos.length === 1
                ? siteTexts.workNounSingular
                : siteTexts.workNounPlural}
            </p>
          )}
        </div>
      </header>

      {/* Galería Editorial o Pantalla de PIN */}
      {requiresPin ? (
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-md border border-[#1C1C1F]/20 bg-white p-8 text-center dark:border-[#E9E6DF]/20 dark:bg-[#0B0A14]">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/50 dark:text-[#F3EFE6]/50">
              Archivo Reservado
            </p>
            <h2 className="mt-3 text-2xl font-semibold uppercase text-black dark:text-[#F3EFE6]">
              Acceso con Código
            </h2>
            <p className="mt-2 text-sm text-black/65 dark:text-[#F3EFE6]/65">
              Ingresa el PIN de cliente para consultar las láminas de esta edición.
            </p>

            <form onSubmit={handlePinSubmit} className="mt-6 flex flex-col gap-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="PIN DE ACCESO"
                autoFocus
                className="w-full border border-black/25 bg-transparent px-4 py-3 text-center font-mono text-sm tracking-widest outline-none focus:border-black dark:border-[#F3EFE6]/25 dark:text-[#F3EFE6] dark:focus:border-white"
              />
              {pinError && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Código incorrecto.
                </p>
              )}
              <button
                type="submit"
                className="mt-1 bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-neutral-800 dark:bg-[#F3EFE6] dark:text-black dark:hover:bg-white"
              >
                Abrir edición
              </button>
            </form>
          </div>
        </section>
      ) : (
        project.photos.length > 0 && (
          <section className="px-6 py-14 md:px-10 md:py-20">
            <div className="mx-auto max-w-7xl">
              {layoutMode === "masonry" ? (
                /* Muro Masonry que respeta la proporción original sin recortar */
                <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 [column-fill:_balance]">
                  {project.photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => openViewer(photo.id)}
                      className="zoom-frame group mb-8 block w-full break-inside-avoid border border-[#1C1C1F]/15 bg-white text-left cursor-pointer dark:border-[#E9E6DF]/15 dark:bg-[#0B0A14]"
                    >
                      <div className="overflow-hidden">
                        <img
                          src={resizeUrl(photo.url, 1600)}
                          alt={photo.title}
                          loading="lazy"
                          decoding="async"
                          className="zoom-image h-auto"
                        />
                      </div>

                      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

                      <div className="pointer-events-none flex items-center justify-between border-t border-[#1C1C1F]/10 px-4 py-2.5 text-[11px] uppercase tracking-widest text-black/60 dark:border-[#E9E6DF]/10 dark:text-[#F3EFE6]/60">
                        <span className="font-mono">
                          FIG. {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="truncate pl-3 font-medium">
                          {photo.title || "Lámina sin título"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Retícula de revista con gap fino */
                <div className="grid grid-cols-1 gap-px bg-[#1C1C1F]/15 sm:grid-cols-2 lg:grid-cols-3 dark:bg-[#E9E6DF]/15">
                  {project.photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => openViewer(photo.id)}
                      className="zoom-frame group aspect-[4/3] bg-white text-left cursor-pointer dark:bg-[#0B0A14]"
                    >
                      <img
                        src={resizeUrl(photo.url, 1600)}
                        alt={photo.title}
                        loading="lazy"
                        decoding="async"
                        className="zoom-image"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />

                      <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.2em] text-black bg-white/90 px-2 py-1 backdrop-blur-sm dark:bg-black/80 dark:text-white">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      )}

      {/* Siguiente entrega editorial */}
      {nextProject && nextProject.slug !== project.slug && (
        <section className="border-t border-double border-[#1C1C1F]/20 px-6 py-20 md:px-10 dark:border-[#E9E6DF]/20">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
              Siguiente serie editorial
            </p>

            <Link
              to={`/proyecto/${nextProject.slug}`}
              className="group flex flex-col justify-between gap-8 border border-[#1C1C1F]/15 bg-white p-8 transition-all duration-500 hover:border-black hover:shadow-2xl dark:border-[#E9E6DF]/15 dark:bg-[#0B0A14] dark:hover:border-white md:flex-row md:items-center md:p-12"
            >
              <div className="max-w-2xl">
                <span className="mb-3 block font-mono text-xs uppercase tracking-[0.25em] text-(--visora-accent)">
                  Siguiente monografía →
                </span>
                <h2 className="text-3xl font-semibold uppercase leading-tight tracking-tight text-black transition-colors group-hover:text-(--visora-accent) dark:text-[#F3EFE6] sm:text-4xl md:text-5xl">
                  {nextProject.title}
                </h2>
                {nextProject.description && (
                  <p className="mt-4 line-clamp-2 text-base text-black/60 dark:text-[#F3EFE6]/60">
                    {nextProject.description}
                  </p>
                )}
              </div>

              {nextProject.cover && (
                <div className="zoom-frame h-32 w-52 shrink-0 border border-[#1C1C1F]/15 dark:border-[#E9E6DF]/15">
                  <img
                    src={resizeUrl(nextProject.cover, 640)}
                    alt={nextProject.title}
                    className="zoom-image"
                  />
                </div>
              )}
            </Link>
          </div>
        </section>
      )}

      {/* Visor */}
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

export default EditorialProject;
