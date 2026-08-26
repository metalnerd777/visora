import { useNavigate } from "react-router-dom";

import { siteTexts } from "../data/portfolio";

import type { Project } from "../types/portfolio";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/proyecto/${project.slug}`)}
      className="group relative block w-full overflow-hidden text-left"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
        <img
          src={`${project.cover}?auto=format&w=1800&q=85`}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent transition-colors duration-500 group-hover:via-black/20" />

        {/* Información */}
        <div className="absolute inset-x-4 bottom-4 rounded-2xl text-white">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
            {project.photos.length}{" "}
            {project.photos.length === 1
              ? siteTexts.workNounSingular
              : siteTexts.workNounPlural}
          </p>

          <h3 className="text-2xl font-light [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
            {project.title}
          </h3>

          {project.description && (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
              {project.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default ProjectCard;
