import { useState } from "react";
import { photographer } from "../data/portfolio";

const menuItems = [
  { label: "Destacadas", href: "#featured" },
  { label: "Galerías", href: "#gallery" },
  { label: "Sobre mí", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Contacto", href: "#contact" },
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
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
                className="text-sm text-neutral-600 transition-colors hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile button */}
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center md:hidden"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-black" />
              <span className="block h-0.5 w-5 bg-black" />
              <span className="block h-0.5 w-5 bg-black" />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
          <aside className="ml-auto flex h-full w-72 flex-col bg-white p-8 shadow-2xl">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-lg font-medium">{photographer.name}</h2>

              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="text-3xl leading-none text-neutral-500"
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
                  className="border-b border-neutral-200 pb-4 text-lg text-neutral-700"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

export default Header;
