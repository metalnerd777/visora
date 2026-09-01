import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import ImageUpload from "../../../components/ImageUpload";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile } from "../../../types/portfolio";

function loadAboutData(): { title: string; description: string; image?: string } {
  const profile = loadJSON<PortfolioProfile>(
    "visora-admin-profile",
    defaultProfile,
  );

  return loadJSON("visora-admin-about", {
    title: profile.aboutTitle,
    description: profile.aboutDescription,
  });
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

  const update = (patch: Partial<{ title: string; description: string; image?: string }>) => {
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
    });

    refresh();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Sobre mí">
      <div className="flex flex-col gap-6">
        <ImageUpload
          label="Imagen (opcional)"
          image={config.image}
          onImage={(url) => update({ image: url })}
          onRemove={() => update({ image: undefined })}
        />

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
    </Modal>
  );
}

export default EditAboutModal;
