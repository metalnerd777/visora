import { useRef, useState } from "react";

import Modal from "../../../components/Modal";
import Field from "../../../components/Field";
import SaveButton from "../../../components/SaveButton";
import { RichTextHtmlEditor } from "../../../components/RichTextEditor";
import ImageCropBox from "../../../components/ImageCropBox";
import {
  FULL_CROP_RECT,
  type CropRect,
} from "../../../lib/cropRect";
import {
  ImageProcessingIndicator,
  type ProcessingStatus,
} from "../../../components/ImageProcessingIndicator";

import { loadJSON, saveJSON } from "../../../lib/storage";
import { usePortfolio } from "../../../lib/usePortfolio";
import { useImageDrop } from "../../../lib/useImageDrop";
import { processImage, formatBytes } from "../../../lib/image";
import {
  cropImage,
  imageSize,
  type CroppedArea,
} from "../../../lib/cropImage";
import { sanitizeHtml, toSafeHtml, htmlToText } from "../../../lib/html";

import { profile as defaultProfile } from "../../../data/portfolio";

import { isNonEmpty, sanitizeText } from "../../../lib/validation";

import type { ClientItem, PortfolioProfile, TestimonialItem } from "../../../types/portfolio";

interface AboutConfig {
  title: string;
  description: string;
  image?: string;
  aspect: number | null;
  dossierUrl?: string;
  dossierLabel?: string;
  clients: ClientItem[];
  testimonials: TestimonialItem[];
}

const IMAGE_FORMATS: { label: string; value: number | null }[] = [
  { label: "Libre", value: null },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "1:1", value: 1 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
];

const MAX_OUTPUT_SIDE = 1600;

function loadAboutData(): AboutConfig {
  const profile = loadJSON<PortfolioProfile>(
    "visora-admin-profile",
    defaultProfile,
  );

  const stored = loadJSON<Partial<AboutConfig>>("visora-admin-about", {});

  const savedAspect =
    stored.aspect !== undefined ? stored.aspect : profile.aboutImageAspect;

  return {
    title: stored.title ?? profile.aboutTitle,
    description: toSafeHtml(stored.description ?? profile.aboutDescription),
    image: stored.image ?? profile.aboutImage,
    aspect: savedAspect === undefined ? 4 / 5 : savedAspect,
    dossierUrl: profile.dossierUrl ?? "",
    dossierLabel: profile.dossierLabel ?? "Descargar Dossier & Tarifas (PDF)",
    clients: profile.clients ? [...profile.clients] : [],
    testimonials: profile.testimonials ? [...profile.testimonials] : [],
  };
}

function AboutSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm dark:border-[#2A273F] dark:bg-[#0B0A14]/50">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--visora-accent)">
          {title}
        </p>
        {description && (
          <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function EditAboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { refresh } = usePortfolio();
  const [config, setConfig] = useState(loadAboutData);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>(
    {},
  );

  const [status, setStatus] = useState<ProcessingStatus>({ state: "idle" });
  const [source, setSource] = useState<string | undefined>(config.image);
  const [rect, setRect] = useState<CropRect>(FULL_CROP_RECT);
  const [saving, setSaving] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<AboutConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];

    setStatus({
      state: "loading",
      message: `Optimizando ${formatBytes(file.size)}…`,
    });

    try {
      const result = await processImage(file);

      setSource(result.url);
      setRect(FULL_CROP_RECT);

      setStatus({
        state: "done",
        originalSize: result.originalSize,
        finalSize: result.finalSize,
      });
    } catch (err) {
      setStatus({
        state: "error",
        message: (err as Error).message || "Error al procesar la imagen",
      });
    }
  };

  const { isDragging, dragProps } = useImageDrop(handleFiles);

  const handleRemove = () => {
    setSource(undefined);
    setRect(FULL_CROP_RECT);
    update({ image: undefined });
  };

  const handleSave = async () => {
    if (saving) return;

    const nextErrors: typeof errors = {};

    if (!isNonEmpty(config.title)) nextErrors.title = "El título es obligatorio.";
    if (!isNonEmpty(htmlToText(config.description)))
      nextErrors.description = "La descripción es obligatoria.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);

    try {
      const description = sanitizeHtml(config.description);
      let image = config.image;

      if (source) {
        const isFullCrop =
          rect.x < 0.002 &&
          rect.y < 0.002 &&
          rect.width > 0.998 &&
          rect.height > 0.998;

        if (source === config.image && isFullCrop) {
          image = source;
        } else {
          setStatus({ state: "loading", message: "Aplicando recorte…" });

          const natural = await imageSize(source);

          const pixelCrop: CroppedArea = {
            x: Math.round(rect.x * natural.width),
            y: Math.round(rect.y * natural.height),
            width: Math.max(1, Math.round(rect.width * natural.width)),
            height: Math.max(1, Math.round(rect.height * natural.height)),
          };

          const scale = Math.min(
            1,
            MAX_OUTPUT_SIDE / Math.max(pixelCrop.width, pixelCrop.height),
          );

          image = await cropImage(source, pixelCrop, {
            width: Math.max(1, Math.round(pixelCrop.width * scale)),
            height: Math.max(1, Math.round(pixelCrop.height * scale)),
          });

          setStatus({ state: "idle" });
        }
      }

      saveJSON("visora-admin-about", {
        title: sanitizeText(config.title).trim(),
        description,
        image,
        aspect: config.aspect,
      });

      const profile = loadJSON<PortfolioProfile>(
        "visora-admin-profile",
        defaultProfile,
      );

      saveJSON("visora-admin-profile", {
        ...profile,
        aboutTitle: sanitizeText(config.title).trim(),
        aboutDescription: description,
        aboutImage: image,
        aboutImageAspect: config.aspect,
        dossierUrl: config.dossierUrl?.trim() || undefined,
        dossierLabel: config.dossierLabel?.trim() || undefined,
        clients: config.clients,
        testimonials: config.testimonials,
      });

      setSource(image);
      setRect(FULL_CROP_RECT);

      refresh();
      onClose();
    } catch (err) {
      setStatus({
        state: "error",
        message: (err as Error).message || "No se pudo aplicar el recorte",
      });
    } finally {
      setSaving(false);
    }
  };

  const aspectPicker = (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-neutral-600 dark:text-[#A8A3B8]">
        Proporción
      </span>

      <div className="flex flex-wrap gap-2">
        {IMAGE_FORMATS.map((format) => {
          const active =
            format.value === null
              ? config.aspect === null
              : config.aspect !== null &&
                Math.abs(config.aspect - format.value) < 0.001;

          return (
            <button
              key={format.label}
              type="button"
              onClick={() => update({ aspect: format.value })}
              className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] transition-colors ${
                active
                  ? "border-(--visora-accent) bg-(--visora-accent)/10 text-(--visora-accent)"
                  : "border-neutral-200 text-neutral-500 hover:border-(--visora-accent)/40 hover:text-(--visora-accent) dark:border-[#27243A] dark:text-[#A8A3B8]"
              }`}
            >
              {format.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar Sobre mí"
      wide
      actions={
        <SaveButton
          onClick={() => void handleSave()}
          disabled={saving}
          label={saving ? "Guardando…" : "Guardar"}
        />
      }
    >
      <div className="flex flex-col gap-5">
        <AboutSection
          title="Retrato"
          description="Elige la proporción y ajusta el recorte directamente sobre la imagen."
        >
          {source ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
              <div className="order-first min-w-0 flex-1 md:order-none">
                <ImageCropBox
                  src={source}
                  aspect={config.aspect}
                  rect={rect}
                  onChange={setRect}
                />
              </div>

              <div className="flex flex-col gap-4 md:order-first md:w-56 md:shrink-0">
                {aspectPicker}

                <p className="text-left text-xs leading-relaxed text-neutral-400 dark:text-[#6F6A80]">
                  Arrastra sobre la imagen para dibujar un recorte nuevo,
                  muévelo desde dentro o ajusta los tiradores. El recorte se
                  aplica al guardar.
                </p>

                <div className="mt-auto flex flex-wrap justify-start gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-(--visora-accent)/40 bg-(--visora-accent)/10 px-3.5 py-1.5 text-xs font-medium text-(--visora-accent) transition-colors hover:border-(--visora-accent) hover:bg-(--visora-accent)/20">
                    Cambiar
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []);
                        e.target.value = "";
                        void handleFiles(files);
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/5 px-3.5 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-400 hover:bg-red-500/10 dark:text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {aspectPicker}

              <div
                {...dragProps}
                onClick={() => fileRef.current?.click()}
                className={`flex h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-colors sm:h-64 ${
                  isDragging
                    ? "border-[#7C6CFF] bg-[#7C6CFF]/10"
                    : "border-neutral-200 bg-neutral-50/50 dark:border-[#27243A] dark:bg-[#0B0A14]/30"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-neutral-300 dark:text-[#4A4468]"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>

                <p className="pointer-events-none text-xs uppercase tracking-[0.15em] text-neutral-400 dark:text-[#6B6488]">
                  {isDragging
                    ? "Suelta la imagen"
                    : "Arrastra la imagen aquí o haz clic"}
                </p>

                <label
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-[#27243A] dark:text-[#A8A3B8] dark:hover:border-[#4A4468] dark:hover:text-[#F5F3FF]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Subir imagen
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      e.target.value = "";
                      void handleFiles(files);
                    }}
                  />
                </label>

                <p className="pointer-events-none text-[11px] text-neutral-400 dark:text-[#6B6488]">
                  JPG, PNG, WebP · máx 90 MB
                </p>
              </div>
            </>
          )}

          <ImageProcessingIndicator status={status} />
        </AboutSection>

        <AboutSection
          title="Textos"
          description="Título y descripción que aparecen junto al retrato."
        >
          <div className="flex flex-col gap-4">
            <Field
              label="Título"
              value={config.title}
              onChange={(v) => {
                update({ title: v });
                setErrors((e) => ({ ...e, title: undefined }));
              }}
              placeholder="Sobre mí"
              required
              error={errors.title}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm text-neutral-600 dark:text-[#A8A3B8]">
                Descripción
              </label>

              <RichTextHtmlEditor
                value={config.description}
                onChange={(html) => {
                  update({ description: html });
                  setErrors((err) => ({ ...err, description: undefined }));
                }}
              />

              {errors.description ? (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.description}
                </p>
              ) : (
                <p className="text-xs text-neutral-400 dark:text-[#6F6A80]">
                  Puedes usar negrita, cursiva, listas, citas y enlaces.
                </p>
              )}
            </div>
          </div>
        </AboutSection>

        {/* Dossier descargable */}
        <AboutSection
          title="Dossier & Tarifas (PDF)"
          description="Enlaza tu dossier o PDF de tarifas (Dropbox, Google Drive, Cloudinary u otro servicio de alojamiento)."
        >
          <div className="flex flex-col gap-4">
            <Field
              label="URL del archivo PDF"
              value={config.dossierUrl ?? ""}
              onChange={(v) => update({ dossierUrl: v })}
              placeholder="https://ejemplo.com/dossier.pdf"
            />
            <Field
              label="Texto del botón"
              value={config.dossierLabel ?? ""}
              onChange={(v) => update({ dossierLabel: v })}
              placeholder="Descargar Dossier & Tarifas (PDF)"
            />
          </div>
        </AboutSection>

        {/* Marcas y Clientes Destacados */}
        <AboutSection
          title="Clientes y Publicaciones"
          description="Marcas, revistas o clientes con los que has colaborado para generar confianza."
        >
          <div className="flex flex-col gap-3">
            {config.clients.map((client, idx) => (
              <div
                key={client.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-3 dark:border-[#2A273F] dark:bg-white/5"
              >
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={client.name}
                    onChange={(e) => {
                      const next = [...config.clients];
                      next[idx] = { ...next[idx], name: e.target.value };
                      update({ clients: next });
                    }}
                    placeholder="Nombre del cliente o revista"
                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-(--visora-accent) dark:border-[#2A273F] dark:bg-[#161327] dark:text-white"
                  />
                  <input
                    type="url"
                    value={client.url ?? ""}
                    onChange={(e) => {
                      const next = [...config.clients];
                      next[idx] = { ...next[idx], url: e.target.value };
                      update({ clients: next });
                    }}
                    placeholder="https://sitio.com (opcional)"
                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-(--visora-accent) dark:border-[#2A273F] dark:bg-[#161327] dark:text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    update({
                      clients: config.clients.filter((_, i) => i !== idx),
                    });
                  }}
                  className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Eliminar cliente"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                update({
                  clients: [
                    ...config.clients,
                    { id: `c-${Date.now()}`, name: "", url: "" },
                  ],
                });
              }}
              className="mt-1 self-start rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-600 transition-colors hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-[#2A273F] dark:text-[#A8A3B8]"
            >
              + Agregar cliente o marca
            </button>
          </div>
        </AboutSection>

        {/* Testimonios */}
        <AboutSection
          title="Testimonios de Clientes"
          description="Citas de directores de arte, clientes o colaboradores sobre tu trabajo."
        >
          <div className="flex flex-col gap-4">
            {config.testimonials.map((t, idx) => (
              <div
                key={t.id}
                className="flex flex-col gap-3 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 p-4 dark:border-[#2A273F] dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-neutral-400">
                    Testimonio #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      update({
                        testimonials: config.testimonials.filter(
                          (_, i) => i !== idx,
                        ),
                      });
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>

                <textarea
                  value={t.quote}
                  onChange={(e) => {
                    const next = [...config.testimonials];
                    next[idx] = { ...next[idx], quote: e.target.value };
                    update({ testimonials: next });
                  }}
                  placeholder="&ldquo;Cita del cliente sobre tu trabajo...&rdquo;"
                  rows={2}
                  className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 text-xs italic outline-none focus:border-(--visora-accent) dark:border-[#2A273F] dark:bg-[#161327] dark:text-white"
                />

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <input
                    type="text"
                    value={t.author}
                    onChange={(e) => {
                      const next = [...config.testimonials];
                      next[idx] = { ...next[idx], author: e.target.value };
                      update({ testimonials: next });
                    }}
                    placeholder="Nombre (ej. María López)"
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-(--visora-accent) dark:border-[#2A273F] dark:bg-[#161327] dark:text-white"
                  />
                  <input
                    type="text"
                    value={t.role ?? ""}
                    onChange={(e) => {
                      const next = [...config.testimonials];
                      next[idx] = { ...next[idx], role: e.target.value };
                      update({ testimonials: next });
                    }}
                    placeholder="Cargo (ej. Directora Creativa)"
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-(--visora-accent) dark:border-[#2A273F] dark:bg-[#161327] dark:text-white"
                  />
                  <input
                    type="text"
                    value={t.company ?? ""}
                    onChange={(e) => {
                      const next = [...config.testimonials];
                      next[idx] = { ...next[idx], company: e.target.value };
                      update({ testimonials: next });
                    }}
                    placeholder="Empresa (ej. Studio Norte)"
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-(--visora-accent) dark:border-[#2A273F] dark:bg-[#161327] dark:text-white"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                update({
                  testimonials: [
                    ...config.testimonials,
                    {
                      id: `t-${Date.now()}`,
                      quote: "",
                      author: "",
                      role: "",
                      company: "",
                    },
                  ],
                });
              }}
              className="mt-1 self-start rounded-xl border border-dashed border-neutral-300 px-4 py-2 text-xs font-medium text-neutral-600 transition-colors hover:border-(--visora-accent) hover:text-(--visora-accent) dark:border-[#2A273F] dark:text-[#A8A3B8]"
            >
              + Agregar testimonio
            </button>
          </div>
        </AboutSection>
      </div>
    </Modal>
  );
}

export default EditAboutModal;
