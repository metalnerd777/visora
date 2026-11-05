import { useState } from "react";

import type { InitMode } from "../lib/initializePortfolio";

function WelcomeScreen({
  onSelect,
}: {
  onSelect: (mode: InitMode) => void;
}) {
  const [selected, setSelected] = useState<InitMode | null>(null);

  const choose = (mode: InitMode) => {
    if (selected) return;

    setSelected(mode);
    onSelect(mode);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16 text-neutral-900 transition-colors dark:text-[#F5F3FF]">
      <div className="w-full max-w-4xl">
        <header className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-(--visora-accent)/25 bg-white/70 text-lg font-medium tracking-tight text-(--visora-accent) shadow-[0_12px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:bg-[#161327]/70">
            V
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-neutral-400 dark:text-[#6F6A80]">
            Visora
          </p>

          <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
            Elige cómo quieres empezar
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-[#A8A3B8] sm:text-base">
            Puedes explorar un portfolio de ejemplo o crear el tuyo desde cero.
            Todo el contenido se puede cambiar después desde el administrador.
          </p>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => choose("demo")}
            disabled={selected !== null}
            className="group flex h-full flex-col items-start rounded-3xl border border-neutral-200/70 bg-white/70 p-8 text-left shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-(--visora-accent)/40 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)] disabled:pointer-events-none disabled:opacity-60 dark:border-[#27243A]/70 dark:bg-[#161327]/70"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-(--visora-accent)/25 bg-(--visora-accent)/10 text-(--visora-accent)">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m10 8 5 4-5 4V8Z" />
              </svg>
            </span>

            <span className="mt-6 text-xl font-light tracking-tight">
              Explorar la demo
            </span>

            <span className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              Prueba Visora con el portfolio de ejemplo de Alex Morgan:
              proyectos, publicaciones y fotografías listos para explorar.
            </span>

            <span className="mt-auto pt-6 text-xs uppercase tracking-[0.2em] text-(--visora-accent)">
              Cargar contenido de ejemplo →
            </span>
          </button>

          <button
            type="button"
            onClick={() => choose("empty")}
            disabled={selected !== null}
            className="group flex h-full flex-col items-start rounded-3xl border border-neutral-200/70 bg-white/70 p-8 text-left shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-(--visora-accent)/40 hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)] disabled:pointer-events-none disabled:opacity-60 dark:border-[#27243A]/70 dark:bg-[#161327]/70"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-neutral-500 dark:border-[#27243A] dark:bg-white/5 dark:text-[#A8A3B8]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </span>

            <span className="mt-6 text-xl font-light tracking-tight">
              Comenzar desde cero
            </span>

            <span className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              Crea un portfolio vacío y añade tus propios proyectos, textos y
              fotografías desde el panel de administración.
            </span>

            <span className="mt-auto pt-6 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-[#A8A3B8]">
              Crear portfolio vacío →
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-neutral-400 dark:text-[#6F6A80]">
          Tu elección se guarda en este navegador. Si ya tienes datos guardados,
          no se modificarán.
        </p>
      </div>
    </main>
  );
}

export default WelcomeScreen;
