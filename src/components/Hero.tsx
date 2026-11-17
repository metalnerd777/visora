import { Link } from "react-router-dom";

import { usePortfolio } from "../lib/usePortfolio";
import { useImageOrientation } from "../lib/useImageOrientation";
import {
  heroGradientFor,
  heroGradientBackground,
  heroImageMask,
} from "../lib/appearance";

function Hero() {
  const { profile, settings, heroConfig } = usePortfolio();

  const primaryLink = heroConfig.primaryLink ?? "#projects";
  const secondaryLink = heroConfig.secondaryLink ?? "/contacto";

  const brand = settings.general.brandName || profile.name;
  const profession = settings.general.profession || profile.profession;

  const showSecondary = heroConfig.showSecondary ?? true;
  const heroImage = profile.heroImage;

  const focusX = heroConfig.heroImageFocusX ?? 50;
  const focusY = heroConfig.heroImageFocusY ?? 50;

  const hasTransparentImage = heroConfig.heroTransparent === true;
  const showDarkBg = !hasTransparentImage || heroConfig.heroGradient;

  const isPortrait = useImageOrientation(heroImage) === "portrait";

  const imageMask = heroImageMask({
    top: heroConfig.fadeTop,
    bottom: heroConfig.fadeBottom,
    left: heroConfig.fadeLeft,
    right: heroConfig.fadeRight,
  });

  return (
    <section
      id="home"
      className={`relative flex min-h-[82vh] md:min-h-[88vh] lg:min-h-[92vh] items-center overflow-hidden text-white ${
        showDarkBg ? "bg-neutral-950" : ""
      }`}
    >
      {/* Fondo degradado si está activo para transparencias */}
      {heroConfig.heroGradient && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: heroGradientBackground(
              heroGradientFor(heroConfig.heroGradientId),
            ),
          }}
        />
      )}

      {/* Imagen de fondo con recorte y velo cinematográfico */}
      {heroImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={heroImage}
            alt=""
            fetchPriority="high"
            className={`h-full w-full object-cover transition-transform duration-1000 ${
              isPortrait
                ? "md:left-auto md:right-0 md:top-1/2 md:h-[90%] md:w-auto md:-translate-y-1/2"
                : ""
            }`}
            style={{ objectPosition: `${focusX}% ${focusY}%`, ...imageMask }}
          />

          {/* Velo de contraste de alta gama: asegura legibilidad cristalina sin textos con sombras pesadas */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/50 to-neutral-950/20 md:via-neutral-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/30" />
        </div>
      )}

      {/* Contenido Monumental */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-6 py-20 sm:px-10 lg:py-32">
        <div className="max-w-3xl">
          {/* Micro-etiqueta de autor */}
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-(--visora-accent) shadow-[0_0_8px_var(--visora-accent)]" />
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/80">
              {profession} // PORTAFOLIO
            </p>
          </div>

          {/* Título de gran escala */}
          <h1 className="text-5xl font-extralight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
            {brand}
          </h1>

          {/* Breve statement */}
          {profile.description && (
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {profile.description}
            </p>
          )}

          {/* Acciones principales */}
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <HeroLink
              to={primaryLink}
              className="group inline-flex min-w-48 items-center justify-center gap-3 rounded-[var(--visora-btn-radius)] bg-white px-8 py-4 text-sm font-medium text-neutral-950 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-100 active:scale-95"
            >
              <span>{profile.heroPrimaryButton ?? "Ver portfolio"}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </HeroLink>

            {showSecondary && (
              <HeroLink
                to={secondaryLink}
                className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] border border-white/30 bg-white/5 px-8 py-4 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/15 active:scale-95"
              >
                {profile.heroSecondaryButton ?? "Contacto"}
              </HeroLink>
            )}
          </div>
        </div>
      </div>

      {/* Indicador de scroll de alta gama */}
      <a
        href="#featured"
        aria-label="Desplazarse hacia abajo"
        className="group absolute bottom-8 right-8 z-10 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-white md:flex"
      >
        <span>EXPLORAR</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-transform duration-300 group-hover:translate-y-1">
          ↓
        </span>
      </a>
    </section>
  );
}

function HeroLink({
  to,
  className,
  children,
}: {
  to: string;
  className: string;
  children: React.ReactNode;
}) {
  if (to.startsWith("#")) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default Hero;
