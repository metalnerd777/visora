import { Link } from "react-router-dom";

import { photographer } from "../data/portfolio";
import { instagramUrl, behanceUrl } from "../lib/socials";

const exploreLinks = [
  { label: "Inicio", to: "/" },
  { label: "Sobre mí", to: "/sobre-mi" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

function Footer() {
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
              {photographer.name}
            </Link>

            <p className="mt-2 text-sm text-neutral-500 dark:text-[#A8A3B8]">
              {photographer.profession}
            </p>

            {/* Redes */}
            <div className="mt-6 flex flex-wrap gap-2">
              {photographer.instagram && (
                <a
                  href={instagramUrl(photographer.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
                >
                  Instagram
                </a>
              )}

              {photographer.behance && (
                <a
                  href={behanceUrl(photographer.behance)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
                >
                  Behance
                </a>
              )}
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

          {/* Administrador */}
          <div className="md:mt-8">
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
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-14 flex flex-col gap-2 border-t border-neutral-200/60 pt-6 text-xs text-neutral-400 transition-colors dark:border-[#27243A]/60 dark:text-[#6F6A80] md:flex-row md:justify-between">
          <span>
            © {new Date().getFullYear()} {photographer.name}
          </span>

          <span>"Visora" desarrollado por Juan Andrés PM</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
