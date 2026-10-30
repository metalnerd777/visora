const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "S",
  "H1",
  "H2",
  "H3",
  "H4",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "A",
]);

const DROP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "FORM",
  "INPUT",
  "BUTTON",
  "TEXTAREA",
  "SELECT",
  "LINK",
  "META",
  "SVG",
  "VIDEO",
  "AUDIO",
  "IMG",
]);

const ALIGN_TAGS = new Set(["P", "H1", "H2", "H3", "H4"]);

const HTML_TAG_RE =
  /<\/?(?:p|br|strong|b|em|i|u|s|h[1-6]|ul|ol|li|blockquote|a)\b[^>]*>/i;

export function looksLikeHtml(value: string): boolean {
  return HTML_TAG_RE.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#x0*27;/gi, "'");
}

/** Convierte texto plano (con saltos de línea) al HTML que usa el editor. */
export function plainTextToHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map(
      (paragraph) =>
        `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");
}

function sanitizeElement(element: Element) {
  for (const child of Array.from(element.children)) {
    const tag = child.tagName.toUpperCase();

    if (DROP_TAGS.has(tag)) {
      child.remove();
      continue;
    }

    if (!ALLOWED_TAGS.has(tag)) {
      sanitizeElement(child);
      child.replaceWith(...Array.from(child.childNodes));
      continue;
    }

    const attributes = Array.from(child.attributes);
    let href: string | null = null;
    let textAlign: string | null = null;

    for (const attribute of attributes) {
      const name = attribute.name.toLowerCase();

      if (tag === "A" && name === "href") {
        const clean = sanitizeLink(attribute.value);
        if (clean) href = clean;
      }

      if (name === "style" && ALIGN_TAGS.has(tag)) {
        const match = /text-align\s*:\s*(left|center|right|justify)/i.exec(
          attribute.value,
        );
        if (match) textAlign = match[1].toLowerCase();
      }
    }

    for (const attribute of attributes) {
      child.removeAttribute(attribute.name);
    }

    if (href) {
      child.setAttribute("href", href);
      child.setAttribute("target", "_blank");
      child.setAttribute("rel", "noopener noreferrer");
    }

    if (textAlign) {
      child.setAttribute("style", `text-align: ${textAlign}`);
    }

    sanitizeElement(child);
  }
}

function sanitizeLink(value: string): string | null {
  const url = value.trim();

  if (!url) return null;

  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url;

  if (/^\/(?!\/)/.test(url)) return url;

  return null;
}

/**
 * Limpia el HTML del editor dejando solo formato seguro (párrafos, énfasis,
 * listas, citas y enlaces). Se usa tanto al guardar como al renderizar.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return escapeHtml(html);
  }

  const doc = new DOMParser().parseFromString(
    `<div id="visora-root">${html}</div>`,
    "text/html",
  );

  const root = doc.getElementById("visora-root");

  if (!root) return "";

  sanitizeElement(root);

  return root.innerHTML;
}

/** Normaliza cualquier valor (texto plano antiguo o HTML) a HTML seguro. */
export function toSafeHtml(value: string | undefined | null): string {
  if (typeof value !== "string" || value.trim() === "") return "";

  if (!looksLikeHtml(value)) return plainTextToHtml(value);

  return sanitizeHtml(value);
}

/** Texto plano de un HTML, útil para validaciones. */
export function htmlToText(html: string): string {
  if (!html) return "";

  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}
