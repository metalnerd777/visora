import { useNavigate } from "react-router-dom";

import { usePortfolio } from "../lib/usePortfolio";
import { resizeUrl } from "../lib/image";

import type { Project } from "../types/portfolio";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const { siteTexts } = usePortfolio();

  return (
    <button
      type="button"
      onClick={() => navigate(`/proyecto/${project.slug}`)}
      className="group relative block w-full text-left cursor-pointer"
    >
      <div className="zoom-frame aspect-[16/10] rounded-3xl">
        <img
          src={resizeUrl(project.cover, 1800)}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="zoom-image"
        />

        {/* Velo sutil */}
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/0 transition-colors duration-500 group-hover:bg-neutral-950/15" />

        {/* Badges de privacidad si el proyecto es privado/oculto */}
        {(project.visibility === "unlisted" || project.pin) && (
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5">
            {project.visibility === "unlisted" && (
              <span className="rounded-full bg-neutral-950/75 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-amber-300 backdrop-blur-md">
                Solo con enlace
              </span>
            )}
            {project.pin && (
              <span className="rounded-full bg-neutral-950/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white backdrop-blur-md">
                🔒 PIN
              </span>
            )}
          </div>
        )}
      </div>

      {/* Información editorial debajo de la obra */}
      <div className="mt-4 px-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-medium text-neutral-500 dark:text-neutral-400">
          <span className="h-px w-3 bg-(--visora-accent)" />
          {project.category && (
            <>
              <span className="text-(--visora-accent)">{project.category}</span>
              <span>·</span>
            </>
          )}
          <span>
            {project.photos.length}{" "}
            {project.photos.length === 1
              ? siteTexts.workNounSingular
              : siteTexts.workNounPlural}
          </span>
          {project.year && (
            <>
              <span>·</span>
              <span className="font-mono">{project.year}</span>
            </>
          )}
        </div>

        <h3 className="mt-1.5 text-2xl font-light text-neutral-900 transition-colors duration-300 group-hover:text-(--visora-accent) dark:text-white">
          {project.title}
        </h3>

        {project.description && (
          <p className="mt-1 line-clamp-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {project.description}
          </p>
        )}
      </div>
    </button>
  );
}

export default ProjectCard;
