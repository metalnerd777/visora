import { useState } from "react";

import { usePortfolio } from "../lib/usePortfolio";
import { useAdmin } from "../lib/useAdmin";

const STORAGE_KEY = "visora-cookies-accepted";

function CookieBanner() {
  const { settings } = usePortfolio();
  const notice = settings.privacy.cookieNotice?.trim();

  const admin = useAdmin();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );
  const [showPolicy, setShowPolicy] = useState(false);

  if (!notice || admin || dismissed) return null;

  const close = (accepted: boolean) => {
    localStorage.setItem(STORAGE_KEY, accepted ? "accepted" : "rejected");
    setDismissed(true);
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl dark:border-[#27243A]/70 dark:bg-[#161327]/95 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-[#C9C4D8]">
              {notice}
            </p>
            <button
              type="button"
              onClick={() => setShowPolicy(true)}
              className="mt-1 text-xs text-(--visora-accent) underline"
            >
              Política de cookies y privacidad
            </button>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => close(false)}
              className="rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-600 transition-colors hover:border-neutral-400 dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468]"
            >
              Rechazar
            </button>

            <button
              type="button"
              onClick={() => close(true)}
              className="rounded-[var(--visora-btn-radius)] bg-neutral-900 px-5 py-2 text-xs text-white transition-colors hover:bg-(--visora-accent) dark:bg-[#F5F3FF] dark:text-black dark:hover:bg-(--visora-accent) dark:hover:text-white"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>

      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-[#27243A] dark:bg-[#161327]">
            <h4 className="text-lg font-light text-neutral-900 dark:text-white">
              Privacidad y Cookies
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-[#A8A3B8]">
              Este sitio utiliza almacenamiento local (localStorage) únicamente para recordar tus preferencias de tema (claro/oscuro) y estado de navegación. No recopila datos personales sin tu consentimiento explícito.
            </p>
            <button
              type="button"
              onClick={() => setShowPolicy(false)}
              className="mt-5 w-full rounded-full bg-neutral-900 py-2.5 text-xs font-medium uppercase tracking-wider text-white dark:bg-white dark:text-neutral-900"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CookieBanner;
