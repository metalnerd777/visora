import imageCompression from "browser-image-compression";

export type VariantKey = "thumb" | "preview" | "full";

export const VARIANT_SIZES: Record<VariantKey, number> = {
  thumb: 640,
  preview: 1600,
  full: 2400,
};

export interface ImageVariant {
  key: VariantKey;
  width: number;
  file: Blob;
}

export interface ImageProcessResult {
  url: string;
  originalSize: number;
  finalSize: number;
  width: number;
  height: number;
  variants: ImageVariant[];
  mimeType: string;
}

export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeMB?: number;
  quality?: number;
}

export const DEFAULT_MAX_SIZE_MB = 90;

const ACCEPTED_MIME = /^image\/(jpeg|png|webp|gif|avif|bmp|tiff|svg\+xml)$/;

export function isSupportedImage(file: File): boolean {
  return ACCEPTED_MIME.test(file.type);
}

export function validateImage(file: File, maxSizeMB = DEFAULT_MAX_SIZE_MB): string | null {
  if (!file) return "No se seleccionó ningún archivo";
  if (!isSupportedImage(file)) return `Tipo de archivo no soportado: ${file.type || "desconocido"}`;
  if (file.size <= 0) return "El archivo está vacío";
  if (file.size > maxSizeMB * 1024 * 1024)
    return `La imagen supera el límite de ${maxSizeMB} MB (${formatBytes(file.size)})`;
  return null;
}

function compressStep(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<Blob> {
  return imageCompression(file, {
    maxSizeMB: 100,
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
    initialQuality: quality,
    fileType: "image/webp" as never,
  });
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = src;
  });
}

async function blobToWebPDataUrl(blob: Blob, quality: number): Promise<{ url: string; width: number; height: number }> {
  if (typeof HTMLCanvasElement !== "undefined") {
    const objectUrl = URL.createObjectURL(blob);
    try {
      const img = await loadImage(objectUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas no disponible");
      ctx.drawImage(img, 0, 0);
      let url: string;
      try {
        url = canvas.toDataURL("image/webp", quality);
      } catch {
        url = canvas.toDataURL("image/jpeg", quality);
      }
      return { url, width: img.naturalWidth, height: img.naturalHeight };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }
  return { url: URL.createObjectURL(blob), width: 0, height: 0 };
}

export interface ProcessResultRaw {
  url: string;
  originalSize: number;
  finalSize: number;
  width: number;
  height: number;
}

/**
 * Procesa una imagen: valida → corrige orientación (browser-image-compression)
 * → redimensiona → comprime → convierte a WebP. Además genera las 3 variantes
 * (thumb/preview/full) listas para subir a Supabase Storage.
 *
 * Retorna la variante principal optimizada como `url` (data URL WebP o blob)
 * junto a su tamaño final. Sigue siendo la única puerta de procesamiento.
 */
export async function processImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<ImageProcessResult> {
  const maxSizeMB = options.maxSizeMB ?? DEFAULT_MAX_SIZE_MB;
  const error = validateImage(file, maxSizeMB);
  if (error) throw new Error(error);

  const quality = options.quality ?? 0.82;
  const originalSize = file.size;

  const compress = (width: number) =>
    compressStep(file, width, 3000, quality);

  const fullBlob = await compress(VARIANT_SIZES.full);

  const [thumbBlob, previewBlob] = await Promise.all([
    compress(VARIANT_SIZES.thumb),
    compress(VARIANT_SIZES.preview),
  ]);

  const variants: ImageVariant[] = [
    { key: "thumb", width: VARIANT_SIZES.thumb, file: thumbBlob },
    { key: "preview", width: VARIANT_SIZES.preview, file: previewBlob },
    { key: "full", width: VARIANT_SIZES.full, file: fullBlob },
  ];

  const primary = previewBlob;
  const { url, width, height } = await blobToWebPDataUrl(primary, quality);

  const mimeType =
    variants[0]?.file.type || new Blob([primary], { type: "image/webp" }).type;

  return {
    url,
    originalSize,
    finalSize: primary.size,
    width,
    height,
    variants,
    mimeType,
  };
}

/**
 * Procesa un grupo de archivos en paralelo y devuelve los resultados en orden.
 */
export async function processImages(
  files: File[],
  options?: ProcessImageOptions
): Promise<ImageProcessResult[]> {
  return Promise.all(files.map((file) => processImage(file, options)));
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function isBlobUrl(url: string): boolean {
  return url.startsWith("blob:");
}

/**
 * Devuelve la URL de una imagen con los parámetros CDN de redimensión/calidad
 * (`?auto=format&w=N&q=85`) SOLO para URLs remotas (http/https). Para URLs
 * `data:` o `blob:` devuelve la URL sin modificar, porque esos esquemas no
 * aceptan query string y ya están optimizados localmente.
 *
 * Sustituye a concatenar `?auto=format...` a mano, que rompe las URLs data/blob.
 */
export function resizeUrl(url: string, width: number, quality = 85): string {
  if (!url) return url;
  if (isDataUrl(url) || isBlobUrl(url)) return url;
  if (!/^https?:\/\//i.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}auto=format&w=${width}&q=${quality}`;
}

export function isDataUrl(url: string): boolean {
  return url.startsWith("data:");
}

/** Libera un ObjectURL de forma segura (no-op si no es blob:) */
export function releaseObjectURL(url: string | undefined | null): void {
  if (url && isBlobUrl(url)) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }
}
