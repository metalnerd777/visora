import { useState } from "react";

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

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md transition-colors dark:border-neutral-800/70 dark:bg-neutral-950/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <a
            href="#home"
            className="text-lg font-medium tracking-tight transition-opacity hover:opacity-70"
          >
            {photographer.name}
          </a>

          {/* Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}

            {/* Dark mode */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              {darkMode ? "☀" : "☾"}
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Dark mode */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={
                darkMode ? "Activar modo claro" : "Activar modo oscuro"
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-sm transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
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
                <span className="block h-0.5 w-5 bg-black dark:bg-white" />
                <span className="block h-0.5 w-5 bg-black dark:bg-white" />
                <span className="block h-0.5 w-5 bg-black dark:bg-white" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <aside className="ml-auto flex h-full w-72 flex-col bg-white p-8 shadow-2xl transition-colors dark:bg-neutral-950">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-lg font-medium">{photographer.name}</h2>

              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="text-3xl leading-none text-neutral-500 transition-colors hover:text-black dark:hover:text-white"
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
                  className="border-b border-neutral-200 pb-4 text-lg text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Dark mode móvil */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="mt-8 flex items-center justify-between border-b border-neutral-200 pb-4 text-left text-lg text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
            >
              <span>{darkMode ? "Modo claro" : "Modo oscuro"}</span>

              <span>{darkMode ? "☀" : "☾"}</span>
            </button>
          </aside>
        </div>
      )}
    </>
  );
}

export default Header;
