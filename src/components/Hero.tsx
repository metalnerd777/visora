import { Link } from "react-router-dom";

import { usePortfolio } from "../lib/usePortfolio";
import { loadJSON } from "../lib/storage";
import { useImageOrientation } from "../lib/useImageOrientation";
import {
  heroGradientFor,
  heroGradientBackground,
  heroImageMask,
} from "../lib/appearance";

interface HeroConfig {
  heroImageFocusX?: number;
  heroImageFocusY?: number;
  showSecondary?: boolean;
  heroGradient?: boolean;
  heroGradientId?: string;
  heroTransparent?: boolean;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  fadeLeft?: boolean;
  fadeRight?: boolean;
  primaryLink?: string;
  secondaryLink?: string;
}

function Hero() {
  const { profile, settings } = usePortfolio();
  const heroConfig = loadJSON<HeroConfig>("visora-admin-hero", {
    showSecondary: true,
    heroImageFocusX: 50,
    heroImageFocusY: 50,
    heroGradient: false,
    heroGradientId: "midnight-violet",
    fadeTop: false,
    fadeBottom: true,
    fadeLeft: false,
    fadeRight: false,
  });

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
      className={`relative flex h-[70vh] min-h-[520px] max-h-[760px] items-center overflow-hidden text-white ${showDarkBg ? "bg-neutral-950" : ""}`}
    >
      {/* Fondo degradado (imágenes con transparencia) */}
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

      {/* Contenido + imagen dentro del mismo ancho que el resto de la página */}
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-6 sm:px-10">
        {/* Imagen de fondo (recortada según el punto de importancia) */}
        <img
          src={heroImage}
          alt=""
          fetchPriority="high"
          className={`absolute h-full object-cover ${
            isPortrait
              ? "inset-x-0 top-0 w-full left-0 md:bottom-auto md:left-auto md:right-0 md:top-1/2 md:h-[85%] md:w-auto md:-translate-y-1/2"
              : "inset-x-0 top-0 w-full"
          }`}
          style={{ objectPosition: `${focusX}% ${focusY}%`, ...imageMask }}
        />

        <div className="relative z-10 w-full">
          <div className="max-w-xl">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/70 [text-shadow:0_1px_2px_rgba(0,0,0,0.85),0_3px_10px_rgba(0,0,0,0.75),0_8px_32px_rgba(0,0,0,0.7)] max-md:[text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_4px_14px_rgba(0,0,0,0.85),0_10px_40px_rgba(0,0,0,0.75)]">
            {profession}
          </p>

          <h1 className="text-5xl font-extralight tracking-tight sm:text-6xl md:text-7xl [text-shadow:0_2px_4px_rgba(0,0,0,0.85),0_6px_18px_rgba(0,0,0,0.8),0_14px_48px_rgba(0,0,0,0.75)] max-md:[text-shadow:0_3px_6px_rgba(0,0,0,0.95),0_8px_22px_rgba(0,0,0,0.85),0_16px_56px_rgba(0,0,0,0.8)]">
            {brand}
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/80 sm:text-base [text-shadow:0_1px_3px_rgba(0,0,0,0.85),0_4px_12px_rgba(0,0,0,0.75),0_10px_32px_rgba(0,0,0,0.7)] max-md:[text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_5px_16px_rgba(0,0,0,0.85),0_12px_40px_rgba(0,0,0,0.75)]">
            {profile.description}
          </p>

          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <HeroLink
              to={primaryLink}
              className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] bg-white px-7 py-3 text-sm text-black transition-all duration-300 hover:bg-white/90"
            >
              {profile.heroPrimaryButton ?? "Ver portfolio"}
            </HeroLink>

            {showSecondary && (
              <HeroLink
                to={secondaryLink}
                className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] border border-white/40 px-7 py-3 text-sm text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/15 max-md:[text-shadow:0_1px_3px_rgba(0,0,0,0.7)]"
              >
                {profile.heroSecondaryButton ?? "Contacto"}
              </HeroLink>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#featured"
        aria-label="Desplazarse hacia abajo"
        className="absolute bottom-8 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 backdrop-blur-md transition-colors hover:text-white"
      >
        <span className="block translate-y-[1px] animate-bounce text-base leading-none">
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
