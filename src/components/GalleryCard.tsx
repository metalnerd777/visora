import { useNavigate } from "react-router-dom";

import type { Gallery } from "../types/portfolio";

interface GalleryCardProps {
  gallery: Gallery;
}

function GalleryCard({ gallery }: GalleryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/galeria/${gallery.id}`)}
      className="group relative block w-full overflow-hidden text-left"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={`${gallery.cover}?auto=format&w=1800&q=85`}
          alt={gallery.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />

        {/* Información */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/70">
            {gallery.photos.length} fotografías
          </p>

          <h3 className="text-2xl font-light">{gallery.title}</h3>

          {gallery.description && (
            <p className="mt-2 max-w-md text-sm text-white/80">
              {gallery.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default GalleryCard;
