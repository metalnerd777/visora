import { useState } from "react";
import PhotoViewer from "./PhotoViewer";

const photos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1519741497674-611481863552",
    title: "Wedding",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    title: "Portrait",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    title: "Landscape",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    title: "Moment",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    title: "Portrait",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624",
    title: "Nature",
  },
];

function Content() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const selectedIndex = photos.findIndex((photo) => photo.id === selectedPhoto);

  const selectedPhotoData = selectedIndex !== -1 ? photos[selectedIndex] : null;

  const goToPrevious = () => {
    if (selectedIndex <= 0) return;

    setSelectedPhoto(photos[selectedIndex - 1].id);
  };

  const goToNext = () => {
    if (selectedIndex === -1 || selectedIndex >= photos.length - 1) return;

    setSelectedPhoto(photos[selectedIndex + 1].id);
  };

  return (
    <main>
      {/* Hero */}
      <section
        id="home"
        className="flex min-h-[80vh] items-center justify-center px-6"
      >
        <div className="max-w-3xl text-center">
          <p className="mb-6 text-sm uppercase tracking-[0.3em] text-neutral-500">
            Fotógrafo
          </p>

          <h1 className="text-5xl font-light tracking-tight md:text-7xl">
            Alex Morgan
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-neutral-500">
            Fotografía documental, retratos y momentos que merecen ser
            recordados.
          </p>

          <a
            href="#gallery"
            className="mt-10 inline-block border border-neutral-900 px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-neutral-900 hover:text-white"
          >
            Ver portfolio
          </a>
        </div>
      </section>

      {/* Galería */}
      <section
        id="gallery"
        className="border-t border-neutral-200 px-6 py-24 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
              Portfolio
            </p>

            <h2 className="text-3xl font-light md:text-4xl">
              Selección de trabajos
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhoto(photo.id)}
                className="group block w-full overflow-hidden text-left"
              >
                <img
                  src={`${photo.url}?auto=format&fit=crop&w=1200&q=85`}
                  alt={photo.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
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
            Historias contadas a través de imágenes.
          </h2>

          <p className="mt-6 leading-relaxed text-neutral-600">
            Soy fotógrafo especializado en capturar momentos auténticos,
            personas y lugares. Mi objetivo es crear imágenes que conserven la
            emoción de cada historia.
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
          href="mailto:hello@example.com"
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
          hasNext={selectedIndex < photos.length - 1}
          currentIndex={selectedIndex}
          totalPhotos={photos.length}
        />
      )}
    </main>
  );
}

export default Content;
