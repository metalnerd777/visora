import type { SocialLink, SocialPlatform } from "../types/portfolio";
import PLATFORM_OPTIONS from "../lib/platforms";

function SocialLinksEditor({
  links,
  onChange,
}: {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}) {
  const add = () => {
    const usedPlatforms = links.map((l) => l.platform);
    const available = PLATFORM_OPTIONS.find(
      (p) => !usedPlatforms.includes(p.value),
    );

    onChange([
      ...links,
      { platform: available?.value ?? "instagram", handle: "" },
    ]);
  };

  const update = (index: number, patch: Partial<SocialLink>) => {
    onChange(links.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  };

  const remove = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {links.map((link, index) => (
        <div key={`${link.platform}-${index}`} className="flex items-center gap-3">
          <select
            value={link.platform}
            onChange={(e) =>
              update(index, { platform: e.target.value as SocialPlatform })
            }
            className="w-36 shrink-0 rounded-xl border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 sm:w-44"
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={link.handle}
            onChange={(e) =>
              update(index, { handle: e.target.value.replace(/\s+/g, "") })
            }
            placeholder="@usuario"
            className="flex-1 rounded-xl border border-neutral-200 bg-white/80 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-[#7C6CFF] dark:border-[#27243A] dark:bg-[#0B0A14]/60 dark:placeholder:text-[#6F6A80]"
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-[#6F6A80] dark:hover:bg-red-500/10 dark:hover:text-red-400"
            aria-label="Eliminar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}

      {links.length < PLATFORM_OPTIONS.length && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-2 text-sm text-[#7C6CFF] transition-opacity hover:opacity-70"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar red social
        </button>
      )}

      {links.length === 0 && (
        <p className="text-sm text-neutral-400 dark:text-[#6F6A80]">
          No hay redes sociales configuradas.
        </p>
      )}
    </div>
  );
}

export default SocialLinksEditor;
