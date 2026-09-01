import { useEffect } from "react";

import { usePortfolio } from "../lib/usePortfolio";

function setMeta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);

  if (!content) {
    if (el) el.remove();
    return;
  }

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute("content", content);
}

function setLink(rel: string, href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!href) {
    if (el) el.remove();
    return;
  }

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }

  el.setAttribute("href", href);
}

function DocumentHead() {
  const { profile, settings } = usePortfolio();

  const seoTitle =
    settings.seo.title ||
    `${settings.general.brandName || profile.name} - ${settings.general.profession || profile.profession}`;

  useEffect(() => {
    document.documentElement.setAttribute("lang", settings.general.language || "es");

    document.title = seoTitle;

    setMeta("name", "description", settings.seo.description || null);
    setMeta("property", "og:title", seoTitle);
    setMeta("property", "og:description", settings.seo.description || null);
    setMeta("property", "og:image", settings.seo.ogImage || null);
    setMeta("property", "og:type", "website");
    setMeta("name", "robots", settings.seo.noindex ? "noindex, nofollow" : "index, follow");

    const favicon = settings.general.favicon || "/favicon.svg";
    setLink("icon", favicon);

    // Canonical: se deriva de la URL real donde está desplegado el sitio.
    // En localhost no se emite para no ensuciar el SEO en desarrollo.
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    let canon: string | null = null;

    if (!isLocalhost) {
      canon =
        window.location.origin +
        (window.location.pathname.length > 1 ? window.location.pathname : "/");
    }

    setLink("canonical", canon ? canon.replace(/\/+/g, "/") : null);
  }, [settings, seoTitle]);

  return null;
}

export default DocumentHead;
