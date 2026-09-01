import { useRef, useState } from "react";

import {
  FAVICON_PRESETS,
  presetDataUrl,
  fileToFaviconDataUrl,
  toInlineSvg,
  decodeSvgDataUrl,
} from "../lib/favicons";
import type { FaviconPreset } from "../lib/favicons";

function findPreset(value: string): FaviconPreset | undefined {
  return FAVICON_PRESETS.find((p) => presetDataUrl(p) === value);
}

function FaviconPicker({
  value,
  onChange,
  onReset,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  onReset: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const activePreset = findPreset(value);
  const uploadedSvg = activePreset ? null : decodeSvgDataUrl(value);
  const uploadedInline = uploadedSvg ? toInlineSvg(uploadedSvg) : null;

  const handleFile = async (file?: File) => {
    if (!file) return;

    setBusy(true);
    setError("");

    try {
      const dataUrl = await fileToFaviconDataUrl(file, 64);
      onChange(dataUrl);
    } catch {
      setError("No se pudo procesar la imagen. Prueba con otro archivo.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
          Favicon
        </label>

        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-[#27243A] dark:bg-[#0B0A14]">
          {activePreset ? (
            <span
              className="block h-8 w-8 text-neutral-600 dark:text-neutral-200"
              dangerouslySetInnerHTML={{ __html: activePreset.inlineSvg() }}
            />
          ) : uploadedInline ? (
            <span
              className="block h-8 w-8 text-neutral-600 dark:text-neutral-200"
              dangerouslySetInnerHTML={{ __html: uploadedInline }}
            />
          ) : (
            <img
              src={value || "/favicon.svg"}
              alt="Favicon actual"
              className="h-8 w-8 object-contain"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {FAVICON_PRESETS.map((preset) => {
          const isActive = value === presetDataUrl(preset);

          return (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              aria-label={preset.label}
              onClick={() => onChange(presetDataUrl(preset))}
              className={`flex aspect-square items-center justify-center rounded-xl border p-2 transition-colors ${
                isActive
                  ? "border-(--visora-accent) bg-(--visora-accent)/10"
                  : "border-neutral-200 bg-white/60 hover:border-neutral-400 dark:border-[#27243A] dark:bg-[#0B0A14]/40 dark:hover:border-[#4A4468]"
              }`}
            >
              <span
                className="block h-full w-full text-neutral-600 dark:text-neutral-200"
                dangerouslySetInnerHTML={{ __html: preset.inlineSvg() }}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]">
          {busy ? "Procesando..." : "Subir imagen"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
        >
          Por defecto
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
        Elige un icono de ejemplo o sube una imagen; se ajusta automáticamente a
        un cuadro de 64×64 para el favicon.
      </p>
    </div>
  );
}

export default FaviconPicker;
