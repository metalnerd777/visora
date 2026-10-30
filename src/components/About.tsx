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
