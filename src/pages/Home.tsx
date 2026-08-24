import { useState } from "react";

import Hero from "../components/Hero";
import MasonryGallery from "../components/MasonryGallery";
import GalleryCard from "../components/GalleryCard";
import PhotoViewer from "../components/PhotoViewer";

import { galleries, favorites, featuredPhotos } from "../data/portfolio";

import type { Photo } from "../types/portfolio";

function Home() {
  const [viewerPhotos, setViewerPhotos] = useState<Photo[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const openViewer = (photos: Photo[], photoId: number) => {
    const index = photos.findIndex((photo) => photo.id === photoId);

    if (index === -1) return;

    setViewerPhotos(photos);
    setViewerIndex(index);
  };

  const closeViewer = () => {
    setViewerIndex(null);
  };

  const showPrevious = () => {
    setViewerIndex((current) => {
      if (current === null || current <= 0) return current;

      return current - 1;
    });
  };

  const showNext = () => {
    setViewerIndex((current) => {
      if (current === null || current >= viewerPhotos.length - 1) {
        return current;
      }

      return current + 1;
    });
  };

  return (
    <>
      <Hero />

      {/* Selección destacada */}
      <section
        id="featured"
        className="border-t border-neutral-200 px-6 py-24 transition-colors dark:border-[#27243A] md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
              Selección destacada
            </p>

            <h2 className="text-3xl font-light text-neutral-900 dark:text-[#F5F3FF] md:text-4xl">
              Una mirada a mi trabajo
            </h2>

            <p className="mt-4 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              Una selección de fotografías que representan mi estilo y mi forma
              de trabajar.
            </p>
          </div>

          <MasonryGallery
            photos={featuredPhotos}
            onPhotoClick={(photoId) => openViewer(featuredPhotos, photoId)}
          />
        </div>
      </section>

      {/* Galerías */}
      <section
        id="gallery"
        className="border-t border-neutral-200 px-6 py-24 transition-colors dark:border-[#27243A] md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
              Portfolio
            </p>

            <h2 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-4xl">
              Todas mis historias
            </h2>

            <p className="mt-5 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              Explora mis diferentes trabajos y descubre las historias detrás de
              cada fotografía.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        </div>
      </section>

      {/* Favoritas */}
      <section
        id="favorites"
        className="border-t border-neutral-200 px-6 py-24 transition-colors dark:border-[#27243A] md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
              Selección personal
            </p>

            <h2 className="text-3xl font-light text-neutral-900 dark:text-[#F5F3FF] md:text-4xl">
              Mis favoritas
            </h2>

            <p className="mt-4 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              Algunas fotografías que tienen un significado especial para mí.
            </p>
          </div>

          <MasonryGallery
            photos={favorites}
            onPhotoClick={(photoId) => openViewer(favorites, photoId)}
          />
        </div>
      </section>

      {/* PhotoViewer */}
      {viewerIndex !== null && viewerPhotos[viewerIndex] && (
        <PhotoViewer
          imageUrl={viewerPhotos[viewerIndex].url}
          title={viewerPhotos[viewerIndex].title}
          currentIndex={viewerIndex}
          totalPhotos={viewerPhotos.length}
          hasPrevious={viewerIndex > 0}
          hasNext={viewerIndex < viewerPhotos.length - 1}
          onPrevious={showPrevious}
          onNext={showNext}
          onClose={closeViewer}
        />
      )}
    </>
  );
}

export default Home;
