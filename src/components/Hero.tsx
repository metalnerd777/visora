import { photographer } from "../data/portfolio";

function Hero() {
  return (
    <section
      id="home"
      className="relative flex h-[70vh] min-h-[520px] max-h-[760px] items-center overflow-hidden bg-neutral-950 text-white"
    >
      {/* Imagen de fondo */}
      <img
        src={photographer.heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Oscurecimiento lateral */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Degradado inferior */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="max-w-xl">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/70">
            {photographer.profession}
          </p>

          <h1 className="text-5xl font-light tracking-tight sm:text-6xl md:text-7xl">
            {photographer.name}
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            {photographer.description}
          </p>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <a
              href="#gallery"
              className="inline-flex min-w-44 items-center justify-center bg-white px-7 py-3 text-sm text-black transition-all duration-300 hover:bg-white/90"
            >
              {photographer.heroPrimaryButton ?? "Ver portfolio"}
            </a>

            <a
              href="#contact"
              className="inline-flex min-w-44 items-center justify-center border border-white/40 px-7 py-3 text-sm text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              {photographer.heroSecondaryButton ?? "Contacto"}
            </a>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#featured"
        aria-label="Desplazarse hacia abajo"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60 transition-colors hover:text-white"
      >
        <span className="block animate-bounce text-lg">↓</span>
      </a>
    </section>
  );
}

export default Hero;
