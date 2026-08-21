import type { Gallery } from "../types/portfolio";

interface GalleryCardProps {
  gallery: Gallery;
  onClick: () => void;
}

function GalleryCard({ gallery, onClick }: GalleryCardProps) {
  const coverPhoto = gallery.photos[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative block h-[420px] w-full overflow-hidden text-left"
    >
      <img
        src={`${coverPhoto.url}?auto=format&w=1600&q=85`}
        alt={gallery.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Información */}
      <div className="absolute inset-x-0 bottom-0 p-7 text-white">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/60">
          {gallery.photos.length} fotografías
        </p>

        <h3 className="text-2xl font-light">{gallery.title}</h3>

        {gallery.description && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
            {gallery.description}
          </p>
        )}

        <span className="mt-5 inline-block text-xs uppercase tracking-[0.2em] text-white/80 transition-transform duration-300 group-hover:translate-x-1">
          Ver galería →
        </span>
      </div>
    </button>
  );
}

export default GalleryCard;
