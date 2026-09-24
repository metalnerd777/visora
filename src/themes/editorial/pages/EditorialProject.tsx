import PhotoViewer from "../../../components/PhotoViewer";

import { usePortfolio } from "../../../lib/usePortfolio";
import { usePhotoViewer } from "../../../lib/usePhotoViewer";
import { resizeUrl } from "../../../lib/image";

import type { ProjectPageProps } from "../../types";

function EditorialProject({ project, onBack }: ProjectPageProps) {
  const { siteTexts } = usePortfolio();
  const { viewerIndex, openViewer, closeViewer, showPrevious, showNext } =
    usePhotoViewer(project.photos);

  const viewerPhoto =
    viewerIndex !== null ? project.photos[viewerIndex] : null;

  return (
    <main>
      {/* Cabecera del proyecto */}
      <header className="border-b border-[#1C1C1F]/15 px-6 py-14 md:px-10 md:py-20 dark:border-[#E9E6DF]/15">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/50 transition-colors hover:text-black dark:text-[#F3EFE6]/50 dark:hover:text-[#F3EFE6]"
          >
            <span>←</span>
            Volver al portfolio
          </button>

          <div className="flex items-end justify-between gap-8">
            <h1 className="max-w-3xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-[#F3EFE6] sm:text-5xl md:text-6xl">
              {project.title}
            </h1>

            <span className="hidden shrink-0 items-center gap-3 pb-2 md:flex">
              <span className="h-px w-10 bg-black/30 dark:bg-[#F3EFE6]/30" />
              <span className="text-sm font-semibold text-black/50 dark:text-[#F3EFE6]/50">
                Nº {project.photos.length
                  .toString()
                  .padStart(2, "0")}
              </span>
            </span>
          </div>

          {project.description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/65 dark:text-[#F3EFE6]/65">
              {project.description}
            </p>
          )}

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-black/45 dark:text-[#F3EFE6]/45">
            {project.photos.length}{" "}
            {project.photos.length === 1
              ? siteTexts.workNounSingular
              : siteTexts.workNounPlural}
          </p>
        </div>
      </header>

      {/* Galería */}
      {project.photos.length > 0 && (
        <section className="px-6 py-14 md:px-10 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-px bg-[#1C1C1F]/10 sm:grid-cols-2 lg:grid-cols-3 dark:bg-[#E9E6DF]/10">
              {project.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => openViewer(photo.id)}
                  className="group relative aspect-[4/3] overflow-hidden bg-white text-left dark:bg-[#0B0A14]"
                >
                  <img
                    src={resizeUrl(photo.url, 1600)}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />

                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/15" />

                  <span className="absolute bottom-3 left-3 bg-white/85 px-2 py-1 text-[10px] tracking-[0.2em] text-black backdrop-blur-sm dark:bg-black/70 dark:text-white">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
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