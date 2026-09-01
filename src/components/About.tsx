import { usePortfolio } from "../lib/usePortfolio";
import { nonEmptySocials, socialUrl } from "../lib/socials";

function About() {
  const { profile, settings } = usePortfolio();
  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);

  return (
    <div className="mx-auto max-w-7xl">
      <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
        Sobre mí
      </p>

      <h2 className="max-w-2xl text-3xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] sm:text-4xl md:text-5xl">
        {profile.aboutTitle}
      </h2>

      {/* Texto + ubicación / redes */}
      <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <p className="max-w-xl text-base leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
          {profile.aboutDescription}
        </p>

        <div className="flex flex-col gap-1 md:items-end md:text-right">
          {profile.location && (
            <p className="text-sm text-neutral-500 dark:text-[#A8A3B8]">
              {profile.location}
            </p>
          )}

          {socials.map((link) => (
            <a
              key={link.platform}
              href={socialUrl(link.platform, link.handle)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-900 transition-colors hover:text-(--visora-accent) dark:text-[#F5F3FF]"
            >
              {link.handle}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
