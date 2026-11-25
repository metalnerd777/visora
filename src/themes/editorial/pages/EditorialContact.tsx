import { lazy, Suspense, useState } from "react";

import EditableSection from "../../../pages/admin/edit/EditableSection";

import { usePortfolio } from "../../../lib/usePortfolio";
import { useAdmin } from "../../../lib/useAdmin";
import { socialUrl, nonEmptySocials } from "../../../lib/socials";
import { isSafeUrl } from "../../../lib/validation";

const EditContactModal = lazy(
  () => import("../../../pages/admin/edit/EditContactModal"),
);

function EditorialContact() {
  const { profile, settings, contactConfig } = usePortfolio();
  const admin = useAdmin();
  const [contactOpen, setContactOpen] = useState(false);

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [inquiryType, setInquiryType] = useState("Comisión Editorial");
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

  const channels = [
    {
      label: "Instagram",
      value: instagram?.handle,
      url: safeInstagramUrl ? instagramUrl : "",
    },
    {
      label: "WhatsApp",
      value: whatsappPhone || null,
      url: whatsappUrl ?? "",
    },
    {
      label: "Email",
      value:
        settings.privacy.showEmail && profile.email ? profile.email : null,
      url: settings.privacy.showEmail ? emailUrl : "",
    },
  ].filter((channel) => channel.value);

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
      `Encargo: ${inquiryType}`,
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

  return (
    <main>
      {/* Encabezado */}
      <header className="border-b border-[#1C1C1F]/15 px-6 py-14 md:px-10 md:py-20 dark:border-[#E9E6DF]/15">
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection
              label="Editar contacto"
              onEdit={() => setContactOpen(true)}
            >
              <ContactHeader />
            </EditableSection>
          ) : (
            <ContactHeader />
          )}
        </div>
      </header>

      {/* Canales y Formulario */}
      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          {channels.length > 0 ? (
            <div className="grid divide-y divide-[#1C1C1F]/15 border-t-2 border-double border-[#1C1C1F]/20 dark:divide-[#E9E6DF]/15 dark:border-[#E9E6DF]/20 md:grid-cols-3 md:divide-x md:divide-y-0">
              {channels.map((channel, index) => (
                <a
                  key={channel.label}
                  href={channel.url}
                  target={
                    channel.label === "Email" ? undefined : "_blank"
                  }
                  rel={
                    channel.label === "Email"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex flex-col gap-6 px-2 py-8 transition-colors md:px-8"
                >
                  <span className="text-sm font-semibold text-black/40 dark:text-[#F3EFE6]/40">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>

                  <span className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
                    {channel.label}
                  </span>

                  <span className="text-lg font-semibold uppercase tracking-tight text-black transition-colors group-hover:text-black/60 dark:text-[#F3EFE6] md:text-xl dark:group-hover:text-[#F3EFE6]/60">
                    {channel.value}
                  </span>

                  <span className="flex items-center gap-3 text-black/60 transition-transform group-hover:translate-x-1 dark:text-[#F3EFE6]/60">
                    <span className="h-px w-8 bg-black/30 dark:bg-[#F3EFE6]/30" />
                    Ir →
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-black/50 dark:text-[#F3EFE6]/50">
              No hay canales de contacto configurados.
            </p>
          )}

          {/* Formulario de consulta estilo revista */}
          {showForm && (profile.email || waPhone) && (
            <form
              onSubmit={handleFormSubmit}
              className="mt-16 border-t border-double border-[#1C1C1F]/20 pt-14 dark:border-[#E9E6DF]/20"
            >
              <div className="mb-8 max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45 dark:text-[#F3EFE6]/45">
                  Correspondencia directa
                </p>
                <h2 className="mt-2 text-2xl font-semibold uppercase tracking-tight text-black dark:text-[#F3EFE6] md:text-3xl">
                  Enviar propuesta o consulta
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-[#F3EFE6]/50">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Nombre completo"
                    className="border border-black/20 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black dark:border-[#E9E6DF]/20 dark:bg-[#0B0A14] dark:text-[#F3EFE6] dark:focus:border-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-[#F3EFE6]/50">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="border border-black/20 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black dark:border-[#E9E6DF]/20 dark:bg-[#0B0A14] dark:text-[#F3EFE6] dark:focus:border-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-[#F3EFE6]/50">
                    Tipo de comisión
                  </label>
                  <input
                    type="text"
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    placeholder="Ej. Editorial, Retrato, Campaña"
                    className="border border-black/20 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black dark:border-[#E9E6DF]/20 dark:bg-[#0B0A14] dark:text-[#F3EFE6] dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-[#F3EFE6]/50">
                  Detalles del proyecto
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe tu idea, fechas o requerimientos..."
                  className="border border-black/20 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-black dark:border-[#E9E6DF]/20 dark:bg-[#0B0A14] dark:text-[#F3EFE6] dark:focus:border-white"
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="bg-black px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-neutral-800 dark:bg-[#F3EFE6] dark:text-black dark:hover:bg-white"
                >
                  Enviar mensaje →
                </button>

                {sentNotice && (
                  <span className="font-mono text-xs text-black/60 dark:text-[#F3EFE6]/60">
                    ✓ Se abrió tu cliente de correo con el mensaje preparado.
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Ficha de ubicación */}
          {(settings.privacy.showLocation && profile.location) ||
          (settings.privacy.showEmail && profile.email) ? (
            <div className="mt-16 grid gap-10 border-t border-[#1C1C1F]/15 pt-10 md:grid-cols-2 dark:border-[#E9E6DF]/15">
              {settings.privacy.showLocation && profile.location && (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                    Ubicación
                  </p>
                  <p className="text-sm text-black/75 dark:text-[#F3EFE6]/75">
                    {profile.location}
                  </p>
                </div>
              )}

              {settings.privacy.showEmail && profile.email && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                      Disponibilidad
                    </p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(profile.email, "email")}
                      className="text-xs uppercase tracking-wider text-black/50 hover:text-black dark:text-[#F3EFE6]/50 dark:hover:text-white"
                    >
                      {copiedItem === "email" ? "✓ Copiado" : "Copiar email"}
                    </button>
                  </div>
                  <p className="text-sm text-black/75 dark:text-[#F3EFE6]/75">
                    Respondo normalmente en menos de 24 horas.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Acordeón de FAQ Editorial */}
          {contactConfig?.showFaqs !== false &&
            contactConfig?.faqs &&
            contactConfig.faqs.length > 0 && (
              <div className="mt-24 border-t-2 border-double border-[#1C1C1F]/20 pt-16 dark:border-[#E9E6DF]/20">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
                    Preguntas Frecuentes
                  </p>
                  <span className="text-xs uppercase tracking-[0.2em] text-black/40 dark:text-[#F3EFE6]/40">
                    Condiciones & Entrega
                  </span>
                </div>

                <div className="mt-8 divide-y divide-[#1C1C1F]/15 dark:divide-[#E9E6DF]/15">
                  {contactConfig.faqs.map((faq, idx) => (
                    <details
                      key={faq.id}
                      className="group py-6 text-left [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex cursor-pointer items-center justify-between">
                        <span className="flex items-center gap-4 text-base font-semibold uppercase tracking-tight text-black dark:text-[#F3EFE6]">
                          <span className="text-xs font-mono text-black/40 dark:text-[#F3EFE6]/40">
                            {(idx + 1).toString().padStart(2, "0")}
                          </span>
                          <span>{faq.question}</span>
                        </span>
                        <span className="text-sm text-black/40 transition-transform duration-200 group-open:rotate-90 dark:text-[#F3EFE6]/40">
                          →
                        </span>
                      </summary>
                      <p className="mt-4 max-w-2xl pl-8 text-sm leading-relaxed text-black/70 dark:text-[#F3EFE6]/70">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
        </div>
      </section>

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

function ContactHeader() {
  const { profile } = usePortfolio();

  return (
    <div className="flex items-end justify-between gap-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
          Contacto
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-[#F3EFE6] sm:text-5xl md:text-6xl">
          {profile.contactTitle ?? "Hablemos."}
        </h1>

        {profile.contactDescription && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-black/60 dark:text-[#F3EFE6]/60">
            {profile.contactDescription}
          </p>
        )}
      </div>
    </div>
  );
}

export default EditorialContact;
