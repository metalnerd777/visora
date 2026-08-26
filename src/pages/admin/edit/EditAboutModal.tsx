import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import ImageUpload from "../../../components/ImageUpload";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

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

  const update = (patch: Partial<{ title: string; description: string; image?: string }>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    saveJSON("visora-admin-about", config);

    const profile = loadJSON<PortfolioProfile>(
      "visora-admin-profile",
      defaultProfile,
    );

    saveJSON("visora-admin-profile", {
      ...profile,
      aboutTitle: config.title,
      aboutDescription: config.description,
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
          onChange={(v) => update({ title: v })}
          placeholder="Sobre mí"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Descripción
          </label>

          <textarea
            value={config.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Cuéntanos sobre ti y tu trabajo..."
            rows={5}
            className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
          />
        </div>

        <div className="flex justify-end border-t border-neutral-100 pt-4 dark:border-[#27243A]">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white transition-colors hover:bg-[#7C6CFF] dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-[#7C6CFF] dark:hover:text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EditAboutModal;
