import { useState } from "react";
import PhotoViewer from "./PhotoViewer";
import {
  galleries,
  favorites,
  photographer,
  featuredPhotos,
} from "../data/portfolio";
import MasonryGallery from "./MasonryGallery";
import Hero from "./Hero";
import GalleryCard from "./GalleryCard";

function Content() {
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const [viewerPhotos, setViewerPhotos] = useState<typeof favorites>([]);

  const currentGallery = galleries.find(
    (gallery) => gallery.id === selectedGallery,
  );

  const currentPhotos = currentGallery?.photos ?? [];

  const selectedIndex = viewerPhotos.findIndex(
    (photo) => photo.id === selectedPhoto,
  );

  const selectedPhotoData =
    selectedIndex !== -1 ? viewerPhotos[selectedIndex] : null;

  const openGallery = (galleryId: string) => {
    const gallery = galleries.find((gallery) => gallery.id === galleryId);

    if (!gallery) return;

    setViewerPhotos(gallery.photos);
    setSelectedGallery(galleryId);
  };

  const closeGallery = () => {
    setSelectedGallery(null);
    setSelectedPhoto(null);
    setViewerPhotos([]);
  };

  const openFavorite = (photoId: number) => {
    setViewerPhotos(favorites);
    setSelectedPhoto(photoId);
  };

  const openGalleryPhoto = (photoId: number) => {
    setViewerPhotos(currentPhotos);
    setSelectedPhoto(photoId);
  };

  const goToPrevious = () => {
    if (selectedIndex <= 0) return;

    setSelectedPhoto(viewerPhotos[selectedIndex - 1].id);
  };

  const goToNext = () => {
    if (selectedIndex === -1 || selectedIndex >= viewerPhotos.length - 1) {
      return;
    }

    setSelectedPhoto(viewerPhotos[selectedIndex + 1].id);
  };

  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* Destacadas */}
      <section
        id="featured"
        className="border-t border-neutral-200 px-6 py-24 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
              Selección destacada
            </p>

            <h2 className="text-3xl font-light md:text-4xl">
              Una mirada a mi trabajo
            </h2>

            <p className="mt-4 leading-relaxed text-neutral-500">
              Una selección de fotografías que representan mi estilo y mi forma
              de trabajar.
            </p>
          </div>

          <MasonryGallery
            photos={featuredPhotos}
            onPhotoClick={(photoId) => {
              setViewerPhotos(featuredPhotos);
              setSelectedPhoto(photoId);
            }}
          />
        </div>
      </section>
      {/* Galerías */}
      <section
        id="gallery"
        className="border-t border-neutral-200 px-6 py-24 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          {/* Encabezado */}
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
              Portfolio
            </p>

            <h2 className="text-3xl font-light tracking-tight md:text-4xl">
              Todas mis historias
            </h2>

            <p className="mt-5 leading-relaxed text-neutral-500">
              Explora mis diferentes trabajos y descubre las historias detrás de
              cada fotografía.
            </p>
          </div>

          {/* Galerías */}
          <div className="grid gap-6 md:grid-cols-2">
            {galleries.map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                onClick={() => {
                  setViewerPhotos(gallery.photos);
                  setSelectedPhoto(gallery.photos[0].id);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Galería seleccionada */}
      {currentGallery && (
        <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-24 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Galería
                </p>

                <h2 className="text-3xl font-light md:text-4xl">
                  {currentGallery.title}
                </h2>

                <p className="mt-3 text-neutral-500">
                  {currentGallery.description}
                </p>
              </div>

              <button
                type="button"
                onClick={closeGallery}
                className="shrink-0 border border-neutral-300 px-5 py-2 text-sm transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                Cerrar
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => openGalleryPhoto(photo.id)}
                  className="group overflow-hidden text-left"
                >
                  <img
                    src={`${photo.url}?auto=format&fit=crop&w=1200&q=85`}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Favoritas */}
      <section
        id="favorites"
        className="border-t border-neutral-200 px-6 py-24 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
              Selección personal
            </p>

            <h2 className="text-3xl font-light md:text-4xl">Mis favoritas</h2>

            <p className="mt-4 leading-relaxed text-neutral-500">
              Una selección de fotografías que representan especialmente mi
              trabajo y mi forma de ver el mundo.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {favorites.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openFavorite(photo.id)}
                className="group overflow-hidden text-left"
              >
                <img
                  src={`${photo.url}?auto=format&fit=crop&w=1200&q=85`}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <p className="mt-4 text-sm text-neutral-600">{photo.title}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre mí */}
      <section
        id="about"
        className="border-t border-neutral-200 px-6 py-24 md:px-10"
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Sobre mí
          </p>

          <h2 className="text-3xl font-light md:text-4xl">
            {photographer.aboutTitle}
          </h2>

          <p className="mt-6 leading-relaxed text-neutral-600">
            {photographer.aboutDescription}
          </p>
        </div>
      </section>

      {/* Contacto */}
      <section
        id="contact"
        className="border-t border-neutral-200 px-6 py-24 text-center md:px-10"
      >
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
          Contacto
        </p>

        <h2 className="text-3xl font-light md:text-4xl">¿Trabajamos juntos?</h2>

        <a
          href={`mailto:${photographer.email}`}
          className="mt-8 inline-block border border-neutral-900 px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-neutral-900 hover:text-white"
        >
          Escribirme
        </a>
      </section>

      {/* Visor */}
      {selectedPhotoData && (
        <PhotoViewer
          imageUrl={selectedPhotoData.url}
          title={selectedPhotoData.title}
          onClose={() => setSelectedPhoto(null)}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={selectedIndex > 0}
          hasNext={selectedIndex < viewerPhotos.length - 1}
          currentIndex={selectedIndex}
          totalPhotos={viewerPhotos.length}
        />
      )}
    </main>
  );
}

export default Content;
