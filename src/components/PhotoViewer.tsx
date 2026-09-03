import { useEffect, useState } from "react";

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Visor de imágenes"}
      onClick={onClose}
    >
      {/* Cerrar */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
        aria-label="Cerrar"
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

      {/* Anterior */}
      {hasPrevious && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious?.();
          }}
          className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          aria-label="Imagen anterior"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Imagen */}
      <div
        className="flex max-h-full max-w-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={watermark && markedUrl ? markedUrl : resizeUrl(imageUrl, 2400)}
          alt={title || "Imagen"}
          className="max-h-[82vh] max-w-[90vw] rounded-xl object-contain"
        />

        <div className="mt-4 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-xs tracking-wider text-white/85 backdrop-blur-md">
          {title && <span className="mr-3">{title}</span>}

          <span>
            {currentIndex + 1} / {totalPhotos}
          </span>
        </div>
      </div>

      {/* Siguiente */}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          aria-label="Siguiente imagen"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default PhotoViewer;
