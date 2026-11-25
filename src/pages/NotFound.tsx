import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../lib/usePortfolio";
import { resizeUrl } from "../lib/image";

interface NotFoundProps {
  title?: string;
}

function NotFound({ title = "Página no encontrada" }: NotFoundProps) {
  const navigate = useNavigate();
  const { projects } = usePortfolio();

  const suggestedProjects = projects
    .filter((p) => p.visibility !== "unlisted")
    .slice(0, 3);

  return (
    <main className="px-6 py-24 text-neutral-900 transition-colors dark:text-[#F5F3FF] md:px-10 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-(--visora-accent)">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
          La página o proyecto que buscas no existe o fue trasladado a otra sección.
        </p>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full bg-(--visora-accent) px-6 py-3 text-xs font-medium uppercase tracking-widest text-white shadow-md shadow-(--visora-accent)/20 transition-all hover:opacity-90"
          >
            ← Volver a la galería principal
          </button>
        </div>

        {suggestedProjects.length > 0 && (
          <div className="mt-20 border-t border-neutral-200/70 pt-16 text-left dark:border-white/10">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 dark:text-[#6F6A80]">
              Series sugeridas para explorar
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {suggestedProjects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(`/proyecto/${p.slug}`)}
                  className="group text-left cursor-pointer"
                >
                  <div className="zoom-frame aspect-[16/10] rounded-2xl">
                    <img
                      src={resizeUrl(p.cover, 800)}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="zoom-image pointer-events-none"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-medium tracking-wide text-neutral-900 transition-colors group-hover:text-(--visora-accent) dark:text-neutral-100">
                    {p.title}
                  </h3>
                  {p.category && (
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      {p.category}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default NotFound;
