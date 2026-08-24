import { useState } from "react";

import PhotoViewer from "../components/PhotoViewer";

import type { Gallery as GalleryType } from "../types/portfolio";

interface GalleryProps {
  gallery: GalleryType;
  onBack: () => void;
}

function Gallery({ gallery, onBack }: GalleryProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const showPrevious = () => {
    setViewerIndex((current) => {
      if (current === null || current <= 0) return current;

      return current - 1;
    });
  };

  const showNext = () => {
    setViewerIndex((current) => {
      if (current === null || current >= gallery.photos.length - 1) {
        return current;
      }

      return current + 1;
    });
  };

  return (
    <main className="bg-white px-6 pt-10 pb-20 text-neutral-900 transition-colors dark:bg-[#0B0A14] dark:text-[#F5F3FF] md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-7xl">
        {/* Volver */}
        <button
          type="button"
          onClick={onBack}
          className="mb-10 text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:text-[#7C6CFF]"
        >
          ← Volver al portfolio
        </button>

        {/* Encabezado */}
        <header className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
            Portfolio
          </p>

          <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-6xl">
            {gallery.title}
          </h1>

          {gallery.description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              {gallery.description}
            </p>
          )}

          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            {gallery.photos.length} fotografías
          </p>
        </header>

        {/* Fotografías */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setViewerIndex(index)}
              className="group relative aspect-[4/3] overflow-hidden"
            >
              <img
                src={`${photo.url}?auto=format&w=1600&q=85`}
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

      {/* PhotoViewer */}
      {viewerIndex !== null && gallery.photos[viewerIndex] && (
        <PhotoViewer
          imageUrl={gallery.photos[viewerIndex].url}
          title={gallery.photos[viewerIndex].title}
          currentIndex={viewerIndex}
          totalPhotos={gallery.photos.length}
          hasPrevious={viewerIndex > 0}
          hasNext={viewerIndex < gallery.photos.length - 1}
          onPrevious={showPrevious}
          onNext={showNext}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </main>
  );
}

export default Gallery;
