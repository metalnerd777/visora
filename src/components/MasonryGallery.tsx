import type { Photo } from "../types/portfolio";

interface MasonryGalleryProps {
  photos: Photo[];
  onPhotoClick: (photoId: string) => void;
}

const DESKTOP_SPANS: Record<number, number[]> = {
  1: [1],
  2: [2, 2],
  3: [1, 1, 1],
  4: [1, 1, 1, 1],
  5: [2, 1, 1, 1, 1],
  6: [1, 1, 1, 1, 1, 1],
  7: [2, 1, 2, 1, 1, 1, 1],
  8: [2, 1, 2, 1, 2, 2, 1, 1],
  9: [2, 1, 2, 1, 2, 1, 1, 1, 1],
  10: [2, 2, 2, 2, 2, 2, 1, 1, 1, 1],
};

const DESKTOP_COLS: Record<number, number> = {
  1: 1, 2: 2, 3: 3, 4: 4,
  5: 3, 6: 3, 7: 3,
  8: 4, 9: 4, 10: 4,
};

const MOBILE_SPANS: Record<number, number[]> = {
  1: [1],
  2: [2, 2],
  3: [2, 1, 1],
  4: [2, 1, 2, 1],
  5: [2, 1, 1, 2, 2],
  6: [2, 1, 2, 1, 1, 1],
  7: [2, 1, 2, 1, 2, 1, 1],
  8: [2, 1, 2, 1, 2, 1, 2, 1],
  9: [2, 1, 2, 1, 2, 2, 1, 2, 1],
  10: [2, 1, 2, 1, 1, 2, 1, 1, 2, 1],
};

function getLayout(count: number) {
  const n = Math.min(count, 10);
  return {
    desktopSpans: DESKTOP_SPANS[n] || [],
    desktopCols: DESKTOP_COLS[n] || 4,
    mobileSpans: MOBILE_SPANS[n] || [],
  };
}

function MasonryGallery({ photos, onPhotoClick }: MasonryGalleryProps) {
  const items = photos.slice(0, 10);
  const { desktopSpans, desktopCols, mobileSpans } = getLayout(items.length);

  const gridStyle = `
    .masonry-grid {
      display: grid;
      gap: 1rem;
      grid-auto-rows: minmax(0, 1fr);
      height: clamp(420px, 60vw, 720px);
    }
    .masonry-item { grid-row: span var(--span-mobile); }
    @media (min-width: 768px) {
      .masonry-grid { grid-template-columns: repeat(${desktopCols}, minmax(0, 1fr)); }
      .masonry-item { grid-row: span var(--span-desktop); }
    }
    @media (max-width: 767px) {
      .masonry-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  `;

  return (
    <>
      <style>{gridStyle}</style>
      <div className="masonry-grid">
        {items.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => onPhotoClick(photo.id)}
            className="masonry-item group relative min-h-0 overflow-hidden rounded-2xl"
            style={{
              ["--span-desktop" as string]: desktopSpans[index],
              ["--span-mobile" as string]: mobileSpans[index],
            }}
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
    </>
  );
}

export default MasonryGallery;
