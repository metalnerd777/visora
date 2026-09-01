// Presets de favicon para profesionales/negocios.
// Color adaptable al tema:
// - `inlineSvg()`: usa `currentColor`, así el picker hereda el color del
//   contenedor (gris adaptable en claro/oscuro) sin depender de clases globales.
// - `svg()`: versión como data URL para el favicon real (un <link> no puede usar
//   currentColor), con gris fijo que se adapta al tema del navegador.
// Estilo mixto: la mayoría en contorno (stroke, con transparencia interna),
// salvo `initial` (V) y `palette` que van como silueta rellena para que se lean bien.

export interface FaviconPreset {
  id: string;
  label: string;
  svg: () => string;
  inlineSvg: () => string;
}

type IconKind = "stroke" | "fill";

const DARK = "#e4e4e7";
const LIGHT = "#3f3f46";

const SCALE = 'transform="translate(9 9) scale(1.9166)"';
const STROKE_ATTR =
  'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

function inlineSvg(inner: string, kind: IconKind): string {
  const attr = kind === "stroke" ? STROKE_ATTR : 'fill="currentColor"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%"><g ${attr} ${SCALE}>${inner}</g></svg>`;
}

function faviconSvg(inner: string, kind: IconKind): string {
  const base =
    kind === "stroke"
      ? `fill:none;stroke:${LIGHT};stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round`
      : `fill:${LIGHT}`;
  const darkColor = kind === "stroke" ? `stroke:${DARK}` : `fill:${DARK}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>.i{${base}}@media(prefers-color-scheme:dark){.i{${darkColor}}}</style><g class="i" ${SCALE}>${inner}</g></svg>`;
}

const icons: { id: string; label: string; kind: IconKind; body: string }[] = [
  {
    id: "initial",
    label: "Inicial",
    kind: "fill",
    body: `<path d="M10 3 L12 19 L14 3 H17.5 L13 21 H11 L6.5 3 Z"/>`,
  },
  {
    id: "camera",
    label: "Cámara",
    kind: "stroke",
    body: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>`,
  },
  {
    id: "brush",
    label: "Pincel",
    kind: "stroke",
    body: `<path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 4-6 4"/><path d="m8 12-1 1c-1.5 1.5-2 4-2 5 1 0 3.5-.5 5-2l1-1"/>`,
  },
  {
    id: "pen",
    label: "Lápiz",
    kind: "stroke",
    body: `<path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>`,
  },
  {
    id: "target",
    label: "Objetivo",
    kind: "stroke",
    body: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>`,
  },
  {
    id: "palette",
    label: "Paleta",
    kind: "fill",
    body: `<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.96 6.01 17.46 2 12 2zm-5.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4.5A1.5 1.5 0 1 1 10.5 6 1.5 1.5 0 0 1 9.5 7.5zm6 0A1.5 1.5 0 1 1 16.5 6a1.5 1.5 0 0 1-1 1.5zM15 12.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>`,
  },
  {
    id: "video",
    label: "Cámara de video",
    kind: "stroke",
    body: `<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/>`,
  },
  {
    id: "architecture",
    label: "Arquitectura",
    kind: "stroke",
    body: `<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>`,
  },
  {
    id: "code",
    label: "Diseño web",
    kind: "stroke",
    body: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  },
  {
    id: "fashion",
    label: "Moda",
    kind: "stroke",
    body: `<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>`,
  },
];

export const FAVICON_PRESETS: FaviconPreset[] = icons.map((icon) => ({
  id: icon.id,
  label: icon.label,
  svg: () => faviconSvg(icon.body, icon.kind),
  inlineSvg: () => inlineSvg(icon.body, icon.kind),
}));

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function presetDataUrl(preset: FaviconPreset): string {
  return svgToDataUrl(preset.svg());
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function fileToFaviconDataUrl(
  file: File,
  size = 64,
): Promise<string> {
  if (
    file.type === "image/svg+xml" ||
    file.name.toLowerCase().endsWith(".svg")
  ) {
    const text = await file.text();
    const adapted = toFaviconSvg(text);
    return svgToDataUrl(adapted ?? text);
  }

  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    URL.revokeObjectURL(url);
    throw new Error("Canvas no disponible");
  }

  const isJpeg = file.type === "image/jpeg";

  if (isJpeg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
  }

  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;

  ctx.drawImage(img, x, y, w, h);

  URL.revokeObjectURL(url);
  return canvas.toDataURL("image/png");
}

// --- Adaptación de SVG subidos al tema del sitio ---------------------------

// Extrae viewBox y el contenido interno de un SVG de forma robusta, usando
// DOMParser (maneja prolog XML, comentarios, namespaces) con fallback a regex.
function parseSvgParts(
  svg: string,
): { vb: string; body: string } | null {
  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
      const root = doc.querySelector("svg");
      if (root) {
        const vb = root.getAttribute("viewBox") || "0 0 64 64";
        const body = Array.from(root.children)
          .map((child) => new XMLSerializer().serializeToString(child))
          .join("");
        return { vb, body };
      }
    } catch {
      /* fallback a regex */
    }
  }

  const tagMatch = svg.match(/<svg\b[^>]*>/i);
  const vb = svg.match(/viewBox="([^"]+)"/i)?.[1] ?? "0 0 64 64";

  if (!tagMatch) return null;

  const afterOpen = svg.slice(tagMatch.index! + tagMatch[0].length);
  const closeIndex = afterOpen.lastIndexOf("</svg>");
  const body = closeIndex >= 0 ? afterOpen.slice(0, closeIndex) : afterOpen;

  return { vb, body };
}

// Convierte los colores literales (fill/stroke) de un SVG a currentColor,
// conservando fill="none" y "transparent" para no romper los contornos.
function toCurrentColor(svg: string): string {
  const cleaned = svg
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<defs>[\s\S]*?<\/defs>/gi, "");

  return cleaned.replace(
    /\b(fill|stroke)=["']([^"']*)["']/gi,
    (_match: string, attr: string, val: string) => {
      const v = val.trim().toLowerCase();
      if (!v || v === "none" || v === "transparent") return _match;
      return `${attr}="currentColor"`;
    },
  );
}

// Favicon real (data URL): gray adaptable al tema del navegador.
export function toFaviconSvg(svg: string): string | null {
  const parts = parseSvgParts(svg);
  if (!parts) return null;
  const inner = toCurrentColor(parts.body);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="v" viewBox="${parts.vb}"><style>.v{color:${LIGHT}}@media(prefers-color-scheme:dark){.v{color:${DARK}}}</style>${inner}</svg>`;
}

// Preview del picker: hereda el color (currentColor) del contenedor.
export function toInlineSvg(svg: string): string | null {
  const parts = parseSvgParts(svg);
  if (!parts) return null;
  const inner = toCurrentColor(parts.body);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${parts.vb}" width="100%" height="100%">${inner}</svg>`;
}

// Extrae el texto SVG de un data URL SVG (para la preview inline del picker).
// Devuelve null si no es un data URL SVG válido.
export function decodeSvgDataUrl(dataUrl: string): string | null {
  const prefix = "data:image/svg+xml,";
  if (!dataUrl.startsWith(prefix)) return null;
  try {
    return decodeURIComponent(dataUrl.slice(prefix.length));
  } catch {
    return null;
  }
}
