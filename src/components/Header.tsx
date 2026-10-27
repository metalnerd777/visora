import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { usePortfolio } from "../lib/usePortfolio";
import { isAuthenticated, logout } from "../lib/auth";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const menuItems = [
  { label: "Destacadas", href: "#featured" },
  { label: "Proyectos", href: "#projects" },
  { label: "Sobre mí", href: "/sobre-mi" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

function HeaderLink({
  item,
  onClick,
}: {
  item: (typeof menuItems)[number];
  onClick?: () => void;
}) {
  const isAnchor = item.href.startsWith("#");

  return (
    <Link
      to={isAnchor ? "/" : item.href}
      state={isAnchor ? { scrollTo: item.href.slice(1) } : undefined}
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-900/5 hover:text-black dark:text-[#A8A3B8] dark:hover:bg-white/10 dark:hover:text-[#F5F3FF]"
    >
      {item.label}
    </Link>
  );
}

function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const { profile, settings } = usePortfolio();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [admin, setAdmin] = useState(isAuthenticated);

  const brand = settings.general.brandName || profile.name;

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
    <>
      <header
        className={`
    sticky top-0 z-40
    border-b
    transition-[background-color,border-color,box-shadow] duration-300
    ${
      scrolled
        ? "border-neutral-200/50 bg-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-2xl dark:border-[#27243A]/50 dark:bg-[#0B0A14]/70"
        : "border-neutral-200/25 bg-white/50 backdrop-blur-xl dark:border-[#27243A]/25 dark:bg-[#0B0A14]/50"
    }
  `}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <Link
            to="/"
            className="text-sm font-medium uppercase tracking-[0.3em] text-neutral-900 transition-opacity hover:opacity-60 dark:text-[#F5F3FF]"
          >
            {brand}
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-2 md:flex">
            {menuItems.map((item) => (
              <HeaderLink key={item.label} item={item} />
            ))}

            {admin && (
              <>
                <Link
                  to="/configuracion"
                  className="rounded-full px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-900/5 hover:text-black dark:text-[#A8A3B8] dark:hover:bg-white/10 dark:hover:text-[#F5F3FF]"
                >
                  Configuración
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-2 rounded-full border border-red-300/40 bg-red-50/80 px-3 py-1.5 text-xs text-red-500 backdrop-blur-md transition-colors hover:border-red-400 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {/* Theme switch */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              className="relative ml-2 flex h-7 w-[50px] shrink-0 items-center rounded-full border border-neutral-300 bg-neutral-200 p-[3px] transition-colors duration-300 dark:border-[#38334F] dark:bg-[#1C1930]"
            >
              <span
                className={`absolute left-[7px] text-[10px] leading-none transition-opacity duration-300 ${
                  darkMode ? "opacity-35" : "opacity-100"
                }`}
              >
                ☀
              </span>

              <span
                className={`absolute right-[7px] text-[10px] leading-none transition-opacity duration-300 ${
                  darkMode ? "opacity-100" : "opacity-35"
                }`}
              >
                ☾
              </span>

              <span
                className={`relative z-10 h-[21px] w-[21px] rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-[#35304D] ${
                  darkMode ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-[#A8A3B8] dark:hover:bg-[#111020]"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center"
            >
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-black dark:bg-[#F5F3FF]" />
                <span className="block h-0.5 w-5 bg-black dark:bg-[#F5F3FF]" />
                <span className="block h-0.5 w-5 bg-black dark:bg-[#F5F3FF]" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden">
          <aside className="ml-auto flex h-full w-72 flex-col rounded-l-[2rem] bg-white/85 p-8 shadow-2xl backdrop-blur-2xl transition-colors dark:bg-[#111020]/85">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-[#F5F3FF]">
                {brand}
              </h2>

              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="text-3xl leading-none text-neutral-500 dark:text-[#A8A3B8]"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <HeaderLink
                  key={item.label}
                  item={item}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>

            {admin && (
              <>
                <Link
                  to="/configuracion"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full px-4 py-2 text-left text-sm text-neutral-600 transition-colors hover:bg-neutral-900/5 hover:text-black dark:text-[#A8A3B8] dark:hover:bg-white/5 dark:hover:text-[#F5F3FF]"
                >
                  Configuración
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 rounded-xl border border-red-300/40 bg-red-50/80 px-3 py-3 text-left text-sm text-red-500 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onToggleDarkMode}
              className="mt-auto flex items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-neutral-900/5 dark:hover:bg-white/5"
            >
              <span className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                {darkMode ? "Modo claro" : "Modo oscuro"}
              </span>

              <span className="text-xl text-neutral-700 dark:text-[#F5F3FF]">
                {darkMode ? "☀" : "☾"}
              </span>
            </button>
          </aside>
        </div>
      )}
    </>
  );
}

export default Header;
