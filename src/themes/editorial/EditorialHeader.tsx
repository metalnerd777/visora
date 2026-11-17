import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { usePortfolio } from "../../lib/usePortfolio";
import { logout } from "../../lib/auth";
import { useAdmin } from "../../lib/useAdmin";

import type { HeaderProps } from "../types";

const menuItems = [
  { label: "Destacadas", href: "#featured" },
  { label: "Proyectos", href: "#projects" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

function EditorialHeader({ darkMode, onToggleDarkMode }: HeaderProps) {
  const { profile, settings } = usePortfolio();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const admin = useAdmin();

  const brand = settings.general.brandName || profile.name;
  const profession = settings.general.profession || profile.profession;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header
        data-theme="editorial"
        className={`
          sticky top-0 z-40
          border-b
          transition-[background-color,border-color,box-shadow] duration-300
          ${
            scrolled
              ? "border-[#1C1C1F]/15 bg-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:border-[#E9E6DF]/15 dark:bg-[#0B0A14]/85"
              : "border-[#1C1C1F]/10 bg-white/70 backdrop-blur-xl dark:border-[#E9E6DF]/10 dark:bg-[#0B0A14]/70"
          }
        `}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
          {/* Ranura superior del masthead */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-[3px] border-b border-double border-[#1C1C1F]/40 dark:border-[#E9E6DF]/40 md:inset-x-10" />

          {/* Marca */}
          <Link
            to="/"
            className="relative z-10 text-xl font-semibold uppercase tracking-[0.24em] text-black transition-opacity hover:opacity-70 dark:text-[#F3EFE6]"
          >
            {brand}
          </Link>

          {/* Universo */}
          <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 text-sm uppercase tracking-[0.35em] text-black/30 dark:text-[#F3EFE6]/30 lg:block" />

          {/* Desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {menuItems.map((item) => {
              const isAnchor = item.href.startsWith("#");

              return (
                <Link
                  key={item.label}
                  to={isAnchor ? "/" : item.href}
                  state={
                    isAnchor ? { scrollTo: item.href.slice(1) } : undefined
                  }
                  className="text-xs uppercase tracking-[0.18em] text-black/70 transition-colors hover:text-black dark:text-[#F3EFE6]/70 dark:hover:text-[#F3EFE6]"
                >
                  {item.label}
                </Link>
              );
            })}

            <span className="mx-1 h-5 w-px bg-black/15 dark:bg-[#F3EFE6]/15" />

            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              className="flex h-8 w-8 items-center justify-center border border-black/20 text-sm text-black/70 transition-colors hover:border-black hover:text-black dark:border-[#F3EFE6]/20 dark:text-[#F3EFE6]/70 dark:hover:border-[#F3EFE6] dark:hover:text-[#F3EFE6]"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            {admin && (
              <>
                <Link
                  to="/configuracion"
                  className="inline-flex items-center gap-1.5 border border-black/25 bg-black/5 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-black transition-colors hover:border-black hover:bg-black hover:text-white dark:border-[#F3EFE6]/25 dark:bg-[#F3EFE6]/5 dark:text-[#F3EFE6] dark:hover:border-[#F3EFE6] dark:hover:bg-[#F3EFE6] dark:hover:text-black"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                  <span>Configuración</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  className="flex h-8 w-8 items-center justify-center border border-black/25 text-black/80 transition-colors hover:border-red-500 hover:text-red-500 dark:border-[#F3EFE6]/25 dark:text-[#F3EFE6]/80 dark:hover:border-red-400 dark:hover:text-red-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </>
            )}
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              className="text-lg text-black/70 dark:text-[#F3EFE6]/70"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="flex h-10 w-10 items-center justify-center"
            >
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-black dark:bg-[#F3EFE6]" />
                <span className="block h-0.5 w-5 bg-black dark:bg-[#F3EFE6]" />
                <span className="block h-0.5 w-5 bg-black dark:bg-[#F3EFE6]" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil editorial */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden">
          <aside className="ml-auto flex h-full w-80 flex-col border-l border-[#1C1C1F]/15 bg-[#F6F2E9] p-8 dark:border-[#E9E6DF]/15 dark:bg-[#0E0C1A]">
            <div className="mb-10 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold uppercase tracking-[0.2em] text-black dark:text-[#F3EFE6]">
                  {brand}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-black/50 dark:text-[#F3EFE6]/50">
                  {profession}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="text-3xl leading-none text-black/60 dark:text-[#F3EFE6]/60"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-col divide-y divide-[#1C1C1F]/10 dark:divide-[#E9E6DF]/10">
              {menuItems.map((item) => {
                const isAnchor = item.href.startsWith("#");

                return (
                  <Link
                    key={item.label}
                    to={isAnchor ? "/" : item.href}
                    state={
                      isAnchor ? { scrollTo: item.href.slice(1) } : undefined
                    }
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-none py-4 text-sm uppercase tracking-[0.2em] text-black/80 dark:text-[#F3EFE6]/80"
                  >
                    <span>{item.label}</span>
                    <span className="text-black/30 dark:text-[#F3EFE6]/30">→</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3">
              {admin && (
                <>
                  <Link
                    to="/configuracion"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-none py-4 text-sm uppercase tracking-[0.2em] text-black/80 transition-colors hover:text-black dark:text-[#F3EFE6]/80 dark:hover:text-[#F3EFE6]"
                  >
                    <span>Configuración</span>
                    <span className="text-black/30 dark:text-[#F3EFE6]/30">→</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="block w-full border border-red-400/40 px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-red-500"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default EditorialHeader;