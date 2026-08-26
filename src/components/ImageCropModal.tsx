import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

import Modal from "./Modal";

type CroppedArea = { x: number; y: number; width: number; height: number };

function ImageCropModal({
  open,
  onClose,
  image,
  aspect,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  image: string;
  aspect: number;
  onSave: (x: number, y: number) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (_croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => {
      const centerX = croppedAreaPixels.x + croppedAreaPixels.width / 2;
      const centerY = croppedAreaPixels.y + croppedAreaPixels.height / 2;

      const img = new Image();

      img.src = image;

      img.onload = () => {
        onSave(
          Math.round((centerX / img.naturalWidth) * 1000) / 10,
          Math.round((centerY / img.naturalHeight) * 1000) / 10,
        );
      };
    },
    [image, onSave],
  );

  const handleSave = () => {
    const img = new Image();

    img.src = image;

    img.onload = () => {
      const viewportW = 600;
      const viewportH = viewportW / aspect;

      const imgAspect = img.naturalWidth / img.naturalHeight;

      let renderedW: number;
      let renderedH: number;

      if (imgAspect > aspect) {
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

      onSave(
        Math.round((imgX / img.naturalWidth) * 1000) / 10,
        Math.round((imgY / img.naturalHeight) * 1000) / 10,
      );

      onClose();
    };
  };

  const handleReset = () => {
    onSave(50, 50);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Ajustar posición" wide>
      <div className="flex flex-col gap-5">
        <p className="text-sm text-neutral-500 dark:text-[#A8A3B8]">
          Arrastra para elegir qué parte de la imagen se ve. Usa la rueda del mouse o el slider para hacer zoom.
        </p>

        <div className="relative h-[400px] overflow-hidden rounded-xl bg-neutral-950 sm:h-[450px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
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
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-neutral-200 px-4 py-2.5 text-xs text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468]"
          >
            Centrar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white transition-colors hover:bg-[#7C6CFF] dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-[#7C6CFF] dark:hover:text-white"
          >
            Aplicar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ImageCropModal;
