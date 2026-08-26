import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import SocialLinksEditor from "../../../components/SocialLinksEditor";
import Toggle from "../../../components/Toggle";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

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

  const update = (patch: Partial<ContactConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    saveJSON("visora-admin-contact", config);

    const profile = loadJSON<PortfolioProfile>(
      "visora-admin-profile",
      defaultProfile,
    );

    saveJSON("visora-admin-profile", {
      ...profile,
      contactTitle: config.title,
      contactDescription: config.description,
      email: config.email,
      location: config.location,
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
            onChange={(v) => update({ title: v })}
            placeholder="Hablemos."
          />

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
              onChange={(v) => update({ formEmail: v })}
              placeholder="donde@recibir-mensajes.com"
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
