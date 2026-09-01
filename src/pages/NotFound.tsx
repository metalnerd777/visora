import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  title?: string;
}

function NotFound({ title = "Página no encontrada" }: NotFoundProps) {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 transition-colors">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-neutral-400 dark:text-[#A8A3B8]">
          404
        </p>

        <h1 className="text-4xl font-light tracking-tight md:text-5xl">
          {title}
        </h1>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 dark:text-[#A8A3B8] dark:hover:text-(--visora-accent)"
        >
          ← Volver al portfolio
        </button>
      </div>
    </main>
  );
}

export default NotFound;
