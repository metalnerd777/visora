import { useEffect, useState } from "react";

import { photographer } from "../data/portfolio";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const menuItems = [
  { label: "Destacadas", href: "#featured" },
  { label: "Galerías", href: "#gallery" },
  { label: "Sobre mí", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Contacto", href: "#contact" },
];

function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
  return (
    <>
      <header
        className={`
    sticky top-0 z-40
    border-b
    transition-[background-color,border-color,box-shadow] duration-300
    ${
      scrolled
        ? "border-neutral-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-[#27243A]/60 dark:bg-[#0B0A14]/80"
        : "border-neutral-200/30 bg-white/60 backdrop-blur-md dark:border-[#27243A]/30 dark:bg-[#0B0A14]/60"
    }
  `}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <a
            href="/"
            className="text-lg font-medium tracking-tight text-neutral-900 transition-opacity hover:opacity-70 dark:text-[#F5F3FF]"
          >
            {photographer.name}
          </a>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-neutral-600 transition-colors hover:text-black dark:text-[#A8A3B8] dark:hover:text-[#F5F3FF]"
              >
                {item.label}
              </a>
            ))}

            {/* Theme switch */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              className="relative flex h-7 w-[50px] shrink-0 items-center rounded-full border border-neutral-300 bg-neutral-200 p-[3px] transition-colors duration-300 dark:border-[#38334F] dark:bg-[#1C1930]"
            >
              {/* Sol */}
              <span
                className={`absolute left-[7px] text-[10px] leading-none transition-opacity duration-300 ${
                  darkMode ? "opacity-35" : "opacity-100"
                }`}
              >
                ☀
              </span>

              {/* Luna */}
              <span
                className={`absolute right-[7px] text-[10px] leading-none transition-opacity duration-300 ${
                  darkMode ? "opacity-100" : "opacity-35"
                }`}
              >
                ☾
              </span>

              {/* Indicador */}
              <span
                className={`relative z-10 h-[21px] w-[21px] rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-[#35304D] ${
                  darkMode ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme switch mobile */}
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

            {/* Menu */}
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
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <aside className="ml-auto flex h-full w-72 flex-col bg-white p-8 shadow-2xl transition-colors dark:bg-[#111020]">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-lg font-medium text-neutral-900 dark:text-[#F5F3FF]">
                {photographer.name}
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

            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-neutral-200 pb-4 text-lg text-neutral-700 dark:border-[#27243A] dark:text-[#F5F3FF]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Theme dentro del menú móvil */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-6 text-left dark:border-[#27243A]"
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
