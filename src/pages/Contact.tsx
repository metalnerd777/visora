import { useEffect, useState } from "react";

import { usePortfolio } from "../lib/usePortfolio";
import { socialUrl, socialLabel, nonEmptySocials } from "../lib/socials";
import { loadJSON } from "../lib/storage";
import { isAuthenticated } from "../lib/auth";
import { isSafeUrl } from "../lib/validation";

import EditableSection from "./admin/edit/EditableSection";
import EditContactModal from "./admin/edit/EditContactModal";

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
  const { profile, settings } = usePortfolio();
  const [admin, setAdmin] = useState(isAuthenticated());
  const [contactOpen, setContactOpen] = useState(false);

  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);

  const contactConfig = loadJSON<{
    whatsappPhone?: string;
    whatsappMessage?: string;
    emailSubject?: string;
  }>("visora-admin-contact", {});

  const whatsappPhone = contactConfig?.whatsappPhone ?? "";
  const whatsappMessage = contactConfig?.whatsappMessage?.trim() ?? "";
  const emailSubject =
    contactConfig?.emailSubject?.trim() ?? "Contacto desde el portfolio";

  const waPhone = whatsappPhone.replace(/\+/g, "");
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

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const header = (
    <header className="max-w-3xl pt-16 md:pt-24">
      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
        Contacto
      </p>

      <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-6xl">
        {profile.contactTitle ?? "Hablemos."}
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
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

        {/* Botones de contacto */}
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {safeInstagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-8 py-4 text-sm text-white shadow-lg shadow-neutral-900/10 transition-all duration-300 hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:shadow-black/30 dark:hover:bg-(--visora-accent) dark:hover:text-white"
              >
                <InstagramIcon />
                Envíame un mensaje por Instagram
              </a>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-8 py-4 text-sm text-white shadow-lg shadow-neutral-900/10 transition-all duration-300 hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:shadow-black/30 dark:hover:bg-(--visora-accent) dark:hover:text-white"
              >
                <WhatsAppIcon />
                Escríbeme por WhatsApp
              </a>
            )}

            {settings.privacy.showEmail && emailUrl && (
              <a
                href={emailUrl}
                className="inline-flex min-w-44 items-center justify-center gap-2 rounded-[var(--visora-btn-radius)] bg-neutral-900 px-8 py-4 text-sm text-white shadow-lg shadow-neutral-900/10 transition-all duration-300 hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:shadow-black/30 dark:hover:bg-(--visora-accent) dark:hover:text-white"
              >
                <EnvelopeIcon />
                Escríbeme un correo
              </a>
            )}
          </div>

          <div className="flex flex-col gap-6 md:items-end md:text-right">
            {settings.privacy.showLocation && profile.location && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                  Ubicación
                </p>

                <p className="mt-2 text-sm text-neutral-600 dark:text-[#C9C4D8]">
                  {profile.location}
                </p>
              </div>
            )}

            {settings.privacy.showEmail && profile.email && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                  Email
                </p>

                <a
                  href={`mailto:${profile.email}`}
                  className="mt-2 inline-block text-sm text-neutral-600 transition-colors hover:text-(--visora-accent) dark:text-[#C9C4D8]"
                >
                  {profile.email}
                </a>
              </div>
            )}

            {socials.map((link) => (
              <div key={link.platform}>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                  {socialLabel(link.platform)}
                </p>

                <a
                  href={socialUrl(link.platform, link.handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-neutral-600 transition-colors hover:text-(--visora-accent) dark:text-[#C9C4D8]"
                >
                  {link.handle}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {admin && (
        <EditContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      )}
    </main>
  );
}

export default ContactPage;
