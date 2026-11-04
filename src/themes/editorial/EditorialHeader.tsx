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
                  className="text-xs uppercase tracking-[0.18em] text-black/70 transition-colors hover:text-black dark:text-[#F3EFE6]/70 dark:hover:text-[#F3EFE6]"
                >
                  Configuración
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="border border-black/20 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-black/80 transition-colors hover:border-red-500 hover:text-red-500 dark:border-[#F3EFE6]/20 dark:text-[#F3EFE6]/80 dark:hover:text-red-400"
                >
                  Salir
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