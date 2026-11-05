export type SaveToastStatus = "saving" | "saved";

/**
 * Aviso flotante de guardado.
 * `saving` muestra un spinner breve; `saved` confirma con un check.
 * Permanece montado y se oculta con una transición hacia abajo.
 * Es `pointer-events-none` para no bloquear la interfaz.
 */
function SaveToast({ status }: { status: SaveToastStatus | null }) {
  const visible = status !== null;
  const saving = status === "saving";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={`pointer-events-none fixed bottom-8 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-3 rounded-full border border-emerald-400/30 bg-neutral-900/95 px-5 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-md transition-all duration-200 ease-out motion-reduce:transition-none ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-3 scale-95 opacity-0"
      }`}
    >
      {saving ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-emerald-300 motion-reduce:animate-none"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M5 10.5 8.5 14 15 6.5" />
          </svg>
        </span>
      )}

      <span>{saving ? "Guardando cambios…" : "Cambios guardados"}</span>
    </div>
  );
}

export default SaveToast;
