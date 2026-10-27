import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { usePortfolio } from "../lib/usePortfolio";
import { socialUrl, socialLabel, nonEmptySocials } from "../lib/socials";
import SocialIcon from "./SocialIcon";
import { isAuthenticated, logout } from "../lib/auth";

const exploreLinks = [
  { label: "Inicio", to: "/" },
  { label: "Sobre mí", to: "/sobre-mi" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

function Footer() {
  const { profile, settings } = usePortfolio();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(isAuthenticated());

  const brand = settings.general.brandName || profile.name;
  const profession = settings.general.profession || profile.profession;
  const rawSocials =
    settings.socials.length > 0 ? settings.socials : profile.socialLinks;
  const socials = nonEmptySocials(rawSocials);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    setAdmin(false);
    navigate("/");
  };

  return (
    <footer className="mt-auto border-t border-neutral-200/60 px-6 pb-10 pt-14 transition-colors dark:border-[#27243A]/60 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* Marca + redes */}
          <div>
            <Link
              to="/"
              className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-900 transition-opacity hover:opacity-60 dark:text-[#F5F3FF]"
            >
              {brand}
            </Link>

            <p className="mt-2 text-sm text-neutral-500 dark:text-[#A8A3B8]">
              {profession}
            </p>

            {/* Redes */}
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((link) => (
                <a
                  key={link.platform}
                  href={socialUrl(link.platform, link.handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
                >
                  <SocialIcon
                    platform={link.platform}
                    className="h-4 w-4 shrink-0 text-current"
                  />
                  {socialLabel(link.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Explora */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-400 dark:text-[#6F6A80]">
              Explora
            </p>

            <nav className="flex flex-col gap-2">
              {exploreLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-neutral-600 transition-colors hover:text-black dark:text-[#A8A3B8] dark:hover:text-[#F5F3FF]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Administrador / Sesión */}
          <div className="md:mt-8">
            {admin ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-red-300/40 bg-red-50/80 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-red-500 transition-colors hover:border-red-400 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            ) : (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-900 dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Administrador
              </Link>
            )}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-14 flex flex-col gap-2 border-t border-neutral-200/60 pt-6 text-xs text-neutral-400 transition-colors dark:border-[#27243A]/60 dark:text-[#6F6A80] md:flex-row md:justify-between">
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

export default Footer;
