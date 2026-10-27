import { useEffect, useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import Toggle from "../../../components/Toggle";
import ImageCropModal from "../../../components/ImageCropModal";
import SaveButton from "../../../components/SaveButton";
import ImageUploadFocalPoint from "../../../components/ImageUploadFocalPoint";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";
import { useImageOrientation } from "../../../lib/useImageOrientation";
import { hasTransparency } from "../../../lib/image";
import { HERO_GRADIENT_PRESETS } from "../../../lib/appearance";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile } from "../../../types/portfolio";

export type PortraitAlign = "left" | "center" | "right";

interface HeroConfig {
  heroImage?: string;
  heroImageFocusX: number;
  heroImageFocusY: number;
  fadeTop: boolean;
  fadeBottom: boolean;
  fadeLeft: boolean;
  fadeRight: boolean;
  title: string;
  description: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
  showSecondary: boolean;
  heroGradient?: boolean;
  heroGradientId?: string;
  heroTransparent?: boolean;
  portraitAlign?: PortraitAlign;
}

function loadHero(): HeroConfig {
  return loadJSON<HeroConfig>("visora-admin-hero", {
    heroImage: defaultProfile.heroImage,
    heroImageFocusX: 50,
    heroImageFocusY: 50,
    fadeTop: false,
    fadeBottom: true,
    fadeLeft: false,
    fadeRight: false,
    title: defaultProfile.name,
    description: defaultProfile.description,
    primaryText: defaultProfile.heroPrimaryButton ?? "Ver portfolio",
    primaryLink: "#projects",
    secondaryText: defaultProfile.heroSecondaryButton ?? "Contacto",
    secondaryLink: "/contacto",
    showSecondary: true,
    heroGradient: false,
    heroGradientId: HERO_GRADIENT_PRESETS[0].id,
    heroTransparent: false,
    portraitAlign: "center",
  });
}

const PORTRAIT_ALIGN_OPTIONS: { value: PortraitAlign; label: string }[] = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

const LINK_OPTIONS: { value: string; label: string }[] = [
  { value: "#featured", label: "Destacadas" },
  { value: "#projects", label: "Proyectos" },
  { value: "/sobre-mi", label: "Sobre mí" },
  { value: "/blog", label: "Blog" },
  { value: "/contacto", label: "Contacto" },
];

function LinkSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:text-[#F5F3FF]"
      >
        {LINK_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function HeroSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm dark:border-[#2A273F] dark:bg-[#0B0A14]/50">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--visora-accent)">
          {title}
        </p>
        {description && (
          <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
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

  const isDesktopPortrait =
    useImageOrientation(config.heroImage) === "portrait";

  const update = (patch: Partial<HeroConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const [heroTransparent, setHeroTransparent] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void hasTransparency(config.heroImage ?? "").then((value) => {
      if (!cancelled) {
        setHeroTransparent(value);
        if (config.heroTransparent !== value) {
          update({ heroTransparent: value });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [config.heroImage, config.heroTransparent]);

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
      heroTransparent: config.heroTransparent ?? false,
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
      heroImageFocusX: cleaned.heroImageFocusX,
      heroImageFocusY: cleaned.heroImageFocusY,
      heroPrimaryButton: cleaned.primaryText,
      heroSecondaryButton: cleaned.secondaryText,
    });

    refresh();
    onClose();
  };

  const openCrop = () => {
    setCropOpen(true);
  };

  const handleCropExport = (dataUrl: string) => {
    update({
      heroImage: dataUrl,
      heroImageFocusX: 50,
      heroImageFocusY: 50,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar Hero"
      wide
      actions={<SaveButton onClick={handleSave} />}
>
      <div className="flex flex-col gap-5">
        <HeroSection
          title="Imagen de fondo"
          description="Carga o cambia la imagen y marca el punto de importancia solo sobre la imagen visible."
        >
          <ImageUploadFocalPoint
            label="Imagen de fondo"
            image={config.heroImage}
            focusX={config.heroImageFocusX}
            focusY={config.heroImageFocusY}
            onImage={(url) => update({ heroImage: url })}
            onFocusChange={(x, y) =>
              update({ heroImageFocusX: x, heroImageFocusY: y })
            }
            onRemove={() =>
              update({
                heroImage: undefined,
                heroImageFocusX: 50,
                heroImageFocusY: 50,
              })
            }
            onCrop={config.heroImage ? openCrop : undefined}
            showGradient={heroTransparent && (config.heroGradient ?? false)}
            gradientId={config.heroGradientId}
          />

          {isDesktopPortrait && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-neutral-600 dark:text-[#A8A3B8]">
                Alineación de la imagen vertical
              </p>
              <div className="flex w-fit rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-[#27243A] dark:bg-[#0B0A14]/60">
                {PORTRAIT_ALIGN_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update({ portraitAlign: option.value })}
                    className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-colors ${
                      (config.portraitAlign ?? "center") === option.value
                        ? "bg-white text-black shadow-sm dark:bg-[#27243A] dark:text-[#F5F3FF]"
                        : "text-neutral-500 hover:text-neutral-700 dark:text-[#A8A3B8] dark:hover:text-[#F5F3FF]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                Se aplica en el tema Editorial. En el minimal la imagen se alinea automáticamente.
              </p>
            </div>
          )}

          <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-neutral-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0">
              <path d="M12 9v4m0 4h.01" />
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            <span>
              Si necesitas eliminar el fondo de tu imagen, te recomendamos la
              herramienta que posee{" "}
              <a
                href="https://www.photoroom.com/tools/background-remover"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-(--visora-accent) underline decoration-(--visora-accent)/40 underline-offset-2 hover:decoration-(--visora-accent)"
              >
                Photoroom
              </a>
              .
            </span>
          </p>
        </HeroSection>

        <div className="grid gap-5 sm:grid-cols-2">
          <HeroSection
            title="Atenuación de bordes"
            description="Difumina los bordes de la imagen para integrarla mejor con el fondo."
          >
            <div className="flex flex-wrap gap-4">
              <Toggle
                label="Atenuar arriba"
                checked={config.fadeTop}
                onChange={(v) => update({ fadeTop: v })}
              />
              <Toggle
                label="Atenuar abajo"
                checked={config.fadeBottom}
                onChange={(v) => update({ fadeBottom: v })}
              />
              <Toggle
                label="Atenuar izquierda"
                checked={config.fadeLeft}
                onChange={(v) => update({ fadeLeft: v })}
              />
              <Toggle
                label="Atenuar derecha"
                checked={config.fadeRight}
                onChange={(v) => update({ fadeRight: v })}
              />
            </div>
          </HeroSection>

          <HeroSection
            title="Fondo degradado"
            description="Se muestra detrás de la imagen con transparencia."
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Toggle
                  label="Fondo degradado"
                  checked={heroTransparent ? (config.heroGradient ?? false) : false}
                  onChange={(v) => update({ heroGradient: heroTransparent ? v : false })}
                  disabled={!heroTransparent}
                />
                {!heroTransparent && (
                  <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                    Para poner un fondo degradado la imagen debe tener un fondo
                    transparente.
                  </p>
                )}
              </div>

              {heroTransparent && (config.heroGradient ?? false) ? (
                <div className="flex flex-wrap gap-2">
                  {HERO_GRADIENT_PRESETS.map((preset) => {
                    const active =
                      (config.heroGradientId ?? HERO_GRADIENT_PRESETS[0].id) ===
                      preset.id;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        title={preset.label}
                        aria-label={`Degradado ${preset.label}`}
                        onClick={() => update({ heroGradientId: preset.id })}
                        className={`relative h-10 w-20 overflow-hidden rounded-xl border-2 transition-transform hover:scale-105 ${
                          active
                            ? "border-neutral-900 dark:border-white"
                            : "border-neutral-200/70 dark:border-[#2A273F]"
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${preset.color1} 0%, ${preset.color2} 100%)`,
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                  {heroTransparent
                    ? "Activa 'Fondo degradado' para ver las opciones de color."
                    : "La imagen actual no tiene transparencia."}
                </p>
              )}
            </div>
          </HeroSection>
        </div>

        <HeroSection
          title="Título y descripción"
          description="Textos principales del hero."
        >
          <div className="grid gap-6 sm:grid-cols-2">
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
          </div>
        </HeroSection>

        <div className="grid gap-5 sm:grid-cols-2">
          <HeroSection
            title="Botón principal"
            description="Texto y destino al que lleva el botón principal."
          >
            <div className="flex flex-col gap-4">
              <Field
                label="Texto"
                value={config.primaryText}
                onChange={(v) => update({ primaryText: v })}
                placeholder="Ver portfolio"
              />

              <LinkSelect
                label="Destino"
                value={config.primaryLink}
                onChange={(v) => update({ primaryLink: v })}
              />
            </div>
          </HeroSection>

          <HeroSection
            title="Botón secundario"
            description="Texto y destino del botón secundario."
          >
            <div className="flex flex-col gap-4">
              {/* Toggle
              <Toggle
                label="Mostrar botón secundario"
                checked={config.showSecondary}
                onChange={(v) => update({ showSecondary: v })}
              />
              */}

              <div className="flex flex-col gap-4">
                <Field
                  label="Texto"
                  value={config.secondaryText}
                  onChange={(v) => update({ secondaryText: v })}
                  placeholder="Contacto"
                />

                <LinkSelect
                  label="Destino"
                  value={config.secondaryLink}
                  onChange={(v) => update({ secondaryLink: v })}
                />
              </div>
            </div>
          </HeroSection>
        </div>
      </div>

      {config.heroImage && (
        <ImageCropModal
          open={cropOpen}
          onClose={() => setCropOpen(false)}
          image={config.heroImage}
          free
          onExport={handleCropExport}
        />
      )}
    </Modal>
  );
}

export default EditHeroModal;