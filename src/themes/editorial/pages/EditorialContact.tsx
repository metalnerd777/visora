import { useState } from "react";

import EditableSection from "../../../pages/admin/edit/EditableSection";
import EditContactModal from "../../../pages/admin/edit/EditContactModal";

import { usePortfolio } from "../../../lib/usePortfolio";
import { useAdmin } from "../../../lib/useAdmin";
import { socialUrl, nonEmptySocials } from "../../../lib/socials";
import { loadJSON } from "../../../lib/storage";
import { isSafeUrl } from "../../../lib/validation";

function EditorialContact() {
  const { profile, settings } = usePortfolio();
  const admin = useAdmin();
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

      {/* Canales */}
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
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                    Disponibilidad
                  </p>
                  <p className="text-sm text-black/75 dark:text-[#F3EFE6]/75">
                    Respondo normalmente en menos de 24 horas.
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {admin && (
        <EditContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
        />
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