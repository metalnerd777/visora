import { useRef, useState } from "react";
import { processImage, formatBytes } from "../lib/image";
import { useImageDrop } from "../lib/useImageDrop";
import { ImageProcessingIndicator, type ProcessingStatus } from "./ImageProcessingIndicator";

function ImageUpload({
  label,
  image,
  onImage,
  onRemove,
  className = "h-48 sm:h-64",
  allowMultiple = false,
  onCrop,
}: {
  label: string;
  image?: string;
  onImage: (url: string) => void;
  onRemove: () => void;
  className?: string;
  allowMultiple?: boolean;
  onCrop?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
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

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
        {label}
      </label>

      {image ? (
        <>
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={image}
              alt="Preview"
              className={`w-full object-cover ${className}`}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute bottom-4 left-4 flex gap-2">
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
              Suelta aquí{allowMultiple ? " las imágenes" : " la imagen"}
            </p>
          ) : (
            <>
              <p className="pointer-events-none text-xs uppercase tracking-[0.15em] text-neutral-400 dark:text-[#6B6488]">
                Arrastra{allowMultiple ? " las imágenes" : " la imagen"} aquí o haz clic
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
                  multiple={allowMultiple}
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    resetInput();
                    if (files.length > 0) void handleFiles(files);
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

      <ImageProcessingIndicator status={status} />
    </div>
  );
}

export default ImageUpload;
