import { usePortfolio } from "../lib/usePortfolio";
import { nonEmptySocials, socialUrl, socialLabel } from "../lib/socials";
import { resizeUrl } from "../lib/image";

function About() {
  const { profile, settings } = usePortfolio();
  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);
  const portrait = profile.aboutImage ?? profile.avatar;
  const focusX = profile.aboutImageFocusX ?? 50;
  const focusY = profile.aboutImageFocusY ?? 50;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        {/* Retrato */}
        <div className="lg:col-span-5">
          {portrait ? (
            <figure className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10 ring-1 ring-black/5 dark:ring-white/10">
                <img
                  src={resizeUrl(portrait, 1200)}
                  alt={`Retrato de ${profile.name}`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: `${focusX}% ${focusY}%` }}
                  className="aspect-4/5 w-full object-cover"
                />
              </div>

              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 translate-x-5 translate-y-5 rounded-[2rem] border border-(--visora-accent)/30"
              />
            </figure>
          ) : (
            <div className="flex aspect-4/5 w-full items-center justify-center rounded-[2rem] bg-gradient-to-br from-(--visora-accent)/15 via-(--visora-accent)/5 to-transparent ring-1 ring-(--visora-accent)/20">
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

          <div className="mt-8 max-w-xl space-y-4">
            {profile.aboutDescription
              .split(/\n\s*\n/)
              .map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8] md:text-lg md:leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
          </div>

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
    </div>
  );
}

export default About;
