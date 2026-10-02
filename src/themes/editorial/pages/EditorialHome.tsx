import { useEffect, useRef, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import PhotoViewer from "../../../components/PhotoViewer";
import EditableSection from "../../../pages/admin/edit/EditableSection";
import EditHeroModal from "../../../pages/admin/edit/EditHeroModal";
import EditFeaturedModal from "../../../pages/admin/edit/EditFeaturedModal";
import EditProjectsModal from "../../../pages/admin/edit/EditProjectsModal";

import { usePortfolio } from "../../../lib/usePortfolio";
import { useAdmin } from "../../../lib/useAdmin";
import { usePhotoViewer } from "../../../lib/usePhotoViewer";
import { loadJSON } from "../../../lib/storage";
import { resizeUrl } from "../../../lib/image";
import { useImageOrientation } from "../../../lib/useImageOrientation";
import {
  heroGradientFor,
  heroGradientBackground,
  heroImageMask,
} from "../../../lib/appearance";

interface HeroConfig {
  heroImageFocusX?: number;
  heroImageFocusY?: number;
  showSecondary?: boolean;
  heroGradient?: boolean;
  heroGradientId?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  fadeLeft?: boolean;
  fadeRight?: boolean;
  portraitAlign?: "left" | "center" | "right";
  primaryLink?: string;
  secondaryLink?: string;
}

function getPortraitAlignClass(align: string | undefined): string {
  switch (align) {
    case "left":
      return "mr-auto";
    case "center":
      return "mx-auto";
    case "right":
      return "ml-auto";
    default:
      return "mx-auto";
  }
}

function EditorialHome() {
  const { projects, featuredPhotos, siteTexts } = usePortfolio();
  const location = useLocation();
  const admin = useAdmin();
  const { viewerIndex, openViewer, closeViewer, showPrevious, showNext } =
    usePhotoViewer(featuredPhotos);

  const [heroOpen, setHeroOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;

    if (!target) return;

    const el = document.getElementById(target);

    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
    }
  }, [location.state]);

  const viewerPhoto =
    viewerIndex !== null ? featuredPhotos[viewerIndex] : null;

  return (
    <main data-theme="editorial">
      {/* Portada */}
      <section
        id="home"
        className="relative border-b border-double border-[#1C1C1F]/20 px-0 py-0 lg:px-10 lg:py-14 dark:border-[#E9E6DF]/20"
      >
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection label="Editar portada" onEdit={() => setHeroOpen(true)}>
              <CoverContent />
            </EditableSection>
          ) : (
            <CoverContent />
          )}
        </div>
      </section>

      {/* Destacadas */}
      <section
        id="featured"
        className="border-b border-[#1C1C1F]/15 px-6 py-14 md:px-10 dark:border-[#E9E6DF]/15"
      >
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection
              label="Editar destacadas"
              onEdit={() => setFeaturedOpen(true)}
            >
              <EditorialSectionHeader
                index="01"
                kicker={siteTexts.featuredLabel}
                title={siteTexts.featuredTitle}
                description={siteTexts.featuredDescription}
              />
            </EditableSection>
          ) : (
            <EditorialSectionHeader
              index="01"
              kicker={siteTexts.featuredLabel}
              title={siteTexts.featuredTitle}
              description={siteTexts.featuredDescription}
            />
          )}

          <div className="grid grid-cols-2 gap-px bg-[#1C1C1F]/15 lg:grid-cols-4 dark:bg-[#E9E6DF]/15">
            {featuredPhotos.slice(0, 8).map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openViewer(photo.id)}
                className="group relative aspect-square overflow-hidden bg-white text-left dark:bg-[#0B0A14]"
              >
                <img
                  src={resizeUrl(photo.url, 1200)}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />

                <span className="absolute left-3 top-3 bg-white/85 px-2 py-1 text-[10px] tracking-[0.2em] text-black backdrop-blur-sm dark:bg-black/70 dark:text-white">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos */}
      <section
        id="projects"
        className="border-b border-[#1C1C1F]/15 px-6 py-14 md:px-10 dark:border-[#E9E6DF]/15"
      >
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection
              label="Editar proyectos"
              onEdit={() => setProjectsOpen(true)}
              addLabel="Nuevo proyecto"
              onAdd={() => setProjectsOpen(true)}
            >
              <EditorialSectionHeader
                index="02"
                kicker={siteTexts.projectsLabel}
                title={siteTexts.projectsTitle}
                description={siteTexts.projectsDescription}
              />
            </EditableSection>
          ) : (
            <EditorialSectionHeader
              index="02"
              kicker={siteTexts.projectsLabel}
              title={siteTexts.projectsTitle}
              description={siteTexts.projectsDescription}
            />
          )}

          <div className="divide-y divide-[#1C1C1F]/15 border-t-2 border-double border-[#1C1C1F]/20 dark:divide-[#E9E6DF]/15 dark:border-[#E9E6DF]/20">
            {projects.map((project, index) => (
              <EdProjectRow
                key={project.id}
                index={index + 1}
                cover={project.cover}
                title={project.title}
                count={project.photos.length}
                nounSingular={siteTexts.workNounSingular}
                nounPlural={siteTexts.workNounPlural}
                slug={project.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Visor */}
      {viewerPhoto && (
        <PhotoViewer
          imageUrl={viewerPhoto.url}
          title={viewerPhoto.title}
          currentIndex={viewerIndex ?? 0}
          totalPhotos={featuredPhotos.length}
          hasPrevious={(viewerIndex ?? 0) > 0}
          hasNext={(viewerIndex ?? 0) < featuredPhotos.length - 1}
          onPrevious={showPrevious}
          onNext={showNext}
          onClose={closeViewer}
        />
      )}

      {/* Modales admin */}
      {admin && (
        <>
          <EditHeroModal open={heroOpen} onClose={() => setHeroOpen(false)} />
          <EditFeaturedModal
            open={featuredOpen}
            onClose={() => setFeaturedOpen(false)}
          />
          <EditProjectsModal
            open={projectsOpen}
            onClose={() => setProjectsOpen(false)}
          />
        </>
      )}
    </main>
  );
}

function CoverContent() {
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
    portraitAlign: "center",
  });

  const brand = settings.general.brandName || profile.name;
  const profession = settings.general.profession || profile.profession;

  const heroImage = profile.heroImage;

  const focusX = heroConfig.heroImageFocusX ?? 50;
  const focusY = heroConfig.heroImageFocusY ?? 50;

  const showSecondary = heroConfig.showSecondary ?? true;

  const isHeroPortrait = useImageOrientation(heroImage) === "portrait";

  const imageMask = heroImageMask({
    top: heroConfig.fadeTop,
    bottom: heroConfig.fadeBottom,
    left: heroConfig.fadeLeft,
    right: heroConfig.fadeRight,
  });

  const manchetaRef = useRef<HTMLDivElement>(null);
  const [manchetaHeight, setManchetaHeight] = useState<number | undefined>();

  useEffect(() => {
    const el = manchetaRef.current;
    if (!el) return;

    const update = () => setManchetaHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [isHeroPortrait]);

  const mancheta = (
    <div ref={manchetaRef} className="lg:col-span-5">
      <Mancheta
        profession={profession}
        brand={brand}
        description={profile.description}
        showSecondary={showSecondary}
        heroPrimaryButton={profile.heroPrimaryButton}
        heroSecondaryButton={profile.heroSecondaryButton}
        primaryLink={heroConfig.primaryLink ?? "#projects"}
        secondaryLink={heroConfig.secondaryLink ?? "/contacto"}
      />
    </div>
  );

  return (
    <>
      {/* Mobile: imagen de fondo a sangre + mancheta encima */}
      <div className="relative flex h-[70vh] min-h-[520px] max-h-[760px] items-center overflow-hidden bg-neutral-950 text-white lg:hidden">
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

        {heroImage && (
          <img
            src={heroImage}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: `${focusX}% ${focusY}%`,
              ...imageMask,
            }}
          />
        )}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl py-20">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.5)]">
              {profession}
            </p>

            <h1 className="text-5xl font-semibold uppercase leading-[1.05] tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.55),0_6px_18px_rgba(0,0,0,0.5)] sm:text-6xl">
              {brand}
            </h1>

            <div className="my-8 flex items-center gap-4">
              <span className="h-px w-16 bg-white/40" />
              <span className="text-xs uppercase tracking-[0.3em] text-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                Portfolio
              </span>
            </div>

            <p className="max-w-md text-base leading-relaxed text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.7),0_3px_10px_rgba(0,0,0,0.5)]">
              {profile.description}
            </p>

            <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
              <HeroLink
                to={heroConfig.primaryLink ?? "#projects"}
                className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] bg-white px-7 py-3 text-sm text-black transition-colors hover:bg-white/90"
              >
                {profile.heroPrimaryButton ?? "Ver portfolio"}
              </HeroLink>

              {showSecondary && (
<HeroLink
                to={heroConfig.secondaryLink ?? "/contacto"}
                className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] border border-white/40 px-7 py-3 text-sm text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white/15 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]"
              >
                {profile.heroSecondaryButton ?? "Destacadas"}
              </HeroLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: grid editorial mancheta + imagen */}
      <div className="hidden items-start gap-12 lg:grid lg:grid-cols-12">
        {mancheta}

        {/* Imagen */}
        <div className="lg:col-span-7">
          {heroImage && (
            <figure className="relative">
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

              <div className="relative">
                <img
                  src={heroImage}
                  alt=""
                  fetchPriority="high"
                  className={`relative object-cover ${
                    isHeroPortrait
                      ? `h-auto w-auto max-w-full ${getPortraitAlignClass(heroConfig.portraitAlign)}`
                      : "w-full"
                  }`}
                  style={{
                    maxHeight: isHeroPortrait ? manchetaHeight : undefined,
                    objectPosition: `${focusX}% ${focusY}%`,
                    ...imageMask,
                  }}
                />
              </div>
            </figure>
          )}
        </div>
      </div>
    </>
  );
}

