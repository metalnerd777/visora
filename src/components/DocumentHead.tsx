import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  const { profile, settings, projects, blogPosts } = usePortfolio();
  const location = useLocation();

  const brand = settings.general.brandName || profile.name;
  const profession = settings.general.profession || profile.profession;

  const baseTitle = settings.seo.title || `${brand} - ${profession}`;
  const baseDescription = settings.seo.description || profile.description || "";
  const baseOgImage = settings.seo.ogImage || profile.heroImage || "";

  let pageTitle = baseTitle;
  let pageDescription = baseDescription;
  let pageOgImage = baseOgImage;
  let ogType = "website";

  const path = location.pathname;

  if (path.startsWith("/proyecto/")) {
    const slug = decodeURIComponent(path.slice("/proyecto/".length));
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      pageTitle = `${project.title} — ${brand}`;
      if (project.description) pageDescription = project.description;
      if (project.cover) pageOgImage = project.cover;
    }
  } else if (path.startsWith("/blog/")) {
    const slug = decodeURIComponent(path.slice("/blog/".length));
    const post = blogPosts.find((p) => p.slug === slug);
    if (post) {
      pageTitle = `${post.title} — ${brand}`;
      if (post.excerpt) pageDescription = post.excerpt;
      if (post.cover) pageOgImage = post.cover;
      ogType = "article";
    }
  } else if (path === "/blog") {
    pageTitle = `Blog — ${brand}`;
  } else if (path === "/sobre-mi") {
    pageTitle = `Sobre mí — ${brand}`;
  } else if (path === "/contacto") {
    pageTitle = `Contacto — ${brand}`;
    if (profile.contactDescription) pageDescription = profile.contactDescription;
  } else if (path === "/configuracion") {
    pageTitle = `Configuración — ${brand}`;
  }

  useEffect(() => {
    document.documentElement.setAttribute("lang", settings.general.language || "es");

    document.title = pageTitle;

    setMeta("name", "description", pageDescription || null);
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", pageDescription || null);
    setMeta("property", "og:image", pageOgImage || null);
    setMeta("property", "og:type", ogType);
    setMeta("name", "robots", settings.seo.noindex ? "noindex, nofollow" : "index, follow");

    const favicon = settings.general.favicon || "/favicon.svg";
    setLink("icon", favicon);

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
  }, [settings, pageTitle, pageDescription, pageOgImage, ogType, path]);

  return null;
}

export default DocumentHead;
