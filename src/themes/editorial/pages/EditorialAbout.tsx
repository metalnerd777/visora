import { useState } from "react";

import EditableSection from "../../../pages/admin/edit/EditableSection";
import EditAboutModal from "../../../pages/admin/edit/EditAboutModal";

import { usePortfolio } from "../../../lib/usePortfolio";
import { useAdmin } from "../../../lib/useAdmin";
import { nonEmptySocials, socialLabel, socialUrl } from "../../../lib/socials";
import { resizeUrl } from "../../../lib/image";
import SocialIcon from "../../../components/SocialIcon";

function EditorialAbout() {
  const { profile, settings } = usePortfolio();
  const admin = useAdmin();
  const [aboutOpen, setAboutOpen] = useState(false);

  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);
  const portrait = profile.aboutImage ?? profile.avatar;
  const focusX = profile.aboutImageFocusX ?? 50;
  const focusY = profile.aboutImageFocusY ?? 50;

  return (
    <main>
      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Columna 1: título + contenido */}
          <div className="lg:col-span-7">
            {admin ? (
              <EditableSection
                label="Editar sobre mí"
                onEdit={() => setAboutOpen(true)}
              >
                <AboutIntro />
                <AboutBody />
              </EditableSection>
            ) : (
              <>
                <AboutIntro />
                <AboutBody />
              </>
            )}
          </div>

          {/* Columna 2: imagen + ficha */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              {portrait ? (
                <figure>
                  <div className="overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                    <img
                      src={resizeUrl(portrait, 800)}
                      alt={`Retrato de ${profile.name}`}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: `${focusX}% ${focusY}%` }}
                      className="aspect-4/5 w-full object-cover"
                    />
                  </div>

                  <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#1C1C1F]/15 pt-3 dark:border-[#E9E6DF]/15">
                    <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                      El autor
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/70 dark:text-[#F3EFE6]/70">
                      {profile.name}
                    </span>
                  </figcaption>
                </figure>
              ) : (
                <div className="flex aspect-4/5 w-full items-center justify-center ring-1 ring-black/10 dark:ring-white/10">
                  <div className="text-center">
                    <span className="text-7xl font-semibold uppercase text-black/20 dark:text-[#F3EFE6]/20 font-[family-name:var(--visora-font-display)]">
                      {profile.name.charAt(0)}
                    </span>
                    <p className="mt-3 text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                      {profile.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Ficha de datos */}
              <div className="mt-10 flex flex-col gap-8">
                {settings.privacy.showLocation && profile.location && (
                  <div className="border-t-2 border-double border-[#1C1C1F]/25 pt-5 dark:border-[#E9E6DF]/25">
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                      Ubicación
                    </p>
                    <p className="text-sm font-medium text-black/75 dark:text-[#F3EFE6]/75">
                      {profile.location}
                    </p>
                  </div>
                )}

                <div className="border-t-2 border-double border-[#1C1C1F]/25 pt-5 dark:border-[#E9E6DF]/25">
                  <p className="mb-1 text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                    Sígueme en
                  </p>

                  {socials.length > 0 ? (
                    <div className="divide-y divide-[#1C1C1F]/15 dark:divide-[#E9E6DF]/15">
                      {socials.map((link, index) => (
                        <a
                          key={link.platform}
                          href={socialUrl(link.platform, link.handle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 py-3.5 text-sm uppercase tracking-[0.15em] text-black/80 transition-colors hover:text-black dark:text-[#F3EFE6]/80 dark:hover:text-[#F3EFE6]"
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-black/30 dark:text-[#F3EFE6]/30">
                              {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <SocialIcon
                              platform={link.platform}
                              className="h-4 w-4 text-black/40 transition-colors group-hover:text-black dark:text-[#F3EFE6]/40 dark:group-hover:text-[#F3EFE6]"
                            />
                            <span>{socialLabel(link.platform)}</span>
                          </span>
                          <span className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="pt-3 text-sm text-black/50 dark:text-[#F3EFE6]/50">
                      Sin redes configuradas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {admin && (
        <EditAboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      )}
    </main>
  );
}

function AboutIntro() {
  const { profile, settings } = usePortfolio();

  return (
    <div>
      <div className="flex items-end justify-between gap-8">
        <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
          {profile.profession || settings.general.profession} · Sobre mí
        </p>

        <span className="hidden shrink-0 items-center gap-3 pb-1 md:flex">
          <span className="h-px w-10 bg-black/30 dark:bg-[#F3EFE6]/30" />
          <span className="text-sm font-semibold text-black/40 dark:text-[#F3EFE6]/40">
            Nº 01
          </span>
        </span>
      </div>

      <h1 className="mt-6 max-w-3xl text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-[#F3EFE6] sm:text-5xl md:text-6xl">
        {profile.aboutTitle}
      </h1>

      {/* Deck editorial */}
      {profile.description && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-black/55 dark:text-[#F3EFE6]/55 md:text-lg">
          {profile.description}
        </p>
      )}
    </div>
  );
}

function AboutBody() {
  const { profile } = usePortfolio();

  const paragraphs = profile.aboutDescription.split(/\n\s*\n/);

  return (
    <article className="mt-12 max-w-prose border-t-[3px] border-double border-black/20 pt-8 dark:border-[#F3EFE6]/20">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={`mt-6 text-sm leading-loose text-black/70 dark:text-[#F3EFE6]/70 first:mt-0 md:text-lg md:leading-loose ${
            index === 0
              ? "first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--visora-font-display)] first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] md:first-letter:text-8xl md:first-letter:leading-[0.8]"
              : ""
          }`}
        >
          {paragraph}
        </p>
      ))}
    </article>
  );
}

export default EditorialAbout;