function Mancheta({
  profession,
  brand,
  description,
  showSecondary,
  heroPrimaryButton,
  heroSecondaryButton,
  primaryLink,
  secondaryLink,
}: {
  profession: string;
  brand: string;
  description: string;
  showSecondary: boolean;
  heroPrimaryButton?: string;
  heroSecondaryButton?: string;
  primaryLink: string;
  secondaryLink: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
        {profession}
      </p>

      <h1 className="mt-6 text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-black dark:text-[#F3EFE6] sm:text-6xl md:text-7xl">
        {brand}
      </h1>

      <div className="my-8 flex items-center gap-4">
        <span className="h-px w-16 bg-black/30 dark:bg-[#F3EFE6]/30" />
        <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
          Portfolio
        </span>
      </div>

      <p className="max-w-md text-base leading-relaxed text-black/70 dark:text-[#F3EFE6]/70">
        {description}
      </p>

      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
        <HeroLink
          to={primaryLink}
          className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] bg-black px-7 py-3 text-sm text-white transition-colors hover:bg-[#1C1C1F] dark:bg-[#F3EFE6] dark:text-black dark:hover:bg-white"
        >
          {heroPrimaryButton ?? "Ver portfolio"}
        </HeroLink>

        {showSecondary && (
          <HeroLink
            to={secondaryLink}
            className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] border border-black/30 px-7 py-3 text-sm text-black transition-colors hover:border-black hover:bg-black/5 dark:border-[#F3EFE6]/30 dark:text-[#F3EFE6] dark:hover:border-[#F3EFE6] dark:hover:bg-white/5"
          >
            {heroSecondaryButton ?? "Destacadas"}
          </HeroLink>
        )}
      </div>
    </div>
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

function EditorialSectionHeader({
  index,
  kicker,
  title,
  description,
}: {
  index: string;
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-12">
      <div className="mb-4 flex items-center justify-between gap-6">
        <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
          {kicker}
        </p>

        <span className="flex items-center gap-3">
          <span className="h-px w-10 bg-black/30 dark:bg-[#F3EFE6]/30" />
          <span className="text-sm font-semibold text-black/50 dark:text-[#F3EFE6]/50">
            {index}
          </span>
        </span>
      </div>

      <h2 className="text-3xl font-semibold uppercase tracking-tight text-black dark:text-[#F3EFE6] sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-black/60 dark:text-[#F3EFE6]/60">
          {description}
        </p>
      )}
    </div>
  );
}

