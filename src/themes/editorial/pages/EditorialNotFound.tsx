import { Link } from "react-router-dom";

import { usePortfolio } from "../../../lib/usePortfolio";

import type { NotFoundProps } from "../../types";

function EditorialNotFound({ title }: NotFoundProps) {
  const { profile, settings } = usePortfolio();
  const brand = settings.general.brandName || profile.name;

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center border-b border-[#1C1C1F]/15 px-6 py-24 text-center dark:border-[#E9E6DF]/15">
      <p className="text-xs uppercase tracking-[0.35em] text-black/50 dark:text-[#F3EFE6]/50">
        {brand}
      </p>

      <h1 className="mt-8 text-8xl font-semibold uppercase leading-none text-black dark:text-[#F3EFE6] md:text-9xl">
        404
      </h1>

      <div className="my-8 flex items-center gap-4">
        <span className="h-px w-14 bg-black/30 dark:bg-[#F3EFE6]/30" />
        <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-[#F3EFE6]/40">
          Página no encontrada
        </span>
        <span className="h-px w-14 bg-black/30 dark:bg-[#F3EFE6]/30" />
      </div>

      <p className="max-w-md text-base leading-relaxed text-black/65 dark:text-[#F3EFE6]/65">
        {title ?? "La página que buscas no existe o fue movida."}
      </p>

      <Link
        to="/"
        className="mt-10 inline-flex min-w-44 items-center justify-center rounded-[var(--visora-btn-radius)] bg-black px-7 py-3 text-sm text-white transition-colors hover:bg-[#1C1C1F] dark:bg-[#F3EFE6] dark:text-black dark:hover:bg-white"
      >
        Volver al inicio
      </Link>
    </main>
  );
}

export default EditorialNotFound;