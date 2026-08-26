import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import Hero from "../components/Hero";
import MasonryGallery from "../components/MasonryGallery";
import ProjectCard from "../components/ProjectCard";
import PhotoViewer from "../components/PhotoViewer";

import { usePortfolio } from "../lib/usePortfolio";
import { isAuthenticated } from "../lib/auth";

import EditableSection from "./admin/edit/EditableSection";
import EditHeroModal from "./admin/edit/EditHeroModal";
import EditFeaturedModal from "./admin/edit/EditFeaturedModal";
import EditProjectsModal from "./admin/edit/EditProjectsModal";

import type { Photo } from "../types/portfolio";

function Home() {
  const { projects, featuredPhotos, siteTexts } = usePortfolio();
  const location = useLocation();
  const [viewerPhotos, setViewerPhotos] = useState<Photo[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [admin, setAdmin] = useState(isAuthenticated());

  const [heroOpen, setHeroOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdmin(isAuthenticated());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)
      ?.scrollTo;

    if (!target) return;

    const el = document.getElementById(target);

    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
    }
  }, [location.state]);

  const openViewer = (photos: Photo[], photoId: string) => {
    const index = photos.findIndex((photo) => photo.id === photoId);

    if (index === -1) return;

    setViewerPhotos(photos);
    setViewerIndex(index);
  };

  const closeViewer = () => {
    setViewerIndex(null);
  };

  const showPrevious = () => {
    setViewerIndex((current) => {
      if (current === null || current <= 0) {
        return current;
      }

      return current - 1;
    });
  };

  const showNext = () => {
    setViewerIndex((current) => {
      if (current === null || current >= viewerPhotos.length - 1) {
        return current;
      }

      return current + 1;
    });
  };

  return (
    <>
      {/* Hero */}
      {admin ? (
        <EditableSection label="Editar" onEdit={() => setHeroOpen(true)}>
          <Hero />
        </EditableSection>
      ) : (
        <Hero />
      )}

      {/* Destacadas */}
      <section
        id="featured"
        className="border-t border-neutral-200 px-6 py-24 transition-colors dark:border-[#27243A] md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection
              label="Editar destacadas"
              onEdit={() => setFeaturedOpen(true)}
            >
              <div className="mb-12 max-w-2xl">
                <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
                  {siteTexts.featuredLabel}
                </p>

                <h2 className="text-3xl font-light text-neutral-900 dark:text-[#F5F3FF] md:text-4xl">
                  {siteTexts.featuredTitle}
                </h2>

                <p className="mt-4 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                  {siteTexts.featuredDescription}
                </p>
              </div>
            </EditableSection>
          ) : (
            <div className="mb-12 max-w-2xl">
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
                {siteTexts.featuredLabel}
              </p>

              <h2 className="text-3xl font-light text-neutral-900 dark:text-[#F5F3FF] md:text-4xl">
                {siteTexts.featuredTitle}
              </h2>

              <p className="mt-4 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                {siteTexts.featuredDescription}
              </p>
            </div>
          )}

          <MasonryGallery
            photos={featuredPhotos}
            onPhotoClick={(photoId) => openViewer(featuredPhotos, photoId)}
          />
        </div>
      </section>

      {/* Proyectos */}
      <section
        id="projects"
        className="border-t border-neutral-200 px-6 py-24 transition-colors dark:border-[#27243A] md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          {admin ? (
            <EditableSection
              label="Editar proyectos"
              onEdit={() => setProjectsOpen(true)}
              addLabel="Nuevo proyecto"
              onAdd={() => setProjectsOpen(true)}
            >
              <div className="mb-14 max-w-2xl">
                <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
                  {siteTexts.projectsLabel}
                </p>

                <h2 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-4xl">
                  {siteTexts.projectsTitle}
                </h2>

                <p className="mt-5 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                  {siteTexts.projectsDescription}
                </p>
              </div>
            </EditableSection>
          ) : (
            <div className="mb-14 max-w-2xl">
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-neutral-500 dark:text-[#A8A3B8]">
                {siteTexts.projectsLabel}
              </p>

              <h2 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-[#F5F3FF] md:text-4xl">
                {siteTexts.projectsTitle}
              </h2>

              <p className="mt-5 leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
                {siteTexts.projectsDescription}
              </p>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Visor */}
      {viewerIndex !== null && viewerPhotos[viewerIndex] && (
        <PhotoViewer
          imageUrl={viewerPhotos[viewerIndex].url}
          title={viewerPhotos[viewerIndex].title}
          currentIndex={viewerIndex}
          totalPhotos={viewerPhotos.length}
          hasPrevious={viewerIndex > 0}
          hasNext={viewerIndex < viewerPhotos.length - 1}
          onPrevious={showPrevious}
          onNext={showNext}
          onClose={closeViewer}
        />
      )}

      {/* Admin modals */}
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
    </>
  );
}

export default Home;
