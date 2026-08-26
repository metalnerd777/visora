import { useState } from "react";

import { profile as defaultProfile } from "../../data/portfolio";

interface HeroConfig {
  heroImage?: string;
  title: string;
  description: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
  showSecondary: boolean;
}

const STORAGE_KEY = "visora-admin-hero";

function getStoredHero(): HeroConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw) as HeroConfig;
    }
  } catch {
    // ignore
  }

  return {
    heroImage: defaultProfile.heroImage,
    title: defaultProfile.name,
    description: defaultProfile.description,
    primaryText: defaultProfile.heroPrimaryButton ?? "Ver portfolio",
    primaryLink: "#projects",
    secondaryText: defaultProfile.heroSecondaryButton ?? "Contacto",
    secondaryLink: "/contacto",
    showSecondary: true,
  };
}

function HeroAdmin() {
  const [config, setConfig] = useState<HeroConfig>(getStoredHero);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<HeroConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
            Administrador
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight">Hero</h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white transition-colors duration-300 hover:bg-[#7C6CFF] dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-[#7C6CFF] dark:hover:text-white"
        >
          {saved ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Guardado
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Guardar
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* ─── Imagen de fondo ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Imagen de fondo
          </h2>

          {config.heroImage ? (
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={config.heroImage}
                alt="Preview del hero"
                className="h-48 w-full object-cover sm:h-64"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <div className="absolute bottom-4 left-4 flex gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-black/60">
                  Cambiar imagen
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        update({ heroImage: URL.createObjectURL(file) });
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => update({ heroImage: undefined })}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white backdrop-blur-md transition-colors hover:border-red-400/60 hover:bg-black/60"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 dark:border-[#27243A] dark:bg-[#0B0A14]/30 sm:h-64">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-neutral-300 dark:text-[#4A4468]">
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      update({ heroImage: URL.createObjectURL(file) });
                    }
                  }}
                />
              </label>
            </div>
          )}
        </section>

        {/* ─── Contenido ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Contenido
          </h2>

          <div className="flex flex-col gap-5">
            <Field
              label="Título"
              value={config.title}
              onChange={(v) => update({ title: v })}
              placeholder="Tu nombre o título"
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
                className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
              />
            </div>
          </div>
        </section>

        {/* ─── Botones ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Botones
          </h2>

          <div className="flex flex-col gap-8">
            {/* Botón principal */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-neutral-900 dark:text-[#F5F3FF]">
                Botón principal
              </p>

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

            {/* Botón secundario */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium text-neutral-900 dark:text-[#F5F3FF]">
                  Botón secundario
                </p>

                <label className="flex cursor-pointer items-center gap-2">
                  <div
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                      config.showSecondary
                        ? "bg-[#7C6CFF]"
                        : "bg-neutral-300 dark:bg-[#4A4468]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        config.showSecondary ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>

                  <span className="text-xs text-neutral-500 dark:text-[#A8A3B8]">
                    Mostrar
                  </span>

                  <input
                    type="checkbox"
                    checked={config.showSecondary}
                    onChange={(e) => update({ showSecondary: e.target.checked })}
                    className="sr-only"
                  />
                </label>
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
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── Input reutilizable ─── */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
      />
    </div>
  );
}

export default HeroAdmin;
