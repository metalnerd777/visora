import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import Field from "../../components/Field";
import Toggle from "../../components/Toggle";
import ImageCropModal from "../../components/ImageCropModal";
import FaviconPicker from "../../components/FaviconPicker";

import { usePortfolio } from "../../lib/usePortfolio";
import { useAdmin } from "../../lib/useAdmin";
import { THEME_OPTIONS } from "../../themes";
import {
  ACCENT_PRESETS,
  BACKGROUND_ACCENTS,
  BACKGROUND_BASES,
  BUTTON_OPTIONS,
  FONT_OPTIONS,
  PRESET_GRADIENTS,
  RADIUS_OPTIONS,
  accentPresetFor,
  effectiveBase,
  fontOptionFor,
} from "../../lib/appearance";

import type { SiteSettings, ThemeId, ThemeMode } from "../../types/portfolio";

type CategoryKey =
  | "general"
  | "seo"
  | "appearance"
  | "privacy"
  | "site";

const CATEGORIES: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "general", label: "General", icon: "✦" },
  { key: "seo", label: "SEO", icon: "⌕" },
  { key: "appearance", label: "Apariencia", icon: "◐" },
  { key: "privacy", label: "Privacidad", icon: "◇" },
  { key: "site", label: "Publicación", icon: "⬢" },
];

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 backdrop-blur-2xl transition-colors dark:border-[#27243A]/70 dark:bg-[#161327]/70 md:p-8">
      <h2 className="text-xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF]">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-[#A8A3B8]">
          {description}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function SettingToggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Toggle label={label} checked={checked} onChange={onChange} />
      {hint && (
        <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">{hint}</p>
      )}
    </div>
  );
}

function SettingSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
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
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
      />
    </div>
  );
}

function SettingSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
          {label}
        </label>
        <span className="text-xs text-neutral-400 dark:text-[#6F6A80]">
          {Math.round(value * 100)}%
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 dark:bg-[#27243A]"
      />
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/60 p-4 text-xs leading-relaxed text-neutral-500 dark:border-[#27243A]/70 dark:bg-[#0B0A14]/30 dark:text-[#A8A3B8]">
      {children}
    </div>
  );
}

