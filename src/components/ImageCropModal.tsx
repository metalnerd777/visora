import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";

import Modal from "./Modal";
import { cropImage, type CroppedArea } from "../lib/cropImage";

const FREE_PRESETS: { label: string; value: number | null }[] = [
  { label: "Original", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:5", value: 4 / 5 },
  { label: "9:16", value: 9 / 16 },
];

function ImageCropModal({
  open,
  onClose,
  image,
  aspect,
  onSave,
  exportSize,
  onExport,
  free = false,
}: {
  open: boolean;
  onClose: () => void;
  image: string;
  aspect?: number;
  onSave?: (x: number, y: number) => void;
  exportSize?: { width: number; height: number };
  onExport?: (dataUrl: string) => void;
  free?: boolean;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<CroppedArea | null>(null);
  const [naturalAspect, setNaturalAspect] = useState(4 / 3);
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    if (!open || !free || !image) return;

    const img = new Image();

    img.onload = () => {
      setNaturalAspect(img.naturalWidth / img.naturalHeight);
      setRatio(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };

    img.src = image;
  }, [open, free, image]);

  const effectiveAspect = free ? (ratio ?? naturalAspect) : (aspect ?? 1);

  const handleCropComplete = useCallback(
    (_croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => {
      setCroppedPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSave = () => {
    if (free && onExport && croppedPixels) {
      const maxDim = Math.max(croppedPixels.width, croppedPixels.height);
      const scale = Math.min(1, 2400 / maxDim);

      const outputSize = {
        width: Math.round(croppedPixels.width * scale),
        height: Math.round(croppedPixels.height * scale),
      };

      cropImage(image, croppedPixels, outputSize)
        .then(onExport)
        .finally(() => onClose());
      return;
    }

    if (exportSize && onExport && croppedPixels) {
      cropImage(image, croppedPixels, exportSize)
        .then(onExport)
        .finally(() => onClose());
      return;
    }

    const aspectRatio = aspect ?? 1;

    if (croppedPixels) {
      const centerX = croppedPixels.x + croppedPixels.width / 2;
      const centerY = croppedPixels.y + croppedPixels.height / 2;

      const img = new Image();

      img.src = image;

      img.onload = () => {
        onSave?.(
          Math.round((centerX / img.naturalWidth) * 1000) / 10,
          Math.round((centerY / img.naturalHeight) * 1000) / 10,
        );

        onClose();
      };

      return;
    }

    const img = new Image();

    img.src = image;

    img.onload = () => {
      const viewportW = 600;
      const viewportH = viewportW / aspectRatio;

      const imgAspect = img.naturalWidth / img.naturalHeight;

      let renderedW: number;
      let renderedH: number;

      if (imgAspect > aspectRatio) {
        renderedH = viewportH * zoom;
        renderedW = renderedH * imgAspect;
      } else {
        renderedW = viewportW * zoom;
        renderedH = renderedW / imgAspect;
      }

      const offsetX = (renderedW - viewportW) / 2 + crop.x;
      const offsetY = (renderedH - viewportH) / 2 + crop.y;

      const imgX = (offsetX / renderedW) * img.naturalWidth;
      const imgY = (offsetY / renderedH) * img.naturalHeight;

      onSave?.(
        Math.round((imgX / img.naturalWidth) * 1000) / 10,
        Math.round((imgY / img.naturalHeight) * 1000) / 10,
      );

      onClose();
    };
  };

  const handleReset = () => {
    onSave?.(50, 50);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={free ? "Recortar imagen" : "Ajustar posición"}
      wide
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm text-neutral-500 dark:text-[#A8A3B8]">
          {free
            ? "Ajusta la proporción del recorte y mueve/zoom la imagen para dejar solo la parte que quieras."
            : "Arrastra para elegir qué parte de la imagen se ve. Usa la rueda del mouse o el slider para hacer zoom."}
        </p>

        {free && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {FREE_PRESETS.map((preset) => {
                const active = ratio === preset.value;

                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setRatio(preset.value)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors ${
                      active
                        ? "border-(--visora-accent) bg-(--visora-accent)/10 text-(--visora-accent)"
                        : "border-neutral-200 text-neutral-500 hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8]"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                Proporción
              </span>

              <input
                type="range"
                min={0.5}
                max={3}
                step={0.05}
                value={effectiveAspect}
                onChange={(e) => setRatio(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 dark:bg-[#27243A]"
              />
            </div>
          </div>
        )}

        <div className="relative h-[400px] overflow-hidden rounded-xl bg-neutral-950 sm:h-[450px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={effectiveAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-neutral-400 dark:text-[#6F6A80]">Zoom</span>

          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 dark:bg-[#27243A]"
          />
        </div>

        <div className="flex justify-between border-t border-neutral-100 pt-4 dark:border-[#27243A]">
          {free ? (
            <span />
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-neutral-200 px-4 py-2.5 text-xs text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468]"
            >
              Centrar
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-6 py-3 text-sm text-white transition-colors hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
          >
            {free ? "Recortar" : "Aplicar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ImageCropModal;