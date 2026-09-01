import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import ImageUpload from "../../../components/ImageUpload";
import Toggle from "../../../components/Toggle";
import ImageCropModal from "../../../components/ImageCropModal";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile } from "../../../types/portfolio";

interface HeroConfig {
  heroImage?: string;
  heroImageMobile?: string;
  heroImageFocusX: number;
  heroImageFocusY: number;
  heroImageMobileFocusX: number;
  heroImageMobileFocusY: number;
  title: string;
  description: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
  showSecondary: boolean;
}

function loadHero(): HeroConfig {
  return loadJSON<HeroConfig>("visora-admin-hero", {
    heroImage: defaultProfile.heroImage,
    heroImageMobile: undefined,
    heroImageFocusX: 50,
    heroImageFocusY: 50,
    heroImageMobileFocusX: 50,
    heroImageMobileFocusY: 50,
    title: defaultProfile.name,
    description: defaultProfile.description,
    primaryText: defaultProfile.heroPrimaryButton ?? "Ver portfolio",
    primaryLink: "#projects",
    secondaryText: defaultProfile.heroSecondaryButton ?? "Contacto",
    secondaryLink: "/contacto",
    showSecondary: true,
  });
}

function EditHeroModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const [config, setConfig] = useState<HeroConfig>(loadHero);
  const [titleError, setTitleError] = useState<string | undefined>(undefined);

  const [cropOpen, setCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<"desktop" | "mobile">("desktop");

  const update = (patch: Partial<HeroConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    if (!isNonEmpty(config.title)) {
      setTitleError("El título es obligatorio.");
      return;
    }

    setTitleError(undefined);

    const cleaned = {
      ...config,
      title: sanitizeText(config.title).trim(),
      description: sanitizeText(config.description).trim(),
      primaryText: sanitizeText(config.primaryText).trim(),
      secondaryText: sanitizeText(config.secondaryText).trim(),
      primaryLink: config.primaryLink.trim(),
      secondaryLink: config.secondaryLink.trim(),
    };

    saveJSON("visora-admin-hero", cleaned);

    const profile = loadJSON<PortfolioProfile>(
      "visora-admin-profile",
      defaultProfile,
    );

    saveJSON("visora-admin-profile", {
      ...profile,
      name: cleaned.title,
      description: cleaned.description,
      heroImage: cleaned.heroImage,
      heroImageMobile: cleaned.heroImageMobile,
      heroImageFocusX: cleaned.heroImageFocusX,
      heroImageFocusY: cleaned.heroImageFocusY,
      heroImageMobileFocusX: cleaned.heroImageMobileFocusX,
      heroImageMobileFocusY: cleaned.heroImageMobileFocusY,
      heroPrimaryButton: cleaned.primaryText,
      heroSecondaryButton: cleaned.secondaryText,
    });

    refresh();
    onClose();
  };

  const openCrop = (target: "desktop" | "mobile") => {
    setCropTarget(target);
    setCropOpen(true);
  };

  const currentImage =
    cropTarget === "desktop" ? config.heroImage : config.heroImageMobile;

  const handleCropSave = (x: number, y: number) => {
    if (cropTarget === "desktop") {
      update({ heroImageFocusX: x, heroImageFocusY: y });
    } else {
      update({ heroImageMobileFocusX: x, heroImageMobileFocusY: y });
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Hero">
      <div className="flex flex-col gap-6">
        {/* Imagen desktop */}
        <div className="flex flex-col gap-3">
          <ImageUpload
            label="Imagen de fondo (desktop)"
            image={config.heroImage}
            onImage={(url) => update({ heroImage: url })}
            onRemove={() =>
              update({
                heroImage: undefined,
                heroImageFocusX: 50,
                heroImageFocusY: 50,
              })
            }
          />

          {config.heroImage && (
            <button
              type="button"
              onClick={() => openCrop("desktop")}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              </svg>
              Ajustar posición
              <span className="text-neutral-400 dark:text-[#6F6A80]">
                ({config.heroImageFocusX}% {config.heroImageFocusY}%)
              </span>
            </button>
          )}
        </div>

        {/* Imagen móvil */}
        <div className="flex flex-col gap-3">
          <ImageUpload
            label="Imagen de fondo (móvil) — opcional"
            image={config.heroImageMobile}
            onImage={(url) => update({ heroImageMobile: url })}
            onRemove={() =>
              update({
                heroImageMobile: undefined,
                heroImageMobileFocusX: 50,
                heroImageMobileFocusY: 50,
              })
            }
          />

          {config.heroImageMobile && (
            <button
              type="button"
              onClick={() => openCrop("mobile")}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-500 transition-colors hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              </svg>
              Ajustar posición
              <span className="text-neutral-400 dark:text-[#6F6A80]">
                ({config.heroImageMobileFocusX}% {config.heroImageMobileFocusY}%)
              </span>
            </button>
          )}

          <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
            Si no subes una imagen móvil, se usará la de desktop con su ajuste.
          </p>
        </div>

        <Field
          label="Título"
          value={config.title}
          onChange={(v) => {
            update({ title: v });
            setTitleError(undefined);
          }}
          placeholder="Tu nombre"
          required
          error={titleError}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Descripción
          </label>

          <textarea
            value={config.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Una breve descripción..."
            rows={3}
            className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium">Botón principal</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Texto"
              value={config.primaryText}
              onChange={(v) => update({ primaryText: v })}
              placeholder="Ver portfolio"
            />

            <Field
              label="Enlace"
              value={config.primaryLink}
              onChange={(v) => update({ primaryLink: v })}
              placeholder="#projects o /ruta"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">Botón secundario</p>

            <Toggle
              label="Mostrar"
              checked={config.showSecondary}
              onChange={(v) => update({ showSecondary: v })}
            />
          </div>

          {config.showSecondary && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Texto"
                value={config.secondaryText}
                onChange={(v) => update({ secondaryText: v })}
                placeholder="Contacto"
              />

              <Field
                label="Enlace"
                value={config.secondaryLink}
                onChange={(v) => update({ secondaryLink: v })}
                placeholder="/contacto"
              />
            </div>
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

      {currentImage && (
        <ImageCropModal
          open={cropOpen}
          onClose={() => setCropOpen(false)}
          image={currentImage}
          aspect={cropTarget === "desktop" ? 16 / 9 : 9 / 16}
          onSave={handleCropSave}
        />
      )}
    </Modal>
  );
}

export default EditHeroModal;
