// --- Presets de apariencia (color de acento, radio, botones, tipografía) ---

export interface AccentPreset {
  id: string;
  label: string;
  color: string;
}

// 6 colores de acento pre-establecidos (en lugar de un color picker libre).
export const ACCENT_PRESETS: AccentPreset[] = [
  { id: "violet", label: "Violeta", color: "#7C6CFF" },
  { id: "blue", label: "Azul", color: "#3B82F6" },
  { id: "emerald", label: "Esmeralda", color: "#10B981" },
  { id: "amber", label: "Ámbar", color: "#F59E0B" },
  { id: "rose", label: "Rosa", color: "#F43F5E" },
  { id: "slate", label: "Grafito", color: "#334155" },
];

export function accentPresetFor(color: string): AccentPreset | null {
  const normalized = color.toLowerCase();
  return (
    ACCENT_PRESETS.find((p) => p.color.toLowerCase() === normalized) ?? null
  );
}

// Background: color base del fondo del sitio (claro u oscuro).
export const BACKGROUND_BASES: { id: string; label: string; color: string }[] = [
  { id: "base", label: "Claro neutro", color: "#F7F7FA" },
  { id: "ivory", label: "Marfil", color: "#FAF6ED" },
  { id: "cloud", label: "Gris claro", color: "#EEF0F3" },
  { id: "smoke", label: "Gris medio", color: "#2A2A31" },
  { id: "graphite", label: "Grafito", color: "#1E1E24" },
  { id: "ink", label: "Negro", color: "#111113" },
];

// Acentos del fondo (color que aporta el degradado).
export const BACKGROUND_ACCENTS: {
  id: string;
  label: string;
  color: string;
}[] = [
  { id: "violet", label: "Violeta", color: "#7C6CFF" },
  { id: "blue", label: "Azul", color: "#4C7DFF" },
  { id: "teal", label: "Verde azulado", color: "#2EC4B6" },
  { id: "amber", label: "Ámbar", color: "#F5A524" },
  { id: "rose", label: "Rosa", color: "#F06292" },
  { id: "indigo", label: "Índigo", color: "#6366F1" },
  { id: "charcoal", label: "Carbón", color: "#3A3A44" },
  { id: "slate", label: "Pizarra", color: "#475569" },
];

// Degradados pre-hechos (base + acento) para elegir de una sola vez.
export const PRESET_GRADIENTS: {
  id: string;
  label: string;
  base: string;
  accent: string;
  dark: boolean;
}[] = [
  { id: "midnight-violet", label: "Medianoche · violeta", base: "#111113", accent: "#7C6CFF", dark: true },
  { id: "ink-blue", label: "Negro · azul", base: "#0F1115", accent: "#4C7DFF", dark: true },
  { id: "graphite-teal", label: "Grafito · verde azulado", base: "#191B20", accent: "#2EC4B6", dark: true },
  { id: "obsidian-rose", label: "Obsidiana · rosa", base: "#141115", accent: "#F06292", dark: true },
  { id: "slate-amber", label: "Pizarra · ámbar", base: "#23252B", accent: "#F5A524", dark: true },
  { id: "charcoal-indigo", label: "Carbón · índigo", base: "#1C1C24", accent: "#6366F1", dark: true },
  { id: "cloud-violet", label: "Claro · violeta", base: "#F7F7FA", accent: "#7C6CFF", dark: false },
  { id: "ivory-amber", label: "Marfil · ámbar", base: "#FAF6ED", accent: "#F5A524", dark: false },
  { id: "paper-teal", label: "Papel · verde azulado", base: "#F2F6F5", accent: "#2EC4B6", dark: false },
];

// --- Presets de gradiente del hero (imágenes con transparencia) ---

export interface HeroGradientPreset {
  id: string;
  label: string;
  glow: string; // color del halo radial (acento)
  color1: string; // color inicial del degradado lineal
  color2: string; // color final del degradado lineal
}

export const HERO_GRADIENT_PRESETS: HeroGradientPreset[] = [
  { id: "midnight-violet", label: "Noche violácea", glow: "#7C6CFF", color1: "#2A1E5C", color2: "#0B0A14" },
  { id: "deep-ocean", label: "Mar profundo", glow: "#2EC4B6", color1: "#0E2433", color2: "#080D1A" },
  { id: "sunset-ember", label: "Atardecer", glow: "#F97316", color1: "#3B1D2E", color2: "#120C14" },
  { id: "emerald-mist", label: "Esmeralda", glow: "#10B981", color1: "#0F2418", color2: "#0A0F0D" },
  { id: "elegant-graphite", label: "Grafito elegante", glow: "#3A3A44", color1: "#232329", color2: "#0C0C0F" },
];

export function heroGradientFor(id: string | undefined): HeroGradientPreset {
  return (
    HERO_GRADIENT_PRESETS.find((p) => p.id === id) ?? HERO_GRADIENT_PRESETS[0]
  );
}

