import { useState } from "react";

import type { SocialLink, SocialPlatform } from "../../types/portfolio";

import { profile as defaultProfile } from "../../data/portfolio";

interface ContactConfig {
  title: string;
  description: string;
  email: string;
  location: string;
  socialLinks: SocialLink[];
  whatsappPhone: string;
  whatsappMessage: string;
  formEnabled: boolean;
  formEmail: string;
}

const STORAGE_KEY = "visora-admin-contact";

const PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "behance", label: "Behance" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "vimeo", label: "Vimeo" },
  { value: "flickr", label: "Flickr" },
];

function getStoredContact(): ContactConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw) as ContactConfig;
    }
  } catch {
    // ignore
  }

  return {
    title: defaultProfile.contactTitle ?? "Hablemos.",
    description: defaultProfile.contactDescription ?? "",
    email: defaultProfile.email,
    location: defaultProfile.location,
    socialLinks: defaultProfile.socialLinks,
    whatsappPhone: "",
    whatsappMessage: "Hola, me interesa tu trabajo. ¿Podemos hablar?",
    formEnabled: false,
    formEmail: defaultProfile.email,
  };
}

function ContactAdmin() {
  const [config, setConfig] = useState<ContactConfig>(getStoredContact);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<ContactConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  const addSocialLink = () => {
    const usedPlatforms = config.socialLinks.map((l) => l.platform);
    const available = PLATFORM_OPTIONS.find(
      (p) => !usedPlatforms.includes(p.value),
    );

    update({
      socialLinks: [
        ...config.socialLinks,
        { platform: available?.value ?? "instagram", handle: "" },
      ],
    });
  };

  const updateSocialLink = (index: number, patch: Partial<SocialLink>) => {
    update({
      socialLinks: config.socialLinks.map((link, i) =>
        i === index ? { ...link, ...patch } : link,
      ),
    });
  };

  const removeSocialLink = (index: number) => {
    update({
      socialLinks: config.socialLinks.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
            Administrador
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight">Contacto</h1>
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
              placeholder="Hablemos."
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                Descripción
              </label>

              <textarea
                value={config.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Cuéntanos sobre tu proyecto..."
                rows={3}
                className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
              />
            </div>
          </div>
        </section>

        {/* ─── Información de contacto ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Información de contacto
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Email"
              type="email"
              value={config.email}
              onChange={(v) => update({ email: v })}
              placeholder="tu@email.com"
            />

            <Field
              label="Ubicación"
              value={config.location}
              onChange={(v) => update({ location: v })}
              placeholder="Ciudad, País"
            />
          </div>
        </section>

        {/* ─── WhatsApp ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            WhatsApp
          </h2>

          <div className="flex flex-col gap-5">
            <Field
              label="Número de teléfono"
              value={config.whatsappPhone}
              onChange={(v) => update({ whatsappPhone: v })}
              placeholder="5491112345678"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                Mensaje predefinido
              </label>

              <textarea
                value={config.whatsappMessage}
                onChange={(e) => update({ whatsappMessage: e.target.value })}
                placeholder="Hola, me interesa tu trabajo..."
                rows={2}
                className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-neutral-400 dark:text-[#6F6A80]">
            {config.whatsappPhone
              ? `El botón abrirá wa.me/${config.whatsappPhone} con el mensaje predefinido.`
              : "Sin número configurado. El botón de WhatsApp no se mostrará en la página pública."}
          </p>
        </section>

        {/* ─── Redes sociales ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Redes sociales
          </h2>

          <div className="flex flex-col gap-3">
            {config.socialLinks.map((link, index) => (
              <div
                key={`${link.platform}-${index}`}
                className="flex items-center gap-3"
              >
                <select
                  value={link.platform}
                  onChange={(e) =>
                    updateSocialLink(index, {
                      platform: e.target.value as SocialPlatform,
                    })
                  }
                  className="w-40 shrink-0 rounded-xl border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 sm:w-48"
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={link.handle}
                  onChange={(e) =>
                    updateSocialLink(index, { handle: e.target.value })
                  }
                  placeholder="@usuario"
                  className="flex-1 rounded-xl border border-neutral-200 bg-white/80 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
                />

                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-[#6F6A80] dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  aria-label="Eliminar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {config.socialLinks.length < PLATFORM_OPTIONS.length && (
            <button
              type="button"
              onClick={addSocialLink}
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#7C6CFF] transition-opacity hover:opacity-70"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar red social
            </button>
          )}

          {config.socialLinks.length === 0 && (
            <p className="mt-2 text-sm text-neutral-400 dark:text-[#6F6A80]">
              No hay redes sociales configuradas.
            </p>
          )}
        </section>

        {/* ─── Formulario de contacto ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
              Formulario de contacto
            </h2>

            <label className="flex cursor-pointer items-center gap-2">
              <div
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                  config.formEnabled
                    ? "bg-[#7C6CFF]"
                    : "bg-neutral-300 dark:bg-[#4A4468]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    config.formEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>

              <span className="text-xs text-neutral-500 dark:text-[#A8A3B8]">
                {config.formEnabled ? "Activado" : "Desactivado"}
              </span>

              <input
                type="checkbox"
                checked={config.formEnabled}
                onChange={(e) => update({ formEnabled: e.target.checked })}
                className="sr-only"
              />
            </label>
          </div>

          {config.formEnabled && (
            <Field
              label="Email de destino"
              type="email"
              value={config.formEmail}
              onChange={(v) => update({ formEmail: v })}
              placeholder="donde@recibir-mensajes.com"
            />
          )}

          <p className="mt-4 text-xs text-neutral-400 dark:text-[#6F6A80]">
            {config.formEnabled
              ? "El formulario se mostrará en la página de contacto. El envío real se configurará al conectar un servicio de email."
              : "El formulario está desactivado. Los visitantes usarán el botón de email para contactarte."}
          </p>
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

export default ContactAdmin;
