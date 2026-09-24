import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import ImageUpload from "../../../components/ImageUpload";
import ImageCropModal from "../../../components/ImageCropModal";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile } from "../../../types/portfolio";

interface AboutConfig {
  title: string;
  description: string;
  image?: string;
  focusX: number;
  focusY: number;
}

function loadAboutData(): AboutConfig {
  const profile = loadJSON<PortfolioProfile>(
    "visora-admin-profile",
    defaultProfile,
  );

  const stored = loadJSON<Partial<AboutConfig>>("visora-admin-about", {});

  return {
    title: stored.title ?? profile.aboutTitle,
    description: stored.description ?? profile.aboutDescription,
    image: stored.image ?? profile.aboutImage,
    focusX: stored.focusX ?? profile.aboutImageFocusX ?? 50,
    focusY: stored.focusY ?? profile.aboutImageFocusY ?? 50,
  };
}

function EditAboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const [config, setConfig] = useState(loadAboutData);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [cropMode, setCropMode] = useState<"crop" | "position" | null>(null);

  const update = (patch: Partial<AboutConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const nextErrors: typeof errors = {};

    if (!isNonEmpty(config.title)) nextErrors.title = "El título es obligatorio.";
    if (!isNonEmpty(config.description))
      nextErrors.description = "La descripción es obligatoria.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    saveJSON("visora-admin-about", {
      ...config,
      title: sanitizeText(config.title).trim(),
      description: sanitizeText(config.description).trim(),
    });

    const profile = loadJSON<PortfolioProfile>(
      "visora-admin-profile",
      defaultProfile,
    );

    saveJSON("visora-admin-profile", {
      ...profile,
      aboutTitle: sanitizeText(config.title).trim(),
      aboutDescription: sanitizeText(config.description).trim(),
      aboutImage: config.image,
      aboutImageFocusX: config.focusX,
      aboutImageFocusY: config.focusY,
    });

    refresh();
    onClose();
  };

  const handleCropSave = (x: number, y: number) => {
    update({ focusX: x, focusY: y });
  };

  const handleExport = (dataUrl: string) => {
    update({ image: dataUrl, focusX: 50, focusY: 50 });
  };

  const handleUpload = (url: string) => {
    update({ image: url, focusX: 50, focusY: 50 });
    setCropMode("crop");
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Sobre mí">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <ImageUpload
            label="Imagen (opcional)"
            image={config.image}
            onImage={handleUpload}
            onRemove={() =>
              update({ image: undefined, focusX: 50, focusY: 50 })
            }
          />

          {config.image && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setCropMode("crop")}
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M15 3h6v6" />
                  <path d="M10 14L21 3" />
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                </svg>
                Recortar (retrato 4:5)
              </button>

              <button
                type="button"
                onClick={() => setCropMode("position")}
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Ajustar posición
                <span className="text-neutral-400 dark:text-[#6F6A80]">
                  ({config.focusX}% {config.focusY}%)
                </span>
              </button>
            </div>
          )}

          <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
            Al subir una imagen el recorte 4:5 se aplica automáticamente. Podés
            re-encuadrar cuando quieras.
          </p>
        </div>

        <Field
          label="Título"
          value={config.title}
          onChange={(v) => {
            update({ title: v });
            setErrors((e) => ({ ...e, title: undefined }));
          }}
          placeholder="Sobre mí"
          required
          error={errors.title}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Descripción
          </label>

          <textarea
            value={config.description}
            onChange={(e) => {
              update({ description: e.target.value });
              setErrors((err) => ({ ...err, description: undefined }));
            }}
            placeholder="Cuéntanos sobre ti y tu trabajo..."
            rows={5}
            aria-invalid={errors.description ? true : undefined}
            className={`rounded-xl border bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80] ${
              errors.description
                ? "border-red-400 dark:border-red-500"
                : "border-neutral-200 dark:border-[#27243A]"
            }`}
          />

          {errors.description && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-[#27243A]">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-6 py-3 text-sm text-white transition-colors hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
          >
            Guardar
          </button>
        </div>
      </div>

      {config.image && cropMode && (
        <ImageCropModal
          open
          onClose={() => setCropMode(null)}
          image={config.image}
          aspect={4 / 5}
          onSave={handleCropSave}
          exportSize={
            cropMode === "crop" ? { width: 800, height: 1000 } : undefined
          }
          onExport={cropMode === "crop" ? handleExport : undefined}
        />
      )}
    </Modal>
  );
}

export default EditAboutModal;