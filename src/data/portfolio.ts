import type {
  PortfolioProfile,
  Project,
  Photo,
  SiteTexts,
  BlogPost,
} from "../types/portfolio";

export const profile: PortfolioProfile = {
  name: "Alex Morgan",
  profession: "Fotógrafo",

  description:
    "Fotografía documental, retratos y momentos que merecen ser recordados.",

  heroImage:
    "https://www.sigma-global.com/shooting-with-sigma/24_14_dg_dn_a022_Impression_BTS_Francesco-Riccardo-Iacomino_2.jpg",

  heroPrimaryButton: "Ver portfolio",
  heroSecondaryButton: "Contacto",

  aboutTitle:
    "Historias contadas a través de imágenes.",

  aboutDescription:
    "Soy fotógrafo especializado en capturar momentos auténticos, personas y lugares. Mi objetivo es crear imágenes que conserven la emoción de cada historia.",

  contactTitle: "Creemos algo juntos.",
  contactDescription:
    "Cuéntame tu idea y te responderé lo antes posible. Trabajemos en imágenes que duren para siempre.",

  email: "hello@example.com",
  location: "Santiago, Chile",

  socialLinks: [
    { platform: "instagram", handle: "@alexmorgan" },
    { platform: "behance", handle: "alexmorgan" },
  ],
};

export const siteTexts: SiteTexts = {
  workNounSingular: "fotografía",
  workNounPlural: "fotografías",

  featuredLabel: "Selección destacada",
  featuredTitle: "Una mirada a mi trabajo",
  featuredDescription:
    "Una selección de trabajos que representan mi estilo y mi forma de trabajar.",

  projectsLabel: "Portfolio",
  projectsTitle: "Proyectos",
  projectsDescription:
    "Explora mis diferentes proyectos y descubre las historias detrás de cada imagen.",
};

export const projects: Project[] = [
  {
    id: "proj-weddings",
    slug: "bodas",
    title: "Bodas",
    description: "Momentos únicos de un día especial.",
    cover:
      "https://images.unsplash.com/photo-1519741497674-611481863552",
    photos: [
      {
        id: "photo-001",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552",
        title: "Ceremonia",
      },
      {
        id: "photo-002",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
        title: "Celebración",
      },
    ],
  },

  {
    id: "proj-portraits",
    slug: "retratos",
    title: "Retratos",
    description: "Personas, personalidad e historias.",
    cover:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    photos: [
      {
        id: "photo-003",
        url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
        title: "Retrato I",
      },
      {
        id: "photo-004",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
        title: "Retrato II",
      },
    ],
  },

  {
    id: "proj-landscapes",
    slug: "paisajes",
    title: "Paisajes",
    description: "Lugares y momentos encontrados.",
    cover:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    photos: [
      {
        id: "photo-005",
        url: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        title: "Paisaje I",
      },
      {
        id: "photo-006",
        url: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624",
        title: "Paisaje II",
      },
    ],
  },
];

export const favorites: Photo[] = [
  {
    id: "fav-001",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552",
    title: "Una tarde especial",
  },
  {
    id: "fav-002",
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    title: "Retrato",
  },
  {
    id: "fav-003",
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    title: "Paisaje",
  },
];

export const featuredPhotos: Photo[] = [
  {
    id: "feat-001",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552",
    title: "Ceremonia",
  },
  {
    id: "feat-002",
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    title: "Retrato",
  },
  {
    id: "feat-003",
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7",
    title: "Paisaje",
  },
  {
    id: "feat-004",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    title: "Celebración",
  },
  {
    id: "feat-005",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    title: "Retrato II",
  },
  {
    id: "feat-006",
    url: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624",
    title: "Paisaje II",
  },
  {
    id: "feat-007",
    url: "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
    title: "Arquitectura",
  },
  {
    id: "feat-008",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    title: "Editorial",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "luz-de-manana-en-valparaiso",
    title: "La luz de la mañana en Valparaíso",
    excerpt:
      "Un recorrido por los cerros al amanecer, cuando la ciudad todavía duerme y la luz dibuja colores imposibles.",
    cover:
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
    date: "2026-08-10",
    blocks: [
      {
        id: "b1",
        type: "text",
        text: "Llegué antes del amanecer con la intención de capturar Valparaíso vacío. Los cerros tienen una textura distinta cuando nadie los mira: el color de las casas se apaga, los gatos ocupan las calles y la niebla baja desde el mar como si fuera parte de la ciudad.",
      },
      {
        id: "b2",
        type: "image",
        url: "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
        alt: "Vista de cerros al amanecer",
        caption: "Cerro Alegre, 6:42 AM.",
      },
      {
        id: "b3",
        type: "text",
        text: "Esta imagen salió en la tercera subida. La primera vez la luz no había llegado; la segunda, un auto estacionado rompía la composición. La paciencia también es parte del oficio.",
      },
      {
        id: "b4",
        type: "image",
        url: "https://images.unsplash.com/photo-1504150558240-0b4fd8946624",
        alt: "Mar de niebla sobre la ciudad",
        caption: "La niebla entrando desde el pacífico.",
      },
    ],
  },

  {
    slug: "detras-de-camara-sesion-retratos",
    title: "Detrás de cámara: sesión de retratos",
    excerpt:
      "Cómo se preparó la última sesión de retratos en estudio: luz, encuadre y un video del proceso completo.",
    cover:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
    date: "2026-07-28",
    blocks: [
      {
        id: "b1",
        type: "text",
        text: "Para esta sesión quise trabajar con una sola fuente de luz y fondos neutros. Menos elementos significan más atención sobre la persona: su mirada, sus manos, los pequeños gestos que cuentan la historia real.",
      },
      {
        id: "b2",
        type: "embed",
        provider: "youtube",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "El proceso completo, grabado durante la sesión.",
      },
      {
        id: "b3",
        type: "text",
        text: "El resultado completo estará disponible próximamente en la sección de proyectos. Mientras tanto, este avance muestra cómo trabajamos entre luces de prueba y tomas finales.",
      },
    ],
  },

  {
    slug: "inspiracion-color-y-composicion",
    title: "Inspiración: color y composición",
    excerpt:
      "Referencias visuales que estoy coleccionando últimamente: paletas, geometrías y artistas que admiro.",
    cover:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    date: "2026-07-02",
    blocks: [
      {
        id: "b1",
        type: "text",
        text: "Últimamente mi tablero de inspiración gira alrededor del color como estructura narrativa: paletas limitadas, contrastes controlados y composiciones donde cada elemento tiene una razón para existir.",
      },
      {
        id: "b2",
        type: "embed",
        provider: "instagram",
        url: "https://www.instagram.com/p/CxKq2LhR7tP/",
        caption: "Uno de mis hallazgos recientes.",
      },
      {
        id: "b3",
        type: "text",
        text: "Si quieres ver más referencias y trabajos en proceso, sígueme en redes o revisa mis tableros públicos.",
      },
      {
        id: "b4",
        type: "embed",
        provider: "behance",
        url: "https://www.behance.net/gallery/185432701/Color-Studies",
      },
    ],
  },
];
