import type { WatermarkStyle } from "../types/portfolio";
import { isBlobUrl, isDataUrl, resizeUrl } from "./image";

const MAX_WIDTH = 2400;

export interface WatermarkOptions {
  text: string;
  style: WatermarkStyle;
  opacity: number;
}

/**
 * Carga una imagen para aplicar la marca de agua.
 * - URLs `data:` / `blob:` (subidas locales): mismas que ya vienen optimizadas,
 *   NO llevan `crossOrigin` (no aplica) ni parámetros CDN.
 * - URLs remotas http(s): se les piden variantes CDN (`?auto=format&w=2400`)
 *   y se cargan anónimas (requiere CORS del proveedor, p.ej. Supabase Storage).
 */
export function loadImageWithCors(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const isLocal = isDataUrl(src) || isBlobUrl(src);
    img.crossOrigin = isLocal ? null : "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = isLocal ? src : resizeUrl(src, MAX_WIDTH, 85);
  });
}

function drawCorner(ctx: CanvasRenderingContext2D, text: string, width: number, height: number) {
  ctx.font = `600 ${Math.round(Math.min(width, 1400) * 0.02) + 12}px Montserrat, sans-serif`;
  ctx.textBaseline = "bottom";
  const metrics = ctx.measureText(text);
  const tx = width - metrics.width - 20;
  const ty = height - 20;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillText(text, tx + 2, ty + 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, tx, ty);
}

export function applyWatermark(img: HTMLImageElement, opts: WatermarkOptions): string {
  const scale = Math.min(1, MAX_WIDTH / img.naturalWidth);
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas no disponible");

  ctx.drawImage(img, 0, 0, width, height);

  const fallback = Math.max(width, height) * 0.025;
  const fontSize =
    opts.style === "tiling"
      ? Math.max(22, Math.round((width / 100) * 2.4))
      : Math.max(12, Math.round((width / 100) * 1.9));

  ctx.font = `500 ${fontSize}px Montserrat, sans-serif`;
  ctx.textBaseline = "alphabetic";

  if (opts.style === "corner") {
    drawCorner(ctx, opts.text, width, height);
    return canvas.toDataURL("image/jpeg", 0.92);
  }

  ctx.globalAlpha = opts.opacity;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = Math.max(1, fallback * 0.06);
  ctx.textAlign = "center";

  const spacer = fontSize * 3.2;
  const diag = Math.sqrt(width * width + height * height);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate((-30 * Math.PI) / 180);

  const lineWidth = ctx.measureText(opts.text).width;

  for (let x = -diag; x < diag; x += lineWidth + spacer) {
    for (let y = -diag; y < diag; y += spacer) {
      ctx.strokeText(opts.text, x, y);
      ctx.fillText(opts.text, x, y);
    }
  }

  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.92);
}
