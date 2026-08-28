import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import SocialLinksEditor from "../../../components/SocialLinksEditor";
import Toggle from "../../../components/Toggle";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isEmail, isNonEmpty, isPhone, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile, SocialLink } from "../../../types/portfolio";

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

function loadContact(): ContactConfig {
  const profile = loadJSON<PortfolioProfile>(
    "visora-admin-profile",
    defaultProfile,
  );

  return loadJSON<ContactConfig>("visora-admin-contact", {
    title: profile.contactTitle ?? "Hablemos.",
    description: profile.contactDescription ?? "",
    email: profile.email,
    location: profile.location,
    socialLinks: profile.socialLinks,
    whatsappPhone: "",
    whatsappMessage: "Hola, me interesa tu trabajo. ¿Podemos hablar?",
    formEnabled: false,
    formEmail: profile.email,
  });
}

function EditContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const [config, setConfig] = useState<ContactConfig>(loadContact);
  const [errors, setErrors] = useState<{
    title?: string;
    email?: string;
    whatsappPhone?: string;
    formEmail?: string;
  }>({});

  const update = (patch: Partial<ContactConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const nextErrors: typeof errors = {};

    if (!isNonEmpty(config.title)) nextErrors.title = "El título es obligatorio.";
    if (!isEmail(config.email)) nextErrors.email = "Ingresa un correo válido.";

    if (config.whatsappPhone.trim() && !isPhone(config.whatsappPhone)) {
      nextErrors.whatsappPhone =
        "Ingresa un número con código de país, solo dígitos y +.";
    }

    if (config.formEnabled && config.formEmail.trim() && !isEmail(config.formEmail)) {
      nextErrors.formEmail = "Ingresa un correo válido.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const cleanedPhone = config.whatsappPhone.replace(/[^\d+]/g, "");

    saveJSON("visora-admin-contact", {
      ...config,
      title: sanitizeText(config.title).trim(),
      description: sanitizeText(config.description).trim(),
      location: sanitizeText(config.location).trim(),
      email: config.email.trim(),
      whatsappPhone: cleanedPhone,
      whatsappMessage: sanitizeText(config.whatsappMessage).trim(),
      formEmail: config.formEmail.trim(),
      socialLinks: config.socialLinks.filter((l) => l.handle.trim().length > 0),
    });

    const profile = loadJSON<PortfolioProfile>(
      "visora-admin-profile",
      defaultProfile,
    );

    saveJSON("visora-admin-profile", {
      ...profile,
      contactTitle: sanitizeText(config.title).trim(),
      contactDescription: sanitizeText(config.description).trim(),
      email: config.email.trim(),
      location: sanitizeText(config.location).trim(),
    });

    refresh();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Contacto" wide>
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Título"
            value={config.title}
            onChange={(v) => {
              update({ title: v });
              setErrors((e) => ({ ...e, title: undefined }));
            }}
            placeholder="Hablemos."
            required
            error={errors.title}
          />

          <Field
            label="Email"
            type="email"
            value={config.email}
            onChange={(v) => {
              update({ email: v });
              setErrors((e) => ({ ...e, email: undefined }));
            }}
            placeholder="tu@email.com"
            required
            error={errors.email}
          />

          <Field
            label="Ubicación"
            value={config.location}
            onChange={(v) => update({ location: v })}
            placeholder="Ciudad, País"
          />
        </div>

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

        <div className="flex flex-col gap-2">
          <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
            Redes sociales
          </label>

          <SocialLinksEditor
            links={config.socialLinks}
            onChange={(links) => update({ socialLinks: links })}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">WhatsApp</label>

          <Field
            label="Número de teléfono"
            value={config.whatsappPhone}
            onChange={(v) => {
              update({ whatsappPhone: v });
              setErrors((e) => ({ ...e, whatsappPhone: undefined }));
            }}
            placeholder="5491112345678"
            error={errors.whatsappPhone}
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

          <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
            {config.whatsappPhone
              ? `El botón abrirá wa.me/${config.whatsappPhone} con el mensaje predefinido.`
              : "Sin número configurado. El botón de WhatsApp no se mostrará."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Formulario de contacto</label>

            <Toggle
              label={config.formEnabled ? "Activado" : "Desactivado"}
              checked={config.formEnabled}
              onChange={(v) => update({ formEnabled: v })}
            />
          </div>

          {config.formEnabled && (
            <Field
              label="Email de destino"
              type="email"
              value={config.formEmail}
              onChange={(v) => {
                update({ formEmail: v });
                setErrors((e) => ({ ...e, formEmail: undefined }));
              }}
              placeholder="donde@recibir-mensajes.com"
              error={errors.formEmail}
            />
          )}
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

export default EditContactModal;
