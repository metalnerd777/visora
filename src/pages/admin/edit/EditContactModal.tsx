import { useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import Toggle from "../../../components/Toggle";
import SocialLinksEditor from "../../../components/SocialLinksEditor";
import SaveButton from "../../../components/SaveButton";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isEmail, isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { PortfolioProfile } from "../../../types/portfolio";

interface ContactFormState {
  title: string;
  description: string;
  email: string;
  emailSubject: string;
  location: string;
  whatsappPhone: string;
  whatsappMessage: string;
  showForm: boolean;
}

const WHATSAPP_MESSAGE_MAX = 120;

function normalizeInternationalPhone(saved: string): string {
  const digits = saved.replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits}`;
}

function loadContact(): ContactFormState {
  const profile = loadJSON<PortfolioProfile>(
    "visora-admin-profile",
    defaultProfile,
  );

  const existing = loadJSON<{
    emailSubject?: string;
    whatsappPhone?: string;
    whatsappMessage?: string;
    showForm?: boolean;
  }>("visora-admin-contact", {});

  return {
    title: profile.contactTitle ?? "Hablemos.",
    description: profile.contactDescription ?? "",
    email: profile.email,
    emailSubject: existing.emailSubject ?? "Contacto desde el portfolio",
    location: profile.location,
    whatsappPhone: normalizeInternationalPhone(existing.whatsappPhone ?? ""),
    whatsappMessage:
      existing.whatsappMessage ??
      "Hola, me interesa tu trabajo. ¿Podemos hablar?",
    showForm: existing.showForm ?? true,
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
  const [config, setConfig] = useState<ContactFormState>(loadContact);
  const [errors, setErrors] = useState<{
    title?: string;
    email?: string;
    whatsappPhone?: string;
    whatsappMessage?: string;
  }>({});

  const update = (patch: Partial<ContactFormState>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    const nextErrors: typeof errors = {};

    if (!isNonEmpty(config.title)) nextErrors.title = "El título es obligatorio.";
    if (!isEmail(config.email)) nextErrors.email = "Ingresa un correo válido.";

    const phoneDigits = config.whatsappPhone.replace(/\D/g, "");
    if (phoneDigits.length > 0 && (phoneDigits.length < 8 || phoneDigits.length > 15)) {
      nextErrors.whatsappPhone =
        "Ingresa el número con código de país (entre 8 y 15 dígitos, ej. +56912345678 o +34600123456).";
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
      whatsappPhone: phoneDigits ? `+${phoneDigits}` : "",
      whatsappMessage: sanitizeText(config.whatsappMessage).trim(),
      showForm: config.showForm,
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

  const waDigits = config.whatsappPhone.replace(/\D/g, "");
  const waUrl =
    waDigits.length >= 8
      ? `https://wa.me/${waDigits}${config.whatsappMessage.trim() ? `?text=${encodeURIComponent(config.whatsappMessage.trim())}` : ""}`
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
          <label className="text-sm font-medium">WhatsApp (Internacional)</label>

          <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                Número con código de país
              </label>

              <input
                type="tel"
                value={config.whatsappPhone}
                onChange={(e) => {
                  const raw = e.target.value;
                  const digits = raw.replace(/\D/g, "").slice(0, 15);
                  update({ whatsappPhone: digits ? `+${digits}` : "" });
                  setErrors((er) => ({ ...er, whatsappPhone: undefined }));
                }}
                placeholder="+56912345678 / +34600123456"
                aria-invalid={errors.whatsappPhone ? true : undefined}
                className={`w-full rounded-xl border bg-white/80 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-(--visora-accent) dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80] ${
                  errors.whatsappPhone
                    ? "border-red-400 dark:border-red-500"
                    : "border-neutral-200 dark:border-[#27243A]"
                }`}
              />

              <p
                className={`text-xs ${
                  errors.whatsappPhone
                    ? "text-red-500"
                    : "text-neutral-400 dark:text-[#6F6A80]"
                }`}
              >
                {errors.whatsappPhone ??
                  "Incluye el código de país (ej. +56 Chile, +34 España, +52 México, +54 Argentina)."}
              </p>
              <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                {waUrl
                  ? `Abriría wa.me/${waDigits} con el mensaje predefinido.`
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

        <div className="border-t border-neutral-100 pt-5 dark:border-[#27243A]">
          <Toggle
            label="Mostrar formulario de consulta directa en la página"
            checked={config.showForm}
            onChange={(v) => update({ showForm: v })}
          />
          <p className="mt-1 text-xs text-neutral-400 dark:text-[#6F6A80]">
            Permite que el cliente redacte su propuesta directamente en la página antes de enviarla por correo o WhatsApp.
          </p>
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
            onChange={(socials) => setSettings({ ...settings, socials })}
          />
        </div>
      </div>
    </Modal>
  );
}

export default EditContactModal;
