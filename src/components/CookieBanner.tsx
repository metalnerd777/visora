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

  if (!notice || admin || dismissed) return null;

  const close = (accepted: boolean) => {
    localStorage.setItem(STORAGE_KEY, accepted ? "accepted" : "rejected");
    setDismissed(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl dark:border-[#27243A]/70 dark:bg-[#161327]/95 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-relaxed text-neutral-600 dark:text-[#C9C4D8]">
          {notice}
        </p>

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
  );
}

export default CookieBanner;
