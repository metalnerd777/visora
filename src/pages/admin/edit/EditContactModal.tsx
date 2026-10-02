import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import SocialLinksEditor from "../../../components/SocialLinksEditor";
import SaveButton from "../../../components/SaveButton";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isEmail, isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile } from "../../../types/portfolio";

interface ContactConfig {
  title: string;
  description: string;
  email: string;
  emailSubject: string;
  location: string;
  whatsappPhone: string;
  whatsappMessage: string;
}

const WHATSAPP_MESSAGE_MAX = 100;
const WHATSAPP_DIGITS = 8;

function extractWhatsAppDigits(saved: string): string {
  const digits = saved.replace(/\D/g, "");
  return digits.length > WHATSAPP_DIGITS
    ? digits.slice(-WHATSAPP_DIGITS)
    : digits;
}

function loadContact(): ContactConfig {
  const profile = loadJSON<PortfolioProfile>(
    "visora-admin-profile",
    defaultProfile,
  );

  const existing = loadJSON<{
    emailSubject?: string;
    whatsappPhone?: string;
    whatsappMessage?: string;
  }>("visora-admin-contact", {});

  return {
    title: profile.contactTitle ?? "Hablemos.",
    description: profile.contactDescription ?? "",
    email: profile.email,
    emailSubject: existing.emailSubject ?? "Contacto desde el portfolio",
    location: profile.location,
    whatsappPhone: extractWhatsAppDigits(existing.whatsappPhone ?? ""),
    whatsappMessage: existing.whatsappMessage ?? "Hola, me interesa tu trabajo. ¿Podemos hablar?",
  };
}

function EditContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh, settings, setSettings } = usePortfolio();
  const [config, setConfig] = useState<ContactConfig>(loadContact);
  const [errors, setErrors] = useState<{
    title?: string;
    email?: string;
    whatsappPhone?: string;
    whatsappMessage?: string;
  }>({});

  const update = (patch: Partial<ContactConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const nextErrors: typeof errors = {};

    if (!isNonEmpty(config.title)) nextErrors.title = "El título es obligatorio.";
    if (!isEmail(config.email)) nextErrors.email = "Ingresa un correo válido.";

    if (config.whatsappPhone && config.whatsappPhone.length !== WHATSAPP_DIGITS) {
      nextErrors.whatsappPhone = `Ingresa ${WHATSAPP_DIGITS} números después del prefijo.`;
    }

    if (config.whatsappMessage.trim().length > WHATSAPP_MESSAGE_MAX) {
      nextErrors.whatsappMessage = `El mensaje no puede superar los ${WHATSAPP_MESSAGE_MAX} caracteres.`;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    saveJSON("visora-admin-contact", {
      title: sanitizeText(config.title).trim(),
      description: sanitizeText(config.description).trim(),
      email: config.email.trim(),
      emailSubject: sanitizeText(config.emailSubject).trim(),
      location: sanitizeText(config.location).trim(),
      whatsappPhone: config.whatsappPhone
        ? `+569${config.whatsappPhone}`
        : "",
      whatsappMessage: sanitizeText(config.whatsappMessage).trim(),
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

  const waPhone = config.whatsappPhone;
  const waUrl = waPhone
    ? `https://wa.me/569${waPhone}${config.whatsappMessage.trim() ? `?text=${encodeURIComponent(config.whatsappMessage.trim())}` : ""}`
    : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar Contacto"
      wide
      actions={<SaveButton onClick={handleSave} />}
    >
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
            className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-5 dark:border-[#27243A]">
          <label className="text-sm font-medium">WhatsApp</label>

          <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                Número de teléfono
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400 dark:text-[#6F6A80]">
                  +56 9
                </span>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={config.whatsappPhone}
                  onChange={(e) => {
                    const v = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, WHATSAPP_DIGITS);
                    update({ whatsappPhone: v });
                    setErrors((er) => ({ ...er, whatsappPhone: undefined }));
                  }}
                  placeholder="12345678"
                  aria-invalid={errors.whatsappPhone ? true : undefined}
                  className={`w-full rounded-xl border bg-white/80 py-3 pl-[4.5rem] pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80] ${
                    errors.whatsappPhone
                      ? "border-red-400 dark:border-red-500"
                      : "border-neutral-200 dark:border-[#27243A]"
                  }`}
                />
              </div>

              <p
                className={`text-xs ${
                  errors.whatsappPhone
                    ? "text-red-500"
                    : "text-neutral-400 dark:text-[#6F6A80]"
                }`}
              >
                {errors.whatsappPhone ??
                  "Formato: +56 9 + 8 números (ej. +569 1234 5678)."}
              </p>
              <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                {waUrl
                  ? `El botón abrirá wa.me/569${waPhone} con el mensaje predefinido.`
                  : "Sin número configurado. El botón de WhatsApp no se mostrará."}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                Mensaje predefinido
              </label>

              <textarea
                value={config.whatsappMessage}
                onChange={(e) => {
                  update({ whatsappMessage: e.target.value });
                  setErrors((er) => ({ ...er, whatsappMessage: undefined }));
                }}
                placeholder="Hola, me interesa tu trabajo..."
                rows={3}
                maxLength={WHATSAPP_MESSAGE_MAX + 20}
                className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
              />

              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={`text-xs ${
                    errors.whatsappMessage
                      ? "text-red-500"
                      : config.whatsappMessage.trim().length > WHATSAPP_MESSAGE_MAX
                        ? "text-red-500"
                        : "text-neutral-400 dark:text-[#6F6A80]"
                  }`}
                >
                  {errors.whatsappMessage ??
                    `Máximo ${WHATSAPP_MESSAGE_MAX} caracteres`}
                </p>

                <p className="text-xs tabular-nums text-neutral-400 dark:text-[#6F6A80]">
                  {config.whatsappMessage.trim().length} / {WHATSAPP_MESSAGE_MAX}
                </p>
              </div>

              
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-neutral-100 pt-5 sm:grid-cols-2 dark:border-[#27243A]">
          <Field
            label="Email de contacto"
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
            label="Asunto del correo"
            value={config.emailSubject}
            onChange={(v) => update({ emailSubject: v })}
            placeholder="Contacto desde el portfolio"
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-5 dark:border-[#27243A]">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Redes sociales</label>
            <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
              Las redes con información se muestran en todo el sitio (header,
              footer y contacto). Solo se muestran las que tienen un usuario.
            </p>
          </div>

          <SocialLinksEditor
            links={settings.socials}
            onChange={(links) => setSettings({ ...settings, socials: links })}
          />
        </div>
      </div>
    </Modal>
  );
}

export default EditContactModal;
