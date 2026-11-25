import type { Photo } from "../types/portfolio";
import { resizeUrl } from "../lib/image";
import { usePortfolio } from "../lib/usePortfolio";

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
  const { settings } = usePortfolio();
  const items = photos.slice(0, 10);

  if (items.length === 0) return null;

  const { desktopSpans, desktopCols, mobileSpans } = getLayout(items.length);
  const isProtected = settings.privacy.protectImages;

  const gridStyle = `
    .masonry-grid {
      display: grid;
      gap: 1.25rem;
      grid-auto-rows: minmax(0, 1fr);
      height: clamp(440px, 62vw, 760px);
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
            onContextMenu={isProtected ? (e) => e.preventDefault() : undefined}
            className={`masonry-item zoom-frame group min-h-0 rounded-2xl cursor-pointer ${
              isProtected ? "select-none" : ""
            }`}
            style={{
              ["--span-desktop" as string]: desktopSpans[index],
              ["--span-mobile" as string]: mobileSpans[index],
            }}
          >
            <img
              src={resizeUrl(photo.url, 1600)}
              alt={photo.title}
              loading="lazy"
              decoding="async"
              draggable={!isProtected}
              className="zoom-image pointer-events-none"
            />

            <div className="pointer-events-none absolute inset-0 bg-neutral-950/0 transition-colors duration-500 group-hover:bg-neutral-950/15" />
          </button>
        ))}
      </div>
    </>
  );
}

export default MasonryGallery;
