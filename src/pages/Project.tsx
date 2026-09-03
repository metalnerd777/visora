import { useState } from "react";

import PhotoViewer from "../components/PhotoViewer";

import { usePortfolio } from "../lib/usePortfolio";
import { resizeUrl } from "../lib/image";

import type { Project } from "../types/portfolio";

interface ProjectPageProps {
  project: Project;
  onBack: () => void;
}

function ProjectPage({ project, onBack }: ProjectPageProps) {
  const { siteTexts } = usePortfolio();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const showPrevious = () => {
    setViewerIndex((current) => {
      if (current === null || current <= 0) return current;

      return current - 1;
    });
  };

  const showNext = () => {
    setViewerIndex((current) => {
      if (current === null || current >= project.photos.length - 1) {
        return current;
      }

      return current + 1;
    });
  };

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-7xl">
        {/* Volver */}
        <button
          type="button"
          onClick={onBack}
          className="mb-10 text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:text-(--visora-accent)"
        >
          ← Volver al portfolio
        </button>

        {/* Encabezado */}
        <header className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
            Portfolio
          </p>

          <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-6xl">
            {project.title}
          </h1>

          {project.description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              {project.description}
            </p>
          )}

          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            {project.photos.length}{" "}
            {project.photos.length === 1
              ? siteTexts.workNounSingular
              : siteTexts.workNounPlural}
          </p>
        </header>

        {/* Imágenes */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setViewerIndex(index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <img
                src={resizeUrl(photo.url, 1600)}
                alt={photo.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
            </button>
          ))}
        </div>
      </div>

      {/* Visor */}
      {viewerIndex !== null && project.photos[viewerIndex] && (
        <PhotoViewer
          imageUrl={project.photos[viewerIndex].url}
          title={project.photos[viewerIndex].title}
          currentIndex={viewerIndex}
          totalPhotos={project.photos.length}
          hasPrevious={viewerIndex > 0}
          hasNext={viewerIndex < project.photos.length - 1}
          onPrevious={showPrevious}
          onNext={showNext}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </main>
  );
}

export default ProjectPage;
