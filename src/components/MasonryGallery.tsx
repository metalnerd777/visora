import type { Photo } from "../types/portfolio";

interface MasonryGalleryProps {
  photos: Photo[];
  onPhotoClick: (photoId: number) => void;
}

function MasonryGallery({ photos, onPhotoClick }: MasonryGalleryProps) {
  const items = photos.slice(0, 8);

  const layouts = [
    "col-span-2 aspect-square md:row-span-2 md:aspect-auto",
    "aspect-[4/3] md:aspect-auto",
    "aspect-[4/3] md:aspect-auto",
    "aspect-[4/3] md:aspect-auto",
    "aspect-[4/3] md:aspect-auto",
    "col-span-2 aspect-video md:aspect-auto",
    "aspect-[4/3] md:aspect-auto",
    "aspect-[4/3] md:aspect-auto",
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-3 md:h-[720px]">
      {items.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onPhotoClick(photo.id)}
          className={`group relative min-h-0 overflow-hidden rounded-2xl ${
            layouts[index] ?? "aspect-[4/3] md:aspect-auto"
          }`}
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
  );
}

export default MasonryGallery;
