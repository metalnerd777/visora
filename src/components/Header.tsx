import { photographer } from "../data/portfolio";

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-10">
      <a href="#home" className="text-lg font-medium tracking-tight">
        {photographer.name}
      </a>

      <nav className="flex gap-6 text-sm text-neutral-600">
        <a href="#gallery" className="transition-colors hover:text-neutral-950">
          Portfolio
        </a>

        <a href="#about" className="transition-colors hover:text-neutral-950">
          Sobre mí
        </a>

        <a href="#contact" className="transition-colors hover:text-neutral-950">
          Contacto
        </a>
      </nav>
    </header>
  );
}

export default Header;
