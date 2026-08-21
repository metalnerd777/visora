import type { Photo } from "../types/portfolio";

interface MasonryGalleryProps {
  photos: Photo[];
  onPhotoClick: (photoId: number) => void;
}

function MasonryGallery({ photos, onPhotoClick }: MasonryGalleryProps) {
  const items = photos.slice(0, 8);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-3 md:h-[720px]">
      {items.map((photo, index) => {
        let layout = "";

        switch (index) {
          case 0:
            layout = "col-span-2 row-span-2";
            break;

          case 1:
            layout = "col-span-1 row-span-1";
            break;

          case 2:
            layout = "col-span-1 row-span-1";
            break;

          case 3:
            layout = "col-span-1 row-span-1";
            break;

          case 4:
            layout = "col-span-1 row-span-1";
            break;

          case 5:
            layout = "col-span-2 row-span-1";
            break;

          case 6:
            layout = "col-span-1 row-span-1";
            break;

          case 7:
            layout = "col-span-1 row-span-1";
            break;
        }

        return (
          <button
            key={photo.id}
            type="button"
            onClick={() => onPhotoClick(photo.id)}
            className={`group relative min-h-0 overflow-hidden ${layout}`}
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
        );
      })}
    </div>
  );
}

export default MasonryGallery;
