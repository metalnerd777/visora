import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import SocialLinksEditor from "../../../components/SocialLinksEditor";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isEmail, isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile, SocialLink } from "../../../types/portfolio";

function loadProfileData(): PortfolioProfile {
  return loadJSON<PortfolioProfile>("visora-admin-profile", defaultProfile);
}

interface FormErrors {
  name?: string;
  profession?: string;
  email?: string;
}

function EditProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const [data, setData] = useState<PortfolioProfile>(loadProfileData);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    data.socialLinks,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const update = (patch: Partial<PortfolioProfile>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const nextErrors: FormErrors = {};

    if (!isNonEmpty(data.name)) nextErrors.name = "El nombre es obligatorio.";
    if (!isNonEmpty(data.profession))
      nextErrors.profession = "La profesión es obligatoria.";
    if (!isEmail(data.email))
      nextErrors.email = "Ingresa un correo válido.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    saveJSON("visora-admin-profile", {
      ...data,
      name: sanitizeText(data.name).trim(),
      profession: sanitizeText(data.profession).trim(),
      location: sanitizeText(data.location).trim(),
      description: sanitizeText(data.description).trim(),
      email: data.email.trim(),
      socialLinks: socialLinks.filter((l) => l.handle.trim().length > 0),
    });
    refresh();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Perfil">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nombre"
            value={data.name}
            onChange={(v) => {
              update({ name: v });
              setErrors((e) => ({ ...e, name: undefined }));
            }}
            placeholder="Tu nombre"
            required
            error={errors.name}
          />

          <Field
            label="Profesión"
            value={data.profession}
            onChange={(v) => {
              update({ profession: v });
              setErrors((e) => ({ ...e, profession: undefined }));
            }}
            placeholder="Fotógrafo, Diseñador..."
            required
            error={errors.profession}
          />

          <Field
            label="Ubicación"
            value={data.location}
            onChange={(v) => update({ location: v })}
            placeholder="Ciudad, País"
          />

          <Field
            label="Email"
            type="email"
            value={data.email}
            onChange={(v) => {
              update({ email: v });
              setErrors((e) => ({ ...e, email: undefined }));
            }}
            placeholder="tu@email.com"
            required
            error={errors.email}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Descripción
          </label>

          <textarea
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Una breve descripción de tu trabajo"
            rows={2}
            className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Avatar (opcional)
          </label>

          <div className="flex items-center gap-4">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover ring-4 ring-neutral-100 dark:ring-[#161327]"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-xl font-light text-neutral-400 dark:bg-white/5 dark:text-[#6F6A80]">
                {data.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]">
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) update({ avatar: URL.createObjectURL(file) });
                  }}
                />
              </label>

              {data.avatar && (
                <button
                  type="button"
                  onClick={() => update({ avatar: undefined })}
                  className="text-xs text-neutral-400 transition-colors hover:text-red-500 dark:text-[#6F6A80] dark:hover:text-red-400"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Redes sociales
          </label>

          <SocialLinksEditor links={socialLinks} onChange={setSocialLinks} />
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

export default EditProfileModal;
