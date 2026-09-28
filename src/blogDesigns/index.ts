import type { BlogPostDesignId } from "../types/portfolio";

import ClassicBlogPost from "./classic/ClassicBlogPost";
import CinematicBlogPost from "./cinematic/CinematicBlogPost";
import ColumnsBlogPost from "./columns/ColumnsBlogPost";
import MagazineBlogPost from "./magazine/MagazineBlogPost";

import type { BlogDesignDefinition } from "./types";

export const BLOG_DESIGNS: Record<BlogPostDesignId, BlogDesignDefinition> = {
  classic: {
    id: "classic",
    label: "Clásico",
    description:
      "Una columna centrada, tipografía ligera y portada redondeada. El lector se enfoca en el texto.",
    swatch: ["#F7F7FA", "#7C6CFF"],
    Page: ClassicBlogPost,
  },
  cinematic: {
    id: "cinematic",
    label: "Cinemático",
    description:
      "Portada a sangre completa con título sobre la imagen. Un gran escenario para la fotografía.",
    swatch: ["#0B0A14", "#7C6CFF"],
    Page: CinematicBlogPost,
  },
  magazine: {
    id: "magazine",
    label: "Revista",
    description:
      "Cabecera de magacín con título en display, portada amplia y artículo con ritmo editorial.",
    swatch: ["#F3EFE6", "#9A7B4F"],
    Page: MagazineBlogPost,
  },
  columns: {
    id: "columns",
    label: "Dos columnas",
    description:
      "Texto e imágenes/video en dos columnas: cada bloque elige si va a la izquierda, derecha o a lo ancho.",
    swatch: ["#7C6CFF", "#F7F7FA"],
    Page: ColumnsBlogPost,
  },
};

export const BLOG_DESIGN_OPTIONS = Object.values(BLOG_DESIGNS).map(
  ({ id, label, description, swatch }) => ({ id, label, description, swatch }),
);

export function blogDesignFor(id?: BlogPostDesignId): BlogDesignDefinition {
  return (id && BLOG_DESIGNS[id]) || BLOG_DESIGNS.classic;
}