function SettingsPage() {
  const navigate = useNavigate();
  const { settings, setSettings } = usePortfolio();

  const admin = useAdmin();
  const [active, setActive] = useState<CategoryKey>("general");
  const [saved, setSaved] = useState(false);

  const [ogCropOpen, setOgCropOpen] = useState(false);
  const [ogCropSource, setOgCropSource] = useState<string | null>(null);

  const handleOgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOgCropSource(URL.createObjectURL(file));
    setOgCropOpen(true);
    e.target.value = "";
  };

  const closeOgCrop = () => {
    setOgCropOpen(false);

    if (ogCropSource && ogCropSource.startsWith("blob:")) {
      URL.revokeObjectURL(ogCropSource);
    }

    setOgCropSource(null);
  };

  const handleOgExport = (dataUrl: string) => {
    patchGroup("seo", { ogImage: dataUrl });

    if (ogCropSource && ogCropSource.startsWith("blob:")) {
      URL.revokeObjectURL(ogCropSource);
    }

    setOgCropSource(null);
    setOgCropOpen(false);
  };

  useEffect(() => {
    if (!admin) {
      navigate("/admin", { replace: true });
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (!saved) return;

    const t = setTimeout(() => setSaved(false), 1600);
    return () => clearTimeout(t);
  }, [saved]);

  const patch = (partial: Partial<SiteSettings>) => {
    setSettings({ ...settings, ...partial });
    setSaved(true);
  };

  const patchGroup = (
    group: "general" | "seo" | "appearance" | "privacy" | "site",
    value: object,
  ) => {
    patch({ [group]: { ...settings[group], ...value } } as Partial<SiteSettings>);
  };

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.key === active)!,
    [active],
  );

  if (!admin) return null;

  return (
    <main className="px-6 py-16 text-neutral-900 transition-colors dark:text-[#F5F3FF] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
              Administrador
            </p>
            <h1 className="mt-2 text-4xl font-light tracking-tight md:text-5xl">
              Configuración
            </h1>
          </div>

          <span
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs transition-opacity ${
              saved
                ? "opacity-100 text-green-600 dark:text-green-400"
                : "opacity-0"
            }`}
          >
            Guardado
          </span>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64 lg:shrink-0">
            <nav className="flex flex-wrap gap-2 rounded-3xl border border-neutral-200/70 bg-white/70 p-2 backdrop-blur-2xl dark:border-[#27243A]/70 dark:bg-[#161327]/70 lg:sticky lg:top-28 lg:flex-col">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActive(cat.key)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-colors ${
                    active === cat.key
                      ? "bg-(--visora-accent) text-white"
                      : "text-neutral-600 hover:bg-neutral-900/5 dark:text-[#A8A3B8] dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1">
            {activeCategory.key === "general" && (
              <SectionCard
                title="General"
                description="Identidad y ajustes básicos del sitio."
              >
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Nombre del profesional / marca"
                      value={settings.general.brandName}
                      onChange={(v) => patchGroup("general", { brandName: v })}
                      placeholder="Tu nombre o marca"
                    />

                    <Field
                      label="Profesión o categoría"
                      value={settings.general.profession}
                      onChange={(v) => patchGroup("general", { profession: v })}
                      placeholder="Fotógrafo, Diseñador..."
                    />
                  </div>

                  <SettingSelect
                    label="Idioma"
                    value={settings.general.language}
                    onChange={(v) => patchGroup("general", { language: v })}
                    options={[
                      { value: "es", label: "Español" },
                      { value: "en", label: "English" },
                      { value: "ca", label: "Català" },
                      { value: "gal", label: "Galego" },
                      { value: "eu", label: "Euskara" },
                    ]}
                  />

                  <FaviconPicker
                    value={settings.general.favicon}
                    onChange={(dataUrl) =>
                      patchGroup("general", { favicon: dataUrl })
                    }
                    onReset={() => patchGroup("general", { favicon: "" })}
                  />
                </FieldGroup>
              </SectionCard>
            )}

            {activeCategory.key === "seo" && (
              <SectionCard
                title="SEO"
                description="Cómo aparece tu sitio en buscadores y al compartir."
              >
                <FieldGroup>
                  <Field
                    label="Título SEO"
                    value={settings.seo.title}
                    onChange={(v) => patchGroup("seo", { title: v })}
                    placeholder="Nombre del profesional · Categoría"
                  />

                  <TextArea
                    label="Meta descripción"
                    value={settings.seo.description}
                    onChange={(v) => patchGroup("seo", { description: v })}
                    placeholder="Breve descripción que aparece en Google."
                    rows={3}
                  />

                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                      Imagen Open Graph
                    </span>

                    <Note>
                      Se recomienda 1200×630 px. Al subir o recortar, la imagen se
                      ajusta automáticamente a ese tamaño.
                    </Note>

                    {settings.seo.ogImage ? (
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={settings.seo.ogImage}
                          alt="Vista previa"
                          className="h-32 w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        <div className="absolute bottom-4 left-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setOgCropSource(settings.seo.ogImage);
                              setOgCropOpen(true);
                            }}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-black/60"
                          >
                            Recortar
                          </button>

                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-black/60">
                            Cambiar
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleOgFile}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => patchGroup("seo", { ogImage: "" })}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-red-400/60 hover:bg-black/60"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-32 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 dark:border-[#27243A] dark:bg-[#0B0A14]/30">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-neutral-300 dark:text-[#4A4468]"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>

                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]">
                          Subir imagen
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleOgFile}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <ImageCropModal
                    open={ogCropOpen}
                    onClose={closeOgCrop}
                    image={ogCropSource || ""}
                    aspect={1200 / 630}
                    exportSize={{ width: 1200, height: 630 }}
                    onExport={handleOgExport}
                  />

                  <SettingToggle
                    label="No indexar (en construcción)"
                    hint="Añade noindex para que Google no liste el sitio todavía."
                    checked={settings.seo.noindex}
                    onChange={(v) => patchGroup("seo", { noindex: v })}
                  />
                </FieldGroup>
              </SectionCard>
            )}

            {activeCategory.key === "appearance" && (
              <SectionCard
                title="Apariencia"
                description="Diseño del sitio, colores y estilo general del portfolio."
              >
                <FieldGroup>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                      Diseño
                    </label>
                    <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                      El tema define el aspecto gráfico general del sitio
                      (estructura, encabezados, reglas). Claro/oscuro y colores
                      se aplican encima por separado.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {THEME_OPTIONS.map((option) => {
                        const isActive =
                          settings.appearance.theme === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              patchGroup("appearance", {
                                theme: option.id as ThemeId,
                              })
                            }
                            className={`flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all hover:scale-[1.02] ${
                              isActive
                                ? "border-neutral-900 dark:border-white"
                                : "border-neutral-200/70 dark:border-[#2A273F]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex gap-1">
                                {option.swatch.map((color) => (
                                  <span
                                    key={color}
                                    className="h-6 w-6 rounded-full border border-black/10"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </span>

                              <span
                                className={`text-sm font-medium ${
                                  isActive
                                    ? "text-neutral-900 dark:text-[#F5F3FF]"
                                    : "text-neutral-600 dark:text-[#A8A3B8]"
                                }`}
                              >
                                {option.label}
                              </span>
                            </div>

                            <p className="text-xs leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                              {option.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <SettingSelect
                    label="Modo claro/oscuro"
                    value={settings.appearance.mode}
                    onChange={(v) =>
                      patchGroup("appearance", { mode: v as ThemeMode })
                    }
                    options={[
                      { value: "system", label: "Seguir al sistema" },
                      { value: "light", label: "Claro" },
                      { value: "dark", label: "Oscuro" },
                    ]}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                      Color de acento
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {ACCENT_PRESETS.map((preset) => {
                        const isActive =
                          accentPresetFor(settings.appearance.primaryColor)?.id ===
                          preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            title={preset.label}
                            aria-label={`Acento ${preset.label}`}
                            onClick={() =>
                              patchGroup("appearance", {
                                primaryColor: preset.color,
                              })
                            }
                            className={`h-10 w-10 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 ${
                              isActive
                                ? "border-neutral-900 dark:border-white"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: preset.color }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                      Fondo (degradado)
                    </label>
                    <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                      Elige un degradado pre-hecho, o personalízalo con una base
                      (clara u oscura) y un color de acento.
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_GRADIENTS.map((preset) => {
                        const isActive =
                          settings.appearance.background.color1 === preset.base &&
                          settings.appearance.background.color2 === preset.accent;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            title={preset.label}
                            aria-label={`Degradado ${preset.label}`}
                            onClick={() =>
                              patch({
                                appearance: {
                                  ...settings.appearance,
                                  mode: preset.dark ? "dark" : "light",
                                  background: {
                                    color1: preset.base,
                                    color2: preset.accent,
                                  },
                                },
                              })
                            }
                            className={`flex h-14 cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-transform hover:scale-105 ${
                              isActive
                                ? "border-neutral-900 dark:border-white"
                                : "border-neutral-200/70 dark:border-[#2A273F]"
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${preset.base} 0%, ${preset.accent} 100%)`,
                            }}
                          >
                            <span className="rounded-full bg-black/35 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white backdrop-blur-sm">
                              {preset.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex flex-col gap-1 sm:flex-1">
                        <span className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                          Base
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {BACKGROUND_BASES.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              title={opt.label}
                              aria-label={`Base ${opt.label}`}
                              onClick={() =>
                                patch({
                                  appearance: {
                                    ...settings.appearance,
                                    background: {
                                      ...settings.appearance.background,
                                      color1: opt.color,
                                    },
                                  },
                                })
                              }
                              className={`h-8 w-8 cursor-pointer rounded-md border-2 ring-1 ring-inset ring-neutral-300/60 transition-transform hover:scale-110 dark:ring-[#3A3655] ${
                                settings.appearance.background.color1 === opt.color
                                  ? "border-neutral-900 dark:border-white"
                                  : "border-white dark:border-[#161327]"
                              }`}
                              style={{ backgroundColor: opt.color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 sm:flex-1">
                        <span className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                          Acento del fondo
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {BACKGROUND_ACCENTS.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              title={opt.label}
                              aria-label={`Acento de fondo ${opt.label}`}
                              onClick={() =>
                                patch({
                                  appearance: {
                                    ...settings.appearance,
                                    background: {
                                      ...settings.appearance.background,
                                      color2: opt.color,
                                    },
                                  },
                                })
                              }
                              className={`h-8 w-8 cursor-pointer rounded-md border-2 ring-1 ring-inset ring-neutral-300/60 transition-transform hover:scale-110 dark:ring-[#3A3655] ${
                                settings.appearance.background.color2 === opt.color
                                  ? "border-neutral-900 dark:border-white"
                                  : "border-white dark:border-[#161327]"
                              }`}
                              style={{ backgroundColor: opt.color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <SettingSelect
                    label="Radio de bordes"
                    value={settings.appearance.borderRadius}
                    onChange={(v) =>
                      patchGroup("appearance", {
                        borderRadius: v as "sm" | "md" | "lg",
                      })
                    }
                    options={RADIUS_OPTIONS}
                  />

                  <SettingSelect
                    label="Estilo de botones"
                    value={settings.appearance.buttonStyle}
                    onChange={(v) =>
                      patchGroup("appearance", {
                        buttonStyle: v as "pill" | "rounded" | "square",
                      })
                    }
                    options={BUTTON_OPTIONS}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                      Tipografía
                    </label>
                    <select
                      value={settings.appearance.fontFamily}
                      onChange={(e) =>
                        patchGroup("appearance", { fontFamily: e.target.value })
                      }
                      className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:text-[#F5F3FF]"
                    >
                      {FONT_OPTIONS.map((f) => {
                        const isCurrent =
                          f.family === settings.appearance.fontFamily;
                        return (
                          <option key={f.family} value={f.family}>
                            {isCurrent ? `${f.label} (actual)` : f.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/60 p-4 dark:border-[#27243A]/70 dark:bg-[#0B0A14]/30">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                      Vista previa
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        className="px-6 py-3 text-sm text-white"
                        style={{
                          backgroundColor: "var(--visora-accent)",
                          borderRadius: "var(--visora-btn-radius)",
                        }}
                      >
                        Botón principal
                      </button>

                      <button
                        type="button"
                        className="border px-6 py-3 text-sm text-neutral-600 dark:text-[#A8A3B8]"
                        style={{
                          borderColor: "var(--visora-accent)",
                          borderRadius: "var(--visora-btn-radius)",
                        }}
                      >
                        Botón secundario
                      </button>
                    </div>

                    <div
                      className="mt-4 rounded-2xl border border-neutral-200/70 bg-white/70 p-4 dark:border-[#27243A]/70 dark:bg-[#0B0A14]/60"
                      style={{
                        fontFamily: fontOptionFor(
                          settings.appearance.fontFamily,
                        ).cssName,
                      }}
                    >
                      <p className="text-lg font-light">
                        Aa — {fontOptionFor(settings.appearance.fontFamily).label}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-[#A8A3B8]">
                        Este es un texto de muestra para ver la tipografía.
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-neutral-200/70 p-4 dark:border-[#27243A]/70">
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                        Fondo
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className="h-16 rounded-xl border border-neutral-200/60 dark:border-[#27243A]/60"
                          style={{
                            background: `linear-gradient(135deg, ${effectiveBase(settings.appearance.background.color1, false)} 0%, ${settings.appearance.background.color2} 100%)`,
                          }}
                        />
                        <div
                          className="h-16 rounded-xl border border-neutral-200/60 dark:border-[#27243A]/60"
                          style={{
                            background: `linear-gradient(135deg, ${effectiveBase(settings.appearance.background.color1, true)} 0%, ${settings.appearance.background.color2} 100%)`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] uppercase tracking-wider text-neutral-400 dark:text-[#6F6A80]">
                        <span>Modo claro</span>
                        <span>Modo oscuro</span>
                      </div>
                    </div>
                  </div>
                </FieldGroup>
              </SectionCard>
            )}

            {activeCategory.key === "privacy" && (
              <SectionCard
                title="Privacidad"
                description="Qué muestra tu portfolio públicamente."
              >
                <FieldGroup>
                  <SettingToggle
                    label="Mostrar email"
                    hint="Muestra el email en el contacto."
                    checked={settings.privacy.showEmail}
                    onChange={(v) => patchGroup("privacy", { showEmail: v })}
                  />

                  <SettingToggle
                    label="Mostrar ubicación"
                    hint="Muestra la ubicación en el contacto."
                    checked={settings.privacy.showLocation}
                    onChange={(v) => patchGroup("privacy", { showLocation: v })}
                  />

                  <SettingToggle
                    label="Protección básica de imágenes"
                    hint="Opcional: evita o dificulta el uso no autorizado de tus imágenes."
                    checked={settings.privacy.protectImages}
                    onChange={(v) =>
                      patchGroup("privacy", { protectImages: v })
                    }
                  />

                  <SettingToggle
                    label="Marca de agua en el visor"
                    hint="Quema el nombre del fotógrafo en la imagen ampliada del visor: cualquier captura o descarga desde ahí lleva la marca. Requiere que el proveedor de imágenes permita CORS."
                    checked={settings.privacy.watermarkEnabled}
                    onChange={(v) =>
                      patchGroup("privacy", { watermarkEnabled: v })
                    }
                  />

                  {settings.privacy.watermarkEnabled && (
                    <>
                      <Field
                        label="Texto de la marca"
                        value={settings.privacy.watermarkText}
                        onChange={(v) =>
                          patchGroup("privacy", { watermarkText: v })
                        }
                        placeholder="Si está vacío usa el nombre del profesional"
                      />

                      <SettingSelect
                        label="Estilo de la marca"
                        value={settings.privacy.watermarkStyle}
                        options={[
                          { value: "tiling", label: "Repetida en diagonal" },
                          { value: "corner", label: "Discreta en la esquina" },
                        ]}
                        onChange={(v) =>
                          patchGroup("privacy", {
                            watermarkStyle: v as
                              | "tiling"
                              | "corner",
                          })
                        }
                      />

                      <SettingSlider
                        label="Opacidad"
                        value={settings.privacy.watermarkOpacity}
                        min={0.05}
                        max={0.35}
                        step={0.01}
                        onChange={(v) =>
                          patchGroup("privacy", { watermarkOpacity: v })
                        }
                      />
                    </>
                  )}

                  <TextArea
                    label="Aviso de privacidad"
                    value={settings.privacy.notice}
                    onChange={(v) => patchGroup("privacy", { notice: v })}
                    placeholder="Texto opcional sobre privacidad."
                    rows={4}
                  />

                  <TextArea
                    label="Aviso de cookies"
                    value={settings.privacy.cookieNotice}
                    onChange={(v) => patchGroup("privacy", { cookieNotice: v })}
                    placeholder="Se muestra un aviso a los visitantes si el sitio usa cookies."
                    rows={3}
                  />
                </FieldGroup>
              </SectionCard>
            )}

            {activeCategory.key === "site" && (
              <SectionCard
                title="Publicación"
                description="Visibilidad del sitio para los visitantes."
              >
                <FieldGroup>
                  <SettingToggle
                    label="Publicado"
                    hint="Si lo desactivas, solo tú (admin) podrás ver el sitio; los visitantes verán 'Sitio en construcción'. Útil mientras montas o entregas el portfolio."
                    checked={settings.site.published}
                    onChange={(v) => patchGroup("site", { published: v })}
                  />
                </FieldGroup>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;