function EdProjectRow({
  index,
  cover,
  title,
  count,
  nounSingular,
  nounPlural,
  slug,
}: {
  index: number;
  cover: string;
  title: string;
  count: number;
  nounSingular: string;
  nounPlural: string;
  slug: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative grid grid-cols-12 items-center gap-4 py-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/proyecto/${slug}`} className="absolute inset-0 z-10" aria-label={title} />

      <span className="col-span-2 text-sm font-semibold tracking-[0.2em] text-black/40 dark:text-[#F3EFE6]/40 md:col-span-1">
        {(index).toString().padStart(2, "0")}
      </span>

      <h3 className="col-span-9 text-2xl font-semibold uppercase tracking-tight text-black transition-colors group-hover:text-black/60 md:col-span-8 dark:text-[#F3EFE6] md:text-3xl dark:group-hover:text-[#F3EFE6]/60">
        {title}
      </h3>

      <span className="col-span-9 col-start-3 text-xs uppercase tracking-[0.2em] text-black/50 md:col-span-2 md:col-start-10 dark:text-[#F3EFE6]/50">
        {count} {count === 1 ? nounSingular : nounPlural}
      </span>

      {cover && (
        <div
          className={`pointer-events-none absolute right-4 hidden h-40 w-64 overflow-hidden shadow-2xl transition-all duration-500 md:block ${
            hovered ? "z-20 translate-x-0 opacity-100" : "translate-x-6 opacity-0"
          }`}
        >
          <img
            src={resizeUrl(cover, 1000)}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default EditorialHome;