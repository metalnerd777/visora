import { useEffect } from "react";

interface PhotoViewerProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex: number;
  totalPhotos: number;
}

function PhotoViewer({
  imageUrl,
  title,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex,
  totalPhotos,
}: PhotoViewerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft" && hasPrevious) {
        onPrevious?.();
      }

      if (event.key === "ArrowRight" && hasNext) {
        onNext?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Visor de fotografía"}
    >
      {/* Cerrar */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-5 z-20 text-4xl font-light text-white transition-opacity hover:opacity-60"
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Anterior */}
      {hasPrevious && (
        <button
          type="button"
          onClick={onPrevious}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 p-4 text-5xl font-light text-white transition-opacity hover:opacity-60"
          aria-label="Fotografía anterior"
        >
          ‹
        </button>
      )}

      {/* Fotografía */}
      <div className="flex max-h-full max-w-full flex-col items-center">
        <img
          src={`${imageUrl}?auto=format&w=2400&q=85`}
          alt={title || "Fotografía"}
          className="max-h-[82vh] max-w-[90vw] object-contain"
        />

        <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
          {title && <span>{title}</span>}

          <span>
            {currentIndex + 1} / {totalPhotos}
          </span>
        </div>
      </div>

      {/* Siguiente */}
      {hasNext && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 p-4 text-5xl font-light text-white transition-opacity hover:opacity-60"
          aria-label="Siguiente fotografía"
        >
          ›
        </button>
      )}
    </div>
  );
}

export default PhotoViewer;