export function heroGradientBackground(preset: HeroGradientPreset): string {
  return `radial-gradient(120% 150% at 85% 10%, color-mix(in srgb, ${preset.glow} 45%, transparent), transparent 60%), linear-gradient(160deg, ${preset.color1} 0%, ${preset.color2} 100%)`;
}

// --- Suavizado de bordes de la imagen del hero (mask) ---------------------
// Máscara CSS aplicada directamente a la imagen (style de los <img>) para
// que sus bordes se fundan con el fondo y no se vea el "corte" rectangular.
// Se usa en el Hero minimal y en el CoverContent editorial.

export interface HeroFadeSides {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export function heroImageMask(
  fades: HeroFadeSides,
): {
  maskImage?: string;
  WebkitMaskImage?: string;
  maskComposite?: string;
  WebkitMaskComposite?: string;
} {
  const layers: string[] = [];

  if (fades.top)
    layers.push("linear-gradient(180deg, transparent 0%, #000 25%)");
  if (fades.bottom)
    layers.push("linear-gradient(0deg, transparent 0%, #000 25%)");
  if (fades.left)
    layers.push("linear-gradient(90deg, transparent 0%, #000 25%)");
  if (fades.right)
    layers.push("linear-gradient(270deg, transparent 0%, #000 25%)");

  if (layers.length === 0) return {};

  const mask = layers.join(", ");

  return {
    maskImage: mask,
    WebkitMaskImage: mask,
    maskComposite: layers.length > 1 ? "intersect" : undefined,
    WebkitMaskComposite: layers.length > 1 ? "intersect" : undefined,
  };
}

// Mapas de radio y botones (valores en rem).
export const RADIUS_OPTIONS: { value: "sm" | "md" | "lg"; label: string }[] = [
  { value: "sm", label: "Sutil" },
  { value: "md", label: "Medio" },
  { value: "lg", label: "Redondeado" },
];

export const BUTTON_OPTIONS: { value: "pill" | "rounded" | "square"; label: string }[] = [
  { value: "pill", label: "Píldora" },
  { value: "rounded", label: "Redondeado" },
  { value: "square", label: "Cuadrado" },
];

export const RADIUS_SCALE: Record<"sm" | "md" | "lg", number> = {
  sm: 0.75,
  md: 1,
  lg: 1.25,
};

export const BUTTON_RADIUS: Record<"pill" | "rounded" | "square", string> = {
  pill: "9999px",
  rounded: "0.75rem",
  square: "0",
};

// --- Tipografías (Google Fonts) ---

export interface FontOption {
  family: string;
  label: string;
  cssName: string; // nombre en font-family
  weights: string; // para la URL de Google Fonts
  category: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    family: "Montserrat",
    label: "Montserrat",
    cssName: "'Montserrat', sans-serif",
    weights: "200;300;400;500;600",
    category: "sans",
  },
  {
    family: "Inter",
    label: "Inter",
    cssName: "'Inter', sans-serif",
    weights: "300;400;500;600",
    category: "sans",
  },
  {
    family: "Poppins",
    label: "Poppins",
    cssName: "'Poppins', sans-serif",
    weights: "300;400;500;600",
    category: "sans",
  },
  {
    family: "Space Grotesk",
    label: "Space Grotesk",
    cssName: "'Space Grotesk', sans-serif",
    weights: "300;400;500;600",
    category: "sans",
  },
  {
    family: "Playfair Display",
    label: "Playfair Display",
    cssName: "'Playfair Display', serif",
    weights: "400;500;600;700",
    category: "serif",
  },
  {
    family: "Lora",
    label: "Lora",
    cssName: "'Lora', serif",
    weights: "400;500;600",
    category: "serif",
  },
];

export function fontOptionFor(family: string): FontOption {
  return (
    FONT_OPTIONS.find((f) => f.family.toLowerCase() === family.toLowerCase()) ??
    FONT_OPTIONS[0]
  );
}

// --- Luminosidad del fondo ------------------------------------------------

// Indica si un color hex es "oscuro" (para garantizar contraste de texto).
export function isDarkColor(hex: string): boolean {
  const c = (hex || "#fff").replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return false;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum < 0.55;
}

// Base efectiva del fondo según el modo: si la base elegida no contrasta con
// el modo, se sustituye por un neutro claro/oscuro para mantener la legibilidad.
export function effectiveBase(base: string, darkMode: boolean): string {
  const baseIsDark = isDarkColor(base);
  if (darkMode) return baseIsDark ? base : "#0B0A14";
  return baseIsDark ? "#F5F5F8" : base;
}

// Carga la hoja de estilos de Google Fonts para una familia (una sola vez).
export function loadGoogleFont(family: string): void {
  const option = fontOptionFor(family);
  const id = "visora-font-" + option.family.toLowerCase().replace(/\s+/g, "-");
  if (document.getElementById(id)) return;

  const familyParam = option.family.replace(/\s+/g, "+");
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${option.weights}&display=swap`;
  document.head.appendChild(link);
}
