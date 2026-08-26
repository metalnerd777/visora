import { useState } from "react";

import type { SocialLink, SocialPlatform } from "../../types/portfolio";

import { profile as defaultProfile } from "../../data/portfolio";

const STORAGE_KEY = "visora-admin-profile";

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

function getStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw) as typeof defaultProfile;
    }
  } catch {
    // ignore
  }

  return null;
}

function Profile() {
  const initial = getStoredProfile() ?? defaultProfile;

  const [name, setName] = useState(initial.name);
  const [profession, setProfession] = useState(initial.profession);
  const [description, setDescription] = useState(initial.description);
  const [location, setLocation] = useState(initial.location);
  const [email, setEmail] = useState(initial.email);
  const [avatar, setAvatar] = useState(initial.avatar ?? "");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    initial.socialLinks,
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const data = {
      ...defaultProfile,
      name,
      profession,
      description,
      location,
      email,
      avatar: avatar || undefined,
      socialLinks,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  const addSocialLink = () => {
    const usedPlatforms = socialLinks.map((l) => l.platform);
    const available = PLATFORM_OPTIONS.find(
      (p) => !usedPlatforms.includes(p.value),
    );

    setSocialLinks([
      ...socialLinks,
      { platform: available?.value ?? "instagram", handle: "" },
    ]);
  };

  const updateSocialLink = (index: number, patch: Partial<SocialLink>) => {
    setSocialLinks(
      socialLinks.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    );
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
            Administrador
          </p>

          <h1 className="mt-2 text-3xl font-light tracking-tight">Perfil</h1>
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
        {/* ─── Información principal ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Información principal
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Nombre"
              value={name}
              onChange={setName}
              placeholder="Tu nombre"
            />

            <Field
              label="Profesión"
              value={profession}
              onChange={setProfession}
              placeholder="Fotógrafo, Diseñador..."
            />

            <div className="sm:col-span-2">
              <Field
                label="Descripción"
                value={description}
                onChange={setDescription}
                placeholder="Una breve descripción de tu trabajo"
              />
            </div>

            <Field
              label="Ubicación"
              value={location}
              onChange={setLocation}
              placeholder="Ciudad, País"
            />

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="tu@email.com"
            />
          </div>
        </section>

        {/* ─── Imagen ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Imagen de perfil
          </h2>

          <div className="flex items-center gap-6">
            {/* Preview */}
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-neutral-100 dark:ring-[#161327]"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-2xl font-light text-neutral-400 ring-4 ring-neutral-100 dark:bg-white/5 dark:text-[#6F6A80] dark:ring-[#161327]">
                {name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Cambiar imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setAvatar(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>

              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar("")}
                  className="text-xs text-neutral-400 transition-colors hover:text-red-500 dark:text-[#6F6A80] dark:hover:text-red-400"
                >
                  Eliminar imagen
                </button>
              )}

              <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                Opcional. Se muestra en el perfil público.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Redes sociales ─── */}
        <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-sm dark:border-[#27243A]/70 dark:bg-[#161327]/60 md:p-8">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
            Redes sociales
          </h2>

          <div className="flex flex-col gap-3">
            {socialLinks.map((link, index) => (
              <div
                key={`${link.platform}-${index}`}
                className="flex items-center gap-3"
              >
                {/* Selector de plataforma */}
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

                {/* Handle */}
                <input
                  type="text"
                  value={link.handle}
                  onChange={(e) =>
                    updateSocialLink(index, { handle: e.target.value })
                  }
                  placeholder="@usuario"
                  className="flex-1 rounded-xl border border-neutral-200 bg-white/80 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
                />

                {/* Eliminar */}
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

          {/* Agregar */}
          {socialLinks.length < PLATFORM_OPTIONS.length && (
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

          {socialLinks.length === 0 && (
            <p className="mt-2 text-sm text-neutral-400 dark:text-[#6F6A80]">
              No hay redes sociales configuradas.
            </p>
          )}
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

export default Profile;
