import { useEffect, useState } from "react";

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

interface HeroConfig {
  heroImageMobile?: string;
  heroImageFocusX?: number;
  heroImageFocusY?: number;
  heroImageMobileFocusX?: number;
  heroImageMobileFocusY?: number;
  showSecondary?: boolean;
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
        className="relative border-b border-double border-[#1C1C1F]/20 px-6 py-16 md:px-10 md:py-20"
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
        className="border-b border-[#1C1C1F]/15 px-6 py-20 md:px-10 dark:border-[#E9E6DF]/15"
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
        className="border-b border-[#1C1C1F]/15 px-6 py-20 md:px-10 dark:border-[#E9E6DF]/15"
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
    heroImageMobileFocusX: 50,
    heroImageMobileFocusY: 50,
  });

  const brand = settings.general.brandName || profile.name;
  const profession = settings.general.profession || profile.profession;

  const desktopImage = profile.heroImage;
  const mobileImage = heroConfig.heroImageMobile || profile.heroImage;
  const useSeparateMobile =
    heroConfig.heroImageMobile && heroConfig.heroImageMobile !== desktopImage;

  const desktopFocusX = heroConfig.heroImageFocusX ?? 50;
  const desktopFocusY = heroConfig.heroImageFocusY ?? 50;
  const mobileFocusX = heroConfig.heroImageMobileFocusX ?? 50;
  const mobileFocusY = heroConfig.heroImageMobileFocusY ?? 50;

  const showSecondary = heroConfig.showSecondary ?? true;

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      {/* Mancheta */}
      <div className="lg:col-span-5">
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
          {profile.description}
        </p>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
          <a
            href="#projects"
            className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] bg-black px-7 py-3 text-sm text-white transition-colors hover:bg-[#1C1C1F] dark:bg-[#F3EFE6] dark:text-black dark:hover:bg-white"
          >
            {profile.heroPrimaryButton ?? "Ver portfolio"}
          </a>

          {showSecondary && (
            <a
              href="#featured"
              className="inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] border border-black/30 px-7 py-3 text-sm text-black transition-colors hover:border-black hover:bg-black/5 dark:border-[#F3EFE6]/30 dark:text-[#F3EFE6] dark:hover:border-[#F3EFE6] dark:hover:bg-white/5"
            >
              {profile.heroSecondaryButton ?? "Destacadas"}
            </a>
          )}
        </div>
      </div>

      {/* Imagen */}
      <div className="lg:col-span-7">
        {desktopImage && (
          <figure>
            <img
              src={desktopImage}
              alt=""
              fetchPriority="high"
              className={`w-full object-cover ${useSeparateMobile ? "hidden md:block" : ""}`}
              style={{ objectPosition: `${desktopFocusX}% ${desktopFocusY}%` }}
            />

            {useSeparateMobile && (
              <img
                src={mobileImage}
                alt=""
                fetchPriority="high"
                className="w-full object-cover md:hidden"
                style={{ objectPosition: `${mobileFocusX}% ${mobileFocusY}%` }}
              />
            )}

            <figcaption className="mt-3 flex items-center justify-between border-t border-[#1C1C1F]/15 pt-3 text-xs uppercase tracking-[0.2em] text-black/50 dark:border-[#E9E6DF]/15 dark:text-[#F3EFE6]/50">
              <span>{brand}</span>
              <span>{profession}</span>
            </figcaption>
          </figure>
        )}
      </div>
    </div>
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