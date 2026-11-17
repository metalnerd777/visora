import { useEffect, useRef, useState } from "react";

import { usePortfolio } from "../lib/usePortfolio";
import { applyWatermark, loadImageWithCors } from "../lib/watermark";
import { resizeUrl } from "../lib/image";

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
  const [zoomedForUrl, setZoomedForUrl] = useState<string | null>(null);
  const zoomed = zoomedForUrl === imageUrl;
  const toggleZoom = () =>
    setZoomedForUrl((prev) => (prev === imageUrl ? null : imageUrl));

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (zoomed) {
          setZoomedForUrl(null);
        } else {
          onClose();
        }
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
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext, zoomed]);

  const { settings } = usePortfolio();
  const {
    watermarkEnabled,
    watermarkStyle,
    watermarkOpacity,
    watermarkText,
  } = settings.privacy;
  const watermark = watermarkEnabled
    ? watermarkText.trim() || settings.general.brandName
    : "";

  const [markedUrl, setMarkedUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!watermark) return;

    loadImageWithCors(imageUrl)
      .then((img) => {
        if (!active) return;
        setMarkedUrl(
          applyWatermark(img, {
            text: watermark,
            style: watermarkStyle,
            opacity: watermarkOpacity,
          }),
        );
      })
      .catch(() => {
        if (!active) return;
        setMarkedUrl(null);
      });

    return () => {
      active = false;
    };
  }, [imageUrl, watermark, watermarkStyle, watermarkOpacity]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomed || e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      zoomed ||
      touchStartX.current === null ||
      touchStartY.current === null ||
      e.changedTouches.length !== 1
    ) {
      return;
    }

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX > 0 && hasPrevious) {
        onPrevious?.();
      } else if (deltaX < 0 && hasNext) {
        onNext?.();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/96 p-4 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Visor de imágenes"}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Controles superiores (Zoom y Cerrar) */}
      <div
        className="absolute right-6 top-6 z-30 flex items-center gap-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={toggleZoom}
          className="flex h-11 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-medium tracking-wider text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/25 active:scale-95"
          aria-label={zoomed ? "Alejar imagen" : "Acercar imagen"}
          title="Doble clic en la imagen para alternar zoom"
        >
          <span>{zoomed ? "1×" : "2×"}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/25 active:scale-95"
          aria-label="Cerrar visor"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Flecha Anterior */}
      {hasPrevious && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious?.();
          }}
          className="absolute left-4 md:left-6 top-1/2 z-30 flex h-12 w-12 md:h-13 md:w-13 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/25 active:scale-95"
          aria-label="Imagen anterior"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Imagen Principal */}
      <div
        className="flex max-h-full max-w-full flex-col items-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`overflow-auto rounded-lg transition-all duration-300 ${
            zoomed ? "max-h-[84vh] max-w-[94vw] cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onDoubleClick={toggleZoom}
        >
          <img
            src={watermark && markedUrl ? markedUrl : resizeUrl(imageUrl, 2400)}
            alt={title || "Imagen"}
            draggable={settings.privacy.protectImages ? false : undefined}
            onContextMenu={
              settings.privacy.protectImages
                ? (e) => e.preventDefault()
                : undefined
            }
            className={`rounded-lg object-contain shadow-2xl transition-transform duration-300 ${
              zoomed
                ? "max-h-none max-w-none w-[160vw] sm:w-[130vw] md:w-[115vw]"
                : "max-h-[80vh] max-w-[90vw]"
            }`}
          />
        </div>

        {/* Ficha técnica minimalista inferior */}
        <div className="mt-5 flex items-center gap-4 rounded-full border border-white/15 bg-neutral-900/80 px-6 py-2 text-xs tracking-wider text-white/90 backdrop-blur-xl shadow-lg">
          {title && (
            <>
              <span className="font-light">{title}</span>
              <span className="h-3 w-px bg-white/20" />
            </>
          )}

          <span className="font-mono text-white/70">
            {currentIndex + 1} // {totalPhotos}
          </span>
        </div>
      </div>

      {/* Flecha Siguiente */}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className="absolute right-4 md:right-6 top-1/2 z-30 flex h-12 w-12 md:h-13 md:w-13 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/25 active:scale-95"
          aria-label="Siguiente imagen"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default PhotoViewer;
