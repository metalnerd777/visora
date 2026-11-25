import { lazy, Suspense, useState } from "react";

import { usePortfolio } from "../lib/usePortfolio";
import { socialUrl, socialLabel, nonEmptySocials } from "../lib/socials";
import { useAdmin } from "../lib/useAdmin";
import { isSafeUrl } from "../lib/validation";

import EditableSection from "./admin/edit/EditableSection";

const EditContactModal = lazy(() => import("./admin/edit/EditContactModal"));

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ContactPage() {
  const { profile, settings, contactConfig } = usePortfolio();
  const admin = useAdmin();
  const [contactOpen, setContactOpen] = useState(false);

  // Estado del formulario rápido
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("Proyecto / Sesión");
  const [message, setMessage] = useState("");
  const [sentNotice, setSentNotice] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    try {
      void navigator.clipboard.writeText(text);
      setCopiedItem(label);
      setTimeout(() => setCopiedItem(null), 2500);
    } catch {
      // ignore
    }
  };

  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);

  const whatsappPhone = contactConfig?.whatsappPhone ?? "";
  const whatsappMessage = contactConfig?.whatsappMessage?.trim() ?? "";
  const emailSubject =
    contactConfig?.emailSubject?.trim() ?? "Contacto desde el portfolio";
  const showForm = contactConfig?.showForm ?? true;

  const waPhone = whatsappPhone.replace(/\D/g, "");
  const whatsappUrl = waPhone
    ? `https://wa.me/${waPhone}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""}`
    : null;

  const emailUrl = profile.email
    ? `mailto:${profile.email}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ""}`
    : "";

  const instagram = socials.find((s) => s.platform === "instagram");
  const instagramUrl =
    instagram && instagram.handle
      ? socialUrl("instagram", instagram.handle)
      : "";
  const safeInstagramUrl = isSafeUrl(instagramUrl);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const fullSubject = `${emailSubject} — ${inquiryType} (${senderName || "Cliente"})`;
    const fullBody = [
      `Hola ${settings.general.brandName || profile.name},`,
      "",
      message.trim(),
      "",
      "—",
      `Nombre: ${senderName || "No especificado"}`,
      senderEmail ? `Email: ${senderEmail}` : null,
      `Interés: ${inquiryType}`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    if (profile.email) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(fullBody)}`;
      setSentNotice(true);
    } else if (waPhone) {
      window.open(
        `https://wa.me/${waPhone}?text=${encodeURIComponent(fullBody)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setSentNotice(true);
    }
  };

  const header = (
    <header className="max-w-3xl pt-12 md:pt-20">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-6 bg-(--visora-accent)" />
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
          Contacto
        </p>
      </div>

      <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white md:text-6xl">
        {profile.contactTitle ?? "Hablemos."}
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
        {profile.contactDescription}
      </p>
    </header>
  );

  return (
    <main className="px-6 pt-10 pb-20 transition-colors md:px-10 md:pt-5 md:pb-24">
      <div className="mx-auto max-w-7xl">
        {admin ? (
          <EditableSection
            label="Editar contacto"
            onEdit={() => setContactOpen(true)}
          >
            {header}
          </EditableSection>
        ) : (
          header
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          {/* Columna izquierda: Formulario directo o Botones */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            {showForm && (profile.email || waPhone) && (
              <form
                onSubmit={handleFormSubmit}
                className="rounded-3xl border border-neutral-200/70 bg-white/60 p-6 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-900/50 md:p-8"
              >
                <h2 className="text-xl font-light text-neutral-900 dark:text-white">
                  Cuéntame sobre tu proyecto
                </h2>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Completa los detalles y envía tu consulta directa.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Tu nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Nombre y apellido"
                      className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Tu email
                    </label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Tipo de encargo
                  </label>
                  <input
                    type="text"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    placeholder="Ej. Sesión editorial, Campaña, Evento, Retrato..."
                    className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-white"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Fechas aproximadas, idea o consulta..."
                    className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-white"
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-(--visora-accent) dark:bg-white dark:text-neutral-950 dark:hover:bg-(--visora-accent) dark:hover:text-white"
                  >
                    <span>Enviar consulta</span>
                    <span>→</span>
                  </button>

                  {sentNotice && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                      ✓ Se abrió tu cliente de mensajería con el mensaje listo.
                    </span>
                  )}
                </div>
              </form>
            )}

            {/* Botones rápidos de canal */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {safeInstagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-44 flex-1 items-center justify-center gap-2 rounded-[var(--visora-btn-radius)] border border-neutral-200/80 bg-white/80 px-6 py-4 text-sm font-medium text-neutral-900 transition-all duration-300 hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-white dark:hover:border-(--visora-accent)"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-w-44 flex-1 items-center justify-center gap-2 rounded-[var(--visora-btn-radius)] border border-neutral-200/80 bg-white/80 px-6 py-4 text-sm font-medium text-neutral-900 transition-all duration-300 hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-white dark:hover:border-(--visora-accent)"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              )}

              {settings.privacy.showEmail && emailUrl && (
                <a
                  href={emailUrl}
                  className="inline-flex min-w-44 flex-1 items-center justify-center gap-2 rounded-[var(--visora-btn-radius)] border border-neutral-200/80 bg-white/80 px-6 py-4 text-sm font-medium text-neutral-900 transition-all duration-300 hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-white dark:hover:border-(--visora-accent)"
                >
                  <EnvelopeIcon />
                  Correo directo
                </a>
              )}
            </div>
          </div>

          {/* Columna derecha: Datos y Redes */}
          <div className="flex flex-col gap-6 lg:col-span-5 lg:items-end lg:text-right">
            {settings.privacy.showLocation && profile.location && (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  Ubicación
                </p>

                <p className="mt-2 text-base text-neutral-700 dark:text-neutral-200">
                  {profile.location}
                </p>
              </div>
            )}

            {settings.privacy.showEmail && profile.email && (
              <div>
                <div className="flex items-center gap-2 lg:justify-end">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                    Email
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.email, "email")}
                    className="text-xs text-neutral-400 transition-colors hover:text-(--visora-accent) dark:text-neutral-500"
                    title="Copiar email al portapapeles"
                  >
                    {copiedItem === "email" ? (
                      <span className="font-sans font-medium text-(--visora-accent)">
                        ✓ Copiado
                      </span>
                    ) : (
                      "Copiar"
                    )}
                  </button>
                </div>

                <a
                  href={`mailto:${profile.email}`}
                  className="mt-2 inline-block text-base text-neutral-700 transition-colors hover:text-(--visora-accent) dark:text-neutral-200"
                >
                  {profile.email}
                </a>
              </div>
            )}

            {socials.map((link) => (
              <div key={link.platform}>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  {socialLabel(link.platform)}
                </p>

                <a
                  href={socialUrl(link.platform, link.handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-base text-neutral-700 transition-colors hover:text-(--visora-accent) dark:text-neutral-200"
                >
                  {link.handle}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Acordeón de Preguntas Frecuentes */}
        {contactConfig?.showFaqs !== false &&
          contactConfig?.faqs &&
          contactConfig.faqs.length > 0 && (
            <div className="mt-24 border-t border-neutral-200/70 pt-16 dark:border-white/10">
              <header className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
                  Respuestas Rápidas
                </p>
                <h3 className="mt-2 text-2xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] sm:text-3xl">
                  Preguntas frecuentes antes de contratar
                </h3>
              </header>

              <div className="mt-8 divide-y divide-neutral-200/60 dark:divide-white/10">
                {contactConfig.faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group py-5 text-left [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-neutral-900 dark:text-neutral-100">
                      <span>{faq.question}</span>
                      <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-500 transition-transform duration-200 group-open:rotate-45 dark:border-white/20 dark:text-neutral-400">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
      </div>

      {admin && contactOpen && (
        <Suspense fallback={null}>
          <EditContactModal
            open={contactOpen}
            onClose={() => setContactOpen(false)}
          />
        </Suspense>
      )}
    </main>
  );
}

export default ContactPage;
