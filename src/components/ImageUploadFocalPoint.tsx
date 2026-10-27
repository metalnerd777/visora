import { useCallback, useRef, useState } from "react";
import { processImage, formatBytes } from "../lib/image";
import { useImageDrop } from "../lib/useImageDrop";
import { ImageProcessingIndicator, type ProcessingStatus } from "./ImageProcessingIndicator";
import { heroGradientBackground, heroGradientFor } from "../lib/appearance";

function ImageUploadFocalPoint({
  label,
  image,
  focusX = 50,
  focusY = 50,
  onImage,
  onFocusChange,
  onRemove,
  onCrop,
  className = "h-52 sm:h-72",
  showGradient = false,
  gradientId,
}: {
  label: string;
  image?: string;
  focusX?: number;
  focusY?: number;
  onImage: (url: string) => void;
  onFocusChange: (x: number, y: number) => void;
  onRemove: () => void;
  onCrop?: () => void;
  className?: string;
  showGradient?: boolean;
  gradientId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [status, setStatus] = useState<ProcessingStatus>({ state: "idle" });

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setStatus({ state: "loading", message: `Optimizando ${formatBytes(file.size)}…` });
    try {
      const result = await processImage(file);
      onImage(result.url);
      setStatus({
        state: "done",
        originalSize: result.originalSize,
        finalSize: result.finalSize,
      });
    } catch (err) {
      setStatus({ state: "error", message: (err as Error).message || "Error al procesar la imagen" });
    }
  };

  const { isDragging, dragProps } = useImageDrop(handleFiles);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const setFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const container = layerRef.current?.parentElement;
      if (!container) return;

      const img = container.querySelector("img");
      if (!img) return;

      const imgRect = img.getBoundingClientRect();
      if (imgRect.width === 0 || imgRect.height === 0) return;

      const px = ((clientX - imgRect.left) / imgRect.width) * 100;
      const py = ((clientY - imgRect.top) / imgRect.height) * 100;

      onFocusChange(
        Math.min(100, Math.max(0, Math.round(px))),
        Math.min(100, Math.max(0, Math.round(py))),
      );
    },
    [onFocusChange],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) setFromPointer(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
        {label}
      </label>

      {image ? (
        <>
          <div
            className={`relative overflow-hidden rounded-2xl ${showGradient && gradientId ? "" : "bg-black/40"} ${className}`}
            style={
              showGradient && gradientId
                ? { background: heroGradientBackground(heroGradientFor(gradientId)) }
                : undefined
            }
          >
            {showGradient && gradientId && (
              <div
                aria-hidden="true"
                className="absolute inset-0 z-0"
                style={{ background: heroGradientBackground(heroGradientFor(gradientId)) }}
              />
            )}
            <img
              src={image}
              alt="Preview"
              draggable={false}
              className="pointer-events-none relative z-10 block h-full w-full object-contain"
            />

            {/* Capa interactiva para marcar el punto */}
            <div
              ref={layerRef}
              role="button"
              tabIndex={0}
              aria-label="Marcar el punto de importancia haciendo clic o arrastrando"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onKeyDown={(e) => {
                const step = 5;
                let nx = focusX;
                let ny = focusY;
                if (e.key === "ArrowLeft") nx -= step;
                else if (e.key === "ArrowRight") nx += step;
                else if (e.key === "ArrowUp") ny -= step;
                else if (e.key === "ArrowDown") ny += step;
                else return;
                e.preventDefault();
                onFocusChange(
                  Math.min(100, Math.max(0, nx)),
                  Math.min(100, Math.max(0, ny)),
                );
              }}
              className="absolute inset-0 z-20 cursor-crosshair touch-none outline-none focus-visible:ring-2 focus-visible:ring-(--visora-accent) select-none"
            >
              {/* Líneas de referencia */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{ left: `${focusX}%`, top: 0, bottom: 0, transform: "translateX(-50%)" }}
              >
                <div className="h-full w-px bg-white/90 drop-shadow-[0_0_2px_rgba(0,0,0,0.9)]" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{ top: `${focusY}%`, left: 0, right: 0, transform: "translateY(-50%)" }}
              >
                <div className="h-px w-full bg-white/90 drop-shadow-[0_0_2px_rgba(0,0,0,0.9)]" />
              </div>

              {/* Marcador de cruz */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${focusX}%`, top: `${focusY}%` }}
              >
                <div className="relative h-7 w-7">
                  <div className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-[0_0_3px_rgba(0,0,0,0.95)]" />
                  <div className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-[0_0_3px_rgba(0,0,0,0.95)]" />
                  <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/30 backdrop-blur-[1px] shadow-[0_0_4px_rgba(0,0,0,0.9)]" />
                </div>
              </div>
            </div>

            {/* Punto actual + centrar */}
            <div className="absolute right-3 top-3 z-30 flex items-center gap-2">
              <span className="rounded-full border border-white/25 bg-black/50 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/80 backdrop-blur-md">
                Punto {focusX}% · {focusY}%
              </span>
              <button
                type="button"
                onClick={() => onFocusChange(50, 50)}
                title="Centrar"
                aria-label="Centrar punto de importancia"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/80 backdrop-blur-md transition-colors hover:border-white/60 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m13.07-5.07.01.01M7.93 19.07l.01.01M17 17l.01.01M7 7l.01.01" />
                </svg>
              </button>
            </div>

            {/* Acciones */}
            <div className="absolute bottom-4 left-4 z-30 flex gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-black/60">
                Cambiar
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    resetInput();
                    if (f) void handleFiles([f]);
                  }}
                />
              </label>

              {onCrop && (
                <button
                  type="button"
                  onClick={onCrop}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-black/60"
                >
                  Recortar
                </button>
              )}

              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-red-400/60 hover:bg-black/60"
              >
                Eliminar
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          {...dragProps}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-colors ${
            isDragging
              ? "border-[#7C6CFF] bg-[#7C6CFF]/10"
              : "border-neutral-200 bg-neutral-50/50 dark:border-[#27243A] dark:bg-[#0B0A14]/30"
          } ${className} cursor-pointer`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-neutral-300 dark:text-[#4A4468]">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>

          {isDragging ? (
            <p className="text-xs uppercase tracking-[0.15em] text-[#7C6CFF]">
              Suelta la imagen
            </p>
          ) : (
            <>
              <p className="pointer-events-none text-xs uppercase tracking-[0.15em] text-neutral-400 dark:text-[#6B6488]">
                Arrastra la imagen aquí o haz clic
              </p>
              <label
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
                onClick={(e) => e.stopPropagation()}
              >
                Subir imagen
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    resetInput();
                    if (f) void handleFiles([f]);
                  }}
                />
              </label>
              <p className="pointer-events-none text-[11px] text-neutral-400 dark:text-[#6B6488]">
                JPG, PNG, WebP · máx 90 MB
              </p>
            </>
          )}
        </div>
      )}

      {image && (
        <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
          Haz clic o arrastra sobre la imagen para marcar el punto de
          importancia. En móvil el recorte se centra en este punto.
        </p>
      )}

      <ImageProcessingIndicator status={status} />
    </div>
  );
}

export default ImageUploadFocalPoint;