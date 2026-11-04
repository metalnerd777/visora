import { Link, useNavigate } from "react-router-dom";

import { usePortfolio } from "../../lib/usePortfolio";
import { socialUrl, socialLabel, nonEmptySocials } from "../../lib/socials";
import { logout } from "../../lib/auth";
import { useAdmin } from "../../lib/useAdmin";
import SocialIcon from "../../components/SocialIcon";

const exploreLinks = [
  { label: "Inicio", to: "/" },
  { label: "Sobre mí", to: "/sobre-mi" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

function EditorialFooter() {
  const { profile, settings } = usePortfolio();
  const navigate = useNavigate();
  const admin = useAdmin();

  const brand = settings.general.brandName || profile.name;
  const profession = settings.general.profession || profile.profession;
  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <footer className="mt-auto border-t-2 border-double border-[#1C1C1F]/25 px-6 pb-10 pt-14 transition-colors dark:border-[#E9E6DF]/25 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Columnas */}
        <div className="grid grid-cols-1 gap-10 pt-10 md:grid-cols-3">
          <nav className="flex flex-col gap-3">
            {exploreLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="group flex items-center justify-between border-b border-[#1C1C1F]/10 py-3 text-sm uppercase tracking-[0.2em] text-black/80 transition-colors hover:text-black dark:border-[#E9E6DF]/10 dark:text-[#F3EFE6]/80 dark:hover:text-[#F3EFE6]"
              >
                <span>{link.label}</span>
                <span className="text-black/30 transition-transform group-hover:translate-x-1 dark:text-[#F3EFE6]/30">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="md:col-span-2">
            <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                  Contacto
                </p>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold uppercase tracking-[0.06em] text-black dark:text-[#F3EFE6]">
                    {brand}
                  </h3>

                  {profession && (
                    <p className="text-xs uppercase tracking-[0.3em] text-black/50 dark:text-[#F3EFE6]/50">
                      {profession}
                    </p>
                  )}
                </div>

                {settings.privacy.showEmail && profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="block text-sm text-black/80 transition-colors hover:text-black dark:text-[#F3EFE6]/80 dark:hover:text-[#F3EFE6]"
                  >
                    {profile.email}
                  </a>
                )}

                {settings.privacy.showLocation && profile.location && (
                  <p className="text-sm text-black/80 dark:text-[#F3EFE6]/80">
                    {profile.location}
                  </p>
                )}

                {socials.map((link) => (
                  <a
                    key={link.platform}
                    href={socialUrl(link.platform, link.handle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-sm text-black/80 transition-colors hover:text-black dark:text-[#F3EFE6]/80 dark:hover:text-[#F3EFE6]"
                  >
                    <SocialIcon
                      platform={link.platform}
                      className="h-4 w-4 shrink-0 text-black/50 transition-colors group-hover:text-black dark:text-[#F3EFE6]/50 dark:group-hover:text-[#F3EFE6]"
                    />
                    {socialLabel(link.platform)}
                  </a>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
                  Administración
                </p>

                {admin ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-block border border-red-400/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <Link
                    to="/admin"
                    className="inline-block border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/80 transition-colors hover:border-black dark:border-[#F3EFE6]/20 dark:text-[#F3EFE6]/80 dark:hover:border-[#F3EFE6]"
                  >
                    Administrador
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Línea final */}
        <div className="mt-12 flex flex-col gap-2 border-t border-[#1C1C1F]/10 pt-6 text-xs text-black/50 transition-colors dark:border-[#E9E6DF]/10 dark:text-[#F3EFE6]/50 md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} {brand}
          </span>

          {settings.privacy.notice && (
            <span className="max-w-md text-right">
              {settings.privacy.notice}
            </span>
          )}

          <span>
            Desarrollado por Juan Andrés PM{" "}
            <a href="https://instagram.com/draugur_dev">@draugur_dev</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default EditorialFooter;
