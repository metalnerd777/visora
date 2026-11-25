import { usePortfolio } from "../lib/usePortfolio";
import { nonEmptySocials, socialUrl, socialLabel } from "../lib/socials";
import { resizeUrl } from "../lib/image";
import RichHtml from "./RichHtml";

function About() {
  const { profile, settings } = usePortfolio();
  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);
  const portrait = profile.aboutImage ?? profile.avatar;
  const aspect =
    profile.aboutImageAspect === null
      ? null
      : (profile.aboutImageAspect ?? 4 / 5);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto grid max-w-xl gap-10 lg:max-w-none lg:grid-cols-12 lg:items-center lg:gap-16">
        {/* Retrato */}
        <div className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          {portrait ? (
            <figure className="relative">
              <div className="overflow-hidden rounded-[1.5rem] shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:rounded-[2rem] dark:ring-white/10">
                <img
                  src={resizeUrl(portrait, 1200)}
                  alt={`Retrato de ${profile.name}`}
                  loading="lazy"
                  decoding="async"
                  style={aspect ? { aspectRatio: aspect } : undefined}
                  className={`w-full ${aspect ? "object-cover" : ""}`}
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[1.5rem] border border-(--visora-accent)/30 sm:translate-x-5 sm:translate-y-5 sm:rounded-[2rem]"
              />
            </figure>
          ) : (
            <div
              style={{ aspectRatio: aspect ?? 4 / 5 }}
              className="flex w-full items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-(--visora-accent)/15 via-(--visora-accent)/5 to-transparent ring-1 ring-(--visora-accent)/20 sm:rounded-[2rem]"
            >
              <span className="text-7xl font-extralight tracking-tight text-(--visora-accent)/40">
                {profile.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
            Sobre mí
          </p>

          <h2 className="max-w-2xl text-3xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] sm:text-4xl md:text-5xl">
            {profile.aboutTitle}
          </h2>

          <RichHtml
            html={profile.aboutDescription}
            className="about-rich mt-8 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8] md:text-lg md:leading-relaxed"
          />

          {profile.dossierUrl && (
            <div className="mt-8">
              <a
                href={profile.dossierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-[var(--visora-btn-radius)] border border-neutral-300/80 bg-white/80 px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-neutral-800 shadow-sm backdrop-blur-md transition-all hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-white/15 dark:bg-white/5 dark:text-neutral-200 dark:hover:border-(--visora-accent)"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{profile.dossierLabel || "Descargar Dossier / Tarifas (PDF)"}</span>
              </a>
            </div>
          )}

          {/* Ubicación + redes */}
          <div className="mt-10 flex flex-col gap-6 border-t border-neutral-200/70 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            {profile.location && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
                  Ubicación
                </p>
                <p className="mt-1 text-sm text-neutral-900 dark:text-[#F5F3FF]">
                  {profile.location}
                </p>
              </div>
            )}

            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {socials.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={socialUrl(link.platform, link.handle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-900 transition-colors hover:text-(--visora-accent) dark:text-[#F5F3FF]"
                    >
                      {socialLabel(link.platform)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Marcas y Clientes Destacados */}
      {profile.clients && profile.clients.length > 0 && (
        <section className="mt-24 border-t border-neutral-200/70 pt-16 dark:border-white/10">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
            Confianza & Publicaciones
          </p>
          <h3 className="mt-2 text-2xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] sm:text-3xl">
            Clientes y editoriales seleccionadas
          </h3>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
            {profile.clients.map((client) => {
              const content = (
                <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-200/80 bg-white/60 px-5 py-3.5 backdrop-blur-sm transition-all hover:border-(--visora-accent)/50 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:border-(--visora-accent)/50 dark:hover:bg-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--visora-accent)" />
                  <span className="text-sm font-medium tracking-wide text-neutral-800 dark:text-neutral-200">
                    {client.name}
                  </span>
                </div>
              );

              return client.url ? (
                <a
                  key={client.id}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:-translate-y-0.5"
                >
                  {content}
                </a>
              ) : (
                <div key={client.id}>{content}</div>
              );
            })}
          </div>
        </section>
      )}

      {/* Testimonios */}
      {profile.testimonials && profile.testimonials.length > 0 && (
        <section className="mt-20 border-t border-neutral-200/70 pt-16 dark:border-white/10">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
            Opiniones de Clientes
          </p>
          <h3 className="mt-2 text-2xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] sm:text-3xl">
            Lo que dicen de trabajar conmigo
          </h3>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {profile.testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="flex flex-col justify-between rounded-3xl border border-neutral-200/70 bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-8"
              >
                <p className="text-sm italic leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <footer className="mt-6 border-t border-neutral-200/60 pt-4 dark:border-white/10">
                  <cite className="not-italic">
                    <span className="block text-sm font-medium text-neutral-900 dark:text-white">
                      {t.author}
                    </span>
                    {(t.role || t.company) && (
                      <span className="block text-xs text-neutral-400 dark:text-[#A8A3B8]">
                        {[t.role, t.company].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default About;
