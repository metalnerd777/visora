# VISORA — CONTEXTO DEL PROYECTO

## 1. Concepto

Visora es una aplicación web/plantilla de portfolios profesionales orientada a fotógrafos, diseñadores, ilustradores y cualquier persona que quiera mostrar su trabajo profesional.

La idea comercial es crear sitios web completos y profesionales que puedan venderse rápidamente y eventualmente a otros profesionales/PYMEs.

El modelo de negocio será:

- Pago único.
- Sin suscripción.
- El cliente compra su sitio.
- Cada cliente tendrá inicialmente su propia cuenta de Vercel.
- Cada cliente tendrá inicialmente su propia cuenta/proyecto de Supabase.
- El cliente tendrá su propio dominio.
- Visora funcionará como una plantilla/aplicación reutilizable.
- Se podrán ofrecer distintos diseños/temas.
- Los temas más elaborados podrán venderse a mayor precio.

El nombre "Visora" es principalmente un nombre interno para el proyecto y no necesariamente será el nombre comercial final del producto.

---

# 2. Modelo técnico/comercial inicial

La idea inicial es NO crear una infraestructura multi-tenant centralizada.

Cada cliente tendrá:

- Su propio proyecto de Supabase.
- Su propio proyecto/deployment de Vercel.
- Su propio dominio.
- Su propia base de datos.
- Su propio almacenamiento de imágenes.

Ventajas:

- Separación completa entre clientes.
- El cliente puede mantener sus servicios independientemente.
- El desarrollador no necesita asumir todos los costos de infraestructura.
- El cliente puede administrar posteriormente sus propios servicios.
- Visora puede entregarse como una aplicación independiente.

El objetivo es mantener los costos iniciales bajos y vender sitios mediante pago único.

---

# 3. Stack actual

Frontend:

- React 19.2.8
- TypeScript 6.0.2
- Vite 8.2.2
- Tailwind CSS 4.3.3 (con custom dark variant)
- React Router DOM 7.18.2 (configurado)
- Google Fonts: Montserrat (200–600)
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (drag-and-drop en admin)
- react-easy-crop (crop de imágenes con focal point)
- TipTap 3 (@tiptap/react + starter-kit + underline + text-align + link) editor de texto enriquecido (lazy-loaded solo en admin)

Backend futuro:

- Supabase
  - PostgreSQL
  - Authentication
  - Storage
  - posiblemente Row Level Security

Hosting futuro:

- Vercel

Repositorio:

- GitHub

Proyecto local:

C:\Users\Skogardraugur\Desktop\visora (windows)
/skogardraugur/Escritorio/visora (Cachy)

---

# 4. Estructura actual del proyecto

src/
├── components/
│   ├── About.tsx              (bloque visual reutilizable, consume usePortfolio)
│   ├── BlogCard.tsx           (tarjeta de publicación del blog)
│   ├── DocumentHead.tsx       (título dinámico + favicon, consume usePortfolio)
│   ├── EmbedBlock.tsx         (renderiza embeds de YouTube/Vimeo/redes)
│   ├── Field.tsx              (input de texto reutilizable para admin)
│   ├── Footer.tsx             (sticky, consume usePortfolio, botón logout cuando autenticado)
│   ├── Header.tsx             (sticky, glass, consume usePortfolio, botón logout cuando autenticado)
│   ├── Hero.tsx               (imagen fondo dual desktop/móvil, object-position, consume usePortfolio)
│   ├── ImageCropModal.tsx     (cropper react-easy-crop, focal point como porcentaje)
│   ├── ImageUpload.tsx        (upload con preview, cambiar/eliminar)
│   ├── MasonryGallery.tsx     (grid masonry dinámico, columnas por count)
│   ├── Modal.tsx              (reutilizable, responsive, Escape, scroll lock)
│   ├── PhotoViewer.tsx        (visor fullscreen, click fuera, SVGs)
│   ├── PostBody.tsx           (renderiza bloques del blog; compartido público + vista previa)
│   ├── ProjectCard.tsx        (tarjeta de proyecto, navega por slug)
│   ├── RichTextEditor.tsx     (TipTap con toolbar: H1-3, negrita, listas, cita, enlace, alineación, deshacer/rehacer)
│   ├── RichTextView.tsx       (renderiza JSON TipTap → elementos estilizados)
│   ├── ScrollToTop.tsx        (scroll a top en cambio de ruta)
│   ├── blog/
│   │   └── BlogBlockEditor.tsx (tarjeta bloque sortable: mango dnd + Subir/Bajar/Editar/Eliminar, formularios Texto/Imagen/Embed, preview, MiniButton)
│   ├── SocialLinksEditor.tsx  (editor de redes sociales reutilizable)
│   └── Toggle.tsx             (switch toggle reutilizable)
│
├── pages/
│   ├── About.tsx              (página /sobre-mi, edit control cuando autenticado)
│   ├── AdminLogin.tsx         (página /admin, UI login mock)
│   ├── Blog.tsx               (listado /blog, [+ Nueva publicación] + editor inline cuando autenticado)
│   ├── BlogPost.tsx           (artículo individual, edit/delete cuando autenticado)
│   ├── Contact.tsx            (página /contacto, edit control cuando autenticado)
│   ├── Home.tsx               (Hero + Featured + Projects con edit controls)
│   ├── NotFound.tsx           (404 reutilizable con título configurable)
│   ├── Project.tsx            (página /proyecto/:slug)
│   └── admin/
│       └── edit/
│           ├── EditableSection.tsx    (wrapper con botones [Editar] / [+ Agregar])
│           ├── EditHeroModal.tsx      (imagen desktop + móvil + focal points + botones)
│           ├── EditProfileModal.tsx   (nombre, profesión, descripción, avatar, redes)
│           ├── EditAboutModal.tsx     (título, descripción, imagen)
│           ├── EditFeaturedModal.tsx   (selección proyectos con DnD)
│           ├── EditProjectsModal.tsx   (lista + form, DnD, imágenes)
│           ├── EditContactModal.tsx    (contacto, WhatsApp, formulario)
│           └── BlogPostEditor.tsx      (editor inline de publicaciones con bloques y TipTap)
│
├── themes/
│   └── minimal/
│       └── MinimalTheme.tsx   (layout flex, dark mode persistente)
│
├── data/
│   └── portfolio.ts           (datos demo: profile, projects, blogPosts, siteTexts)
│
├── lib/
│   ├── auth.ts                (login, logout, isAuthenticated — mock localStorage)
│   ├── blogAutosave.ts        (autoguardado temporal del editor: key, load/save/clear, AutosaveDraft)
│   ├── blogBlocks.ts          (helpers bloques: buildId, toDraft, toBlock + re-export BlockDraft; compartidos editor + BlogBlockEditor)
│   ├── embeds.ts              (detección de proveedor + URLs embed seguras)
│   ├── PortfolioContext.tsx   (Context + PortfolioContextType)
│   ├── PortfolioProvider.tsx  (Provider con readState, normalizeProjects, refresh, setBlogPosts)
│   ├── richtext.ts            (helpers JSON TipTap: doc vacío, texto plano, isRichTextEmpty)
│   ├── slug.ts                (slugify + uniqueSlug para posts/proyectos)
│   ├── usePortfolio.ts        (hook usePortfolio)
│   ├── socials.ts             (socialUrl(), socialLabel() genéricos)
│   ├── storage.ts             (loadJSON, saveJSON helpers)
│   └── platforms.ts           (PLATFORM_OPTIONS compartido)
│
├── types/
│   └── portfolio.ts           (PortfolioProfile, Photo, Project, SocialLink, etc.)
│
├── App.tsx                    (BrowserRouter → DocumentHead + MinimalTheme)
├── main.tsx                   (entry point React StrictMode)
├── router.tsx                 (rutas públicas + /admin login + catch-all 404)
└── index.css                  (Tailwind v4 + font Montserrat + gradientes de fondo)

public/
├── favicon.svg
└── icons.svg

---

# 5. Arquitectura de rutas

```
BrowserRouter
├── DocumentHead
└── MinimalTheme
    ├── ScrollToTop
    ├── Header (sticky, glass, Links, logout button cuando autenticado)
    ├── AppRouter (flex-1)
    │   ├── /                → Home (con edit controls si autenticado)
    │   ├── /proyecto/:slug  → Project
    │   ├── /sobre-mi        → AboutPage (con edit control si autenticado)
    │   ├── /blog            → BlogPage (con "Nueva publicación" si autenticado)
    │   ├── /blog/:slug      → BlogPostPage (con edit/delete si autenticado)
    │   ├── /contacto        → ContactPage (con edit control si autenticado)
    │   ├── /admin           → AdminLoginPage (standalone)
    │   └── *                → NotFound (404)
    └── Footer (fijo abajo, mt-auto, logout cuando autenticado)
```

No hay rutas admin anidadas. El sitio público ES el admin cuando hay sesión activa.

Los archivos /admin legacy (Dashboard, Profile, HeroAdmin, etc.) fueron ELIMINADOS en la limpieza de código muerto (7 modales de edición en admin/edit son los únicos archivos admin).

---

# 6. Tipos principales

src/types/portfolio.ts

- **PortfolioProfile** — información del profesional:
  - name, profession, description
  - avatar? (string URL)
  - heroImage?, heroImageMobile? (URLs)
  - heroImageFocusX?, heroImageFocusY? (0-100, focal point desktop)
  - heroImageMobileFocusX?, heroImageMobileFocusY? (0-100, focal point móvil)
  - heroPrimaryButton?, heroSecondaryButton?
  - aboutTitle, aboutDescription
  - contactTitle?, contactDescription?
  - email, location
  - socialLinks: SocialLink[]

- **SocialLink** — red social individual:
  - platform: SocialPlatform (string extensible: "instagram" | "behance" | "linkedin" | "twitter" | "youtube" | "facebook" | "vimeo" | "flickr" | string)
  - handle: string

- **Photo** — foto individual:
  - id: string (UUID, cambiará cuando se conecte Supabase)
  - url: string
  - title: string

- **Project** — proyecto con fotos:
  - id: string, slug: string
  - title, description, cover
  - photos: Photo[]

- **SiteTexts** — textos configurables de secciones:
  - workNounSingular, workNounPlural
  - featuredLabel, featuredTitle, featuredDescription
  - projectsLabel, projectsTitle, projectsDescription

- **BlogPost** — publicación del blog:
  - slug, title, excerpt, cover, coverFocusX/Y?
  - date, status ("draft" | "published")
  - blocks: BlogBlock[]

- **BlogBlock** — bloque de contenido:
  - type: "text" | "image" | "embed" | "separator"
  - text?: string (legacy texto plano)
  - content?: JSON TipTap (contenido enriquecido estructurado para bloques text)
  - url?, alt?, caption?, provider?

---

# 7. Datos actuales

src/data/portfolio.ts

Exporta `profile` (antes era `photographer`):

- profile — información personal, hero, about, contacto, socialLinks[]
- siteTexts — textos configurables de secciones + workNoun
- projects — proyectos con fotos (slug como id)
- favorites — fotos favoritas (datos existentes, no renderizan aún)
- featuredPhotos — selección destacada para el masonry del Home
- blogPosts — 3 publicaciones demo con bloques mixtos

IMPORTANTE:
- El export se renombró de `photographer` a `profile` para genericidad
- Photo.id es string (UUID) — ya no es number
- Project usa `slug` para navegación (no `id`)
- profile.socialLinks es un array SocialLink[] (no campos sueltos)

Los componentes NO deben contener textos ligados a una profesión específica.
Todo texto visible viene de los datos (profile o siteTexts).

---

# 8. Datos de administrador (localStorage)

El admin guarda datos temporalmente en localStorage antes de conectar Supabase.

Keys:
- `visora-admin-auth` — estado de autenticación mock ("true" o null)
- `visora-admin-profile` — perfil completo:
  - name, profession, description, avatar, email, location, socialLinks
  - heroImage, heroImageMobile, heroImageFocusX/Y, heroImageMobileFocusX/Y
  - heroPrimaryButton, heroSecondaryButton
  - aboutTitle, aboutDescription
  - contactTitle, contactDescription
- `visora-admin-hero` — config hero:
  - heroImage, heroImageMobile
  - heroImageFocusX/Y (0-100, default 50)
  - heroImageMobileFocusX/Y (0-100, default 50)
  - title, description
  - primaryText, primaryLink
  - secondaryText, secondaryLink
  - showSecondary (boolean)
- `visora-admin-about` — sobre mí (title, description, image?)
- `visora-admin-contact` — contacto config:
  - title, description
  - email, location
  - socialLinks: SocialLink[]
  - whatsappPhone: string (número con código de país)
  - whatsappMessage: string (mensaje predefinido)
  - formEnabled: boolean
  - formEmail: string
- `visora-admin-projects` — array de proyectos con images[], alt text, etc.
  - Importante: usa campo `images` (no `photos`) con estructura { id, url, alt }
- `visora-admin-featured` — array de slugs de proyectos destacados
- `visora-admin-texts` — siteTexts configurables (pendiente de implementar admin)
- `visora-admin-blog-posts` — array de publicaciones del blog (lectura/escritura vía PortfolioProvider + setBlogPosts)
- `visora-blog-draft` — autoguardado temporal del editor (solo en publicaciones nuevas, key separada de la lista definitiva; se borra al Guardar/Publicar/Cancelar)

Credenciales mock: `admin@visora.com` / `admin123`

---

# 9. Modelo de edición (sin "modo edición")

El sitio público ES el admin cuando hay sesión activa. No hay barra extra ni toggle.

**Flujo:**
1. Admin inicia sesión en /admin → redirige a /
2. El sitio público muestra botones de editar/agregar en cada sección
3. Los botones son visibles permanentemente mientras haya sesión
4. "Cerrar sesión" en Header (pills rojo) y Footer (pill rojo)
5. Al cerrar sesión, los botones desaparecen y el sitio queda como público

**Detección de sesión:**
- `isAuthenticated()` de `src/lib/auth.ts` lee `visora-admin-auth` de localStorage
- Header y Footer polling cada 500ms con `setInterval` para detectar cambios
- Cada página (Home, About, Contact, Blog) tiene su propio estado `admin`

**Componentes de edición:**
- `EditableSection` — wrapper con botones `[✏ Editar]` y opcionalmente `[+ Agregar]`
  - Botones siempre visibles (no hover-to-reveal)
  - posicionamiento absolute top-right
- `Modal` — responsive (bottom sheet móvil / centrado desktop), Escape, scroll lock
- `Field` — input de texto reutilizable
- `Toggle` — switch toggle
- `ImageUpload` — upload con preview
- `SocialLinksEditor` — editor de redes sociales
- `ImageCropModal` — cropper con react-easy-crop, focal point como porcentaje

**Controles por página:**

| Página | Controles |
|--------|-----------|
| Home | Hero [Editar], Destacadas [Editar], Proyectos [Editar] + [+ Nuevo proyecto] |
| About | [Editar sobre mí] |
| Contact | [Editar contacto] |
| Blog listing | [+ Nueva publicación] |
| Blog post | [✏ Editar] + [🗑 Eliminar] |

**Modales de edición (6):**
- EditHeroModal — imagen desktop + móvil + focal points + botones + toggle secundario
- EditProfileModal — nombre, profesión, descripción, avatar, redes
- EditAboutModal — título, descripción, imagen
- EditFeaturedModal — selección de proyectos con DnD
- EditProjectsModal — lista + formulario, DnD, imágenes
- EditContactModal — título, descripción, email, ubicación, redes, WhatsApp, formulario

---

# 10. Hero — Imagen dual con focal point

El Hero soporta dos imágenes: una para desktop y una para móvil (opcional).

**Componente:** src/components/Hero.tsx

- Dos `<img>` con Tailwind:
  - Desktop: `hidden md:block` con `objectPosition` del focal point desktop
  - Mobile: `md:hidden` con `objectPosition` del focal point mobile
- Si no hay imagen móvil, una sola imagen con el focal point desktop
- Focal point: `object-position: ${x}% ${y}%` (0-100, default 50% 50% = centrado)

**EditHeroModal:** src/pages/admin/edit/EditHeroModal.tsx

- Campo "Imagen de fondo (desktop)" + botón "Ajustar posición"
- Campo "Imagen de fondo (móvil) — opcional" + botón "Ajustar posición"
- Toggle mostrar/ocultar botón secundario
- Coordenadas del focal point visibles junto al botón

**ImageCropModal:** src/components/ImageCropModal.tsx

- Wrapper de react-easy-crop
- Arrastras para elegir qué parte de la imagen se ve
- Slider de zoom (1x a 3x)
- Botón "Centrar" (resetea a 50% 50%)
- Botón "Aplicar" (guarda coordenadas como porcentajes)
- Aspect ratio configurable (16/9 desktop, 9/16 mobile)

---

# 11. Fondos y estética

El tema Minimal utiliza gradientes sutiles en el body.

Light mode:
- Color base: #f7f7fa
- Gradiente radial lavanda sutil arriba-derecha (rgba(124,108,255,0.07))
- Gradiente radial melocotón abajo-izquierda (rgba(255,150,120,0.05))

Dark mode:
- Color base: #0b0a14
- Gradiente radial violeta arriba-derecha (rgba(124,108,255,0.14))
- Gradiente radial índigo abajo-izquierda (rgba(64,60,140,0.20))

Los gradientes están en index.css con background-attachment: fixed.

Estilo visual general:
- Glass sutil en header, menú móvil, botones secundarios, PhotoViewer controls, pills
- Esquinas redondeadas: rounded-3xl en portadas, rounded-2xl en imágenes/masonry, rounded-full en botones
- Tipografía: Montserrat 200–600, font-extralight para títulos grandes
- Color de acento: #7C6CFF (violeta)
- Selección de texto: rgba(124,108,255,0.25)

---

# 12. Navegación (Header)

Header sticky con glass (backdrop-blur-xl/2xl) que se intensifica al hacer scroll.

Enlaces:
- Destacadas → Link a / con state.scrollTo: "featured"
- Proyectos → Link a / con state.scrollTo: "projects"
- Sobre mí → Link a /sobre-mi
- Blog → Link a /blog
- Contacto → Link a /contacto

Los enlaces de ancla funcionan desde CUALQUIER página gracias al state.scrollTo.

Logo: nombre del perfil (Link a /), versalitas con tracking amplio.
Dark mode toggle: pill en desktop, botón en menú móvil.
Menú móvil: panel glass rounded-l-[2rem] desde la derecha.
Logout: pills rojos discretos en desktop y menú móvil cuando autenticado.

---

# 13. Componentes públicos reutilizables

- **About** (componente + página): label, aboutTitle, aboutDescription, ubicación, socialLinks
- **PhotoViewer**: visor fullscreen, teclado, click fuera, aria-labels genéricos
- **ProjectCard**: tarjeta clickeable, navega por slug, sombras, gradiente
- **BlogCard**: tarjeta con portada rounded-3xl, fecha pill glass
- **EmbedBlock**: iframe YouTube/Vimeo, tarjeta-enlace para otras redes
- **DocumentHead**: título dinámico `profile.name - profile.profession`, favicon
- **Footer**: sticky, socialLinks[], links internos, copyright, logout cuando autenticado

---

# 14. Blog

Arquitectura por bloques:
- /blog → listado de publicaciones
- /blog/:slug → artículo individual

Modelo de datos:
- BlogPost incluye `status` ("draft" | "published") y `coverFocusX/Y`
- Los bloques `text` almacenan contenido enriquecido estructurado (JSON TipTap) en `content`
- Los bloques `image` usan url, alt y caption opcional
- Los bloques `embed` usan url + caption; proveedor detectado automáticamente
- Los bloques `separator` (sin campos) → `<hr>` separador visual
- `text?` (string) se conserva como legacy para datos antiguos

Persistencia:
- `blogPosts` vive en PortfolioContext/Provider, leído de localStorage (`visora-admin-blog-posts`) con fallback a los datos demo
- `setBlogPosts` guarda y refresca el estado; los editores/saves lo usan

Tipos de bloques:
- text: editor visual TipTap (negrita, cursiva, subrayado, tachado, H1-H3, listas, cita, enlace, alineación, deshacer/rehacer)
- image: imagen con URL, alt y caption opcional
- embed: URL de redes + caption; proveedor detectado automáticamente
- separator: línea divisoria `<hr>` sin contenido (no se edita, solo se reordena/borra)

Soporte de embeds (src/lib/embeds.ts):
- YouTube → iframe seguro (youtube-nocookie.com, sin cookies)
- Vimeo → iframe seguro (player.vimeo.com)
- Instagram, Facebook, Behance, Flickr → tarjeta-enlace elegante

Los 3 posts de demo incluyen: historia con fotos, video YouTube, embeds de Instagram y Behance.

Editor de publicaciones (src/pages/admin/edit/BlogPostEditor.tsx):
- INLINE (no modal), aparece entre el encabezado del Blog y el listado cuando autenticado
- "Nueva publicación" y "Editar" (desde el listado o el detalle) → abre el editor inline
- Título obligatorio → genera slug automáticamente (colisión → variante -2, -3, ...); slug editable
- Extracto opcional, Portada (ImageUpload + focal point con ImageCropModal), Fecha, Estado (Borrador/Publicado)
- Bloques: [+ Texto] [+ Imagen] [+ Embed] [+ Separador]; reordenados por arrastrar (dnd-kit, mango + botones Subir/Bajar), edición/borrado
- Acciones: Cancelar, Vista previa, Guardar borrador, Publicar
- Lazy-loaded (React.lazy): TipTap solo se descarga cuando el admin abre el editor

Autoguardado temporal (solo para publicaciones NUEVAS, src/lib/blogAutosave.ts + BlogPostEditor):
- Key: `visora-blog-draft` (separada de la lista definitiva `visora-admin-blog-posts`)
- Helpers centralizados en src/lib/blogAutosave.ts (AutosaveDraft, loadAutosave, saveAutosave, clearAutosave, AUTOSAVE_KEY)
- Se guarda por debounce ~20s; también se vacía en `beforeunload`
- NO publica ni toca la lista definitiva: solo existe hasta Guardar/Publicar/Cancelar (que la borran)
- Indicador discreto en el header del editor: "Guardando..." (con cambios sin guardar) → "Guardado hace unos segundos"
- Recuperación (Parte 9): al volver al Blog con un autoguardado pendiente, el listado muestra el aviso
  "Se encontró una versión no guardada de esta publicación" con botones [Recuperar] [Descartar]
  - Recuperar → abre el editor como "nueva" con el borrador cargado vía prop `restoredDraft` (sin restaurar en silencio)
  - Descartar → clearAutosave()
  - Cancelar explícito en publicaciones nuevas → confirmación de descarte antes de borrar el autoguardado
- Los blob URLs de imágenes no sobreviven a un reload (limitación de la fase mock; con storage de Supabase serán URLs reales)

Guardar borrador / Publicar (Partes 10 y 11):
- Validan campos, generan/validan slug, guardan en la colección definitiva con status "draft" o "published"
- Eliminan el autoguardado, cierran el editor y muestran confirmación (toast transitorio en la página Blog)
- El editor cierra vía `onClose(result?: EditorResult)` con "saved-draft" | "published" | "discarded" | "cancelled"
- El borrador aparece en /blog para el admin con badge "BORRADOR" y NO aparece para visitantes públicos
- El post publicado aparece inmediatamente en /blog

Eliminar (Parte 14):
- Confirmación previa con confirm(); al confirmar se elimina de la persistencia y se limpia el autoguardado

Borradores:
- Los borradores NO aparecen en /blog público ni en /blog/:slug (router solo resuelve posts "published")
- El admin ve todos los posts en /blog (con badge "Borrador")
- Editar desde el detalle navega a /blog con state { editSlug }

Vista previa y renderer compartido (Parte 12):
- Un único renderer: src/components/PostBody.tsx (text/image/embed/separator) usado INDISTINTAMENTE por la
  página pública /blog/:slug y por la vista previa del editor → misma salida, sin duplicar lógica

Componentes:
- RichTextEditor.tsx (TipTap con toolbar, compartido en src/components/)
- RichTextView.tsx (renderiza JSON TipTap → elementos estilizados, sin dangerouslySetInnerHTML)
- PostBody.tsx (renderiza blogPosts / bloques; compartido entre página pública y vista previa)
- BlogPostEditor.tsx (editor inline completo, reutilizable para crear y editar)
- blog/BlogBlockEditor.tsx (tarjeta bloque sortable + formularios Texto/Imagen/Embed + preview + MiniButton; helpers de bloques en src/lib/blogBlocks.ts)

Helpers de bloques (src/lib/blogBlocks.ts):
- buildId(), toDraft(), toBlock() + re-export BlockDraft — compartidos entre BlogPostEditor y BlogBlockEditor para no duplicar la conversión draft↔bloque

Cuando autenticado:
- Blog listing muestra botón [+ Nueva publicación] y un lápiz por tarjeta para editar
- Blog post muestra botones [✏ Editar] y [🗑 Eliminar] (funcionales)

---

# 15. Filosofía de temas

Los clientes NO pueden modificar libremente el diseño. Eligen un tema:

- Minimal (actual)
- Editorial
- Cinematic
- etc.

Los datos son los mismos. El diseño cambia.
Temas más elaborados = mayor precio.

La arquitectura favorece esta separación:
- Los datos (portfolio.ts) son independientes del tema
- El tema (MinimalTheme) decide layout, colores, componentes
- Los componentes pueden reutilizarse entre temas
- SiteTexts contiene textos UI configurables por tema

---

# 16. MasonryGallery — Grid dinámico

src/components/MasonryGallery.tsx

El grid ajusta columnas y patrón de spans según la cantidad de imágenes.

**Desktop (breakpoint md+):**
| Imágenes | Columnas | Spans | Patrón |
|----------|----------|-------|--------|
| 1 | 1 | [1] | Full width |
| 2 | 2 | [2,2] | 2 bloques altos |
| 3 | 3 | [1,1,1] | Simple grid |
| 4 | 4 | [1,1,1,1] | Simple grid |
| 5 | 3 | [2,1,1,1,1] | 1 alto + 4 cortos |
| 6 | 3 | [1,1,1,1,1,1] | Simple 3x2 |
| 7 | 3 | [2,1,2,1,1,1,1] | Brick 2T+5S |
| 8 | 4 | [2,1,2,1,2,2,1,1] | Brick 4T+4S |
| 9 | 4 | [2,1,2,1,2,1,1,1,1] | Brick 3T+6S |
| 10 | 4 | [2,2,2,2,2,2,1,1,1,1] | Block 6T+4S |

**Mobile (below md):**
- Siempre 2 columnas
- Patrones brick intercalados para cada count (1-10)
- Todos verificados con 0 huecos

**Implementación:**
- CSS custom properties `--span-desktop` y `--span-mobile`
- Media queries en `<style>` inline
- Contenedor: `clamp(420px, 60vw, 720px)` de altura fija
- `grid-auto-rows: minmax(0, 1fr)`
- Límite máximo: 10 fotos (slice(0, 10))

---

# 17. Modelo de datos Supabase (futuro)

profile
- name, profession, description, avatar
- heroImage, heroImageMobile
- heroImageFocusX, heroImageFocusY
- heroImageMobileFocusX, heroImageMobileFocusY
- heroPrimaryButton, heroSecondaryButton
- showSecondary
- aboutTitle, aboutDescription, aboutImage
- contactTitle, contactDescription
- email, location
- whatsappPhone, whatsappMessage
- formEnabled, formEmail

social_links
- id, profile_id (FK), platform, handle

site_settings
- workNounSingular, workNounPlural
- featuredLabel, featuredTitle, featuredDescription
- projectsLabel, projectsTitle, projectsDescription
- theme, primaryColor, secondaryColor

projects
- id (UUID), slug, title, description, cover, position

photos
- id (UUID), project_id (FK), url, title, alt, position
- is_featured (boolean), is_favorite (boolean), is_cover (boolean)

blog_posts
- slug, title, excerpt, cover, date

blog_post_blocks
- id, post_id (FK), position (integer)
- type: text | image | embed
- payload: jsonb

Storage:
- portfolio-images (fotos de proyectos)
- blog-images (portadas e imágenes inline)

---

# 18. Pendientes conocidos

Estructura pública:
- Sección favoritas en Home (datos existen, no se renderizan)
- Vercel.json: rewrite para SPA routing — necesario antes de deploy
- SEO: metadata por página (title, description, Open Graph)
- index.html: título estático "visora" — DocumentHead lo sobreescribe

Administrador:
- Apariencia: sin implementar (selección de tema, colores)
- Conectar admin → Supabase (actualmente todo en localStorage)

Técnicos:
- Blog con oEmbed completo para Instagram/Facebook
- Dark mode flash en carga
- Photo.id ya es string — listo para UUID de Supabase
- Focal points del hero: crop inicia siempre en centro (no restaura posición previa al reabrir crop modal)

---

# 19. Principio de desarrollo

Preferir:
1. crear archivo
2. copiar contenido completo
3. comprobar compilación
4. continuar

No asumir interfaces de componentes existentes: revisar el código actual antes de cambiar.

El usuario utiliza un agente IA para acelerar el desarrollo, por lo que el código debe mantenerse estructurado y claro.

IMPORTANTE: Ejecutar npm run build y npm run lint después de cada cambio significativo.

---

# 20. Estado de negocio

La idea es vender portfolios con pago único, infraestructura separada por cliente, varios temas a diferentes precios.

No se busca construir un SaaS masivo inicialmente.
Se busca crear sitios profesionales que puedan venderse individualmente de forma rápida.

---

# 21. Próximo objetivo técnico

ESTADO: Sitio público + inline editing completado. 6 modales de edición funcionales. Hero con imagen dual + crop. Blog con editor inline de publicaciones (TipTap, borradores/borrador, bloques, portada con focal point).

PRÓXIMO PASO: Conectar Supabase (lectura de datos, storage de imágenes, autenticación real).

Después:
1. Conectar Supabase (lectura de datos)
2. Storage (subida de imágenes)
3. Autenticación real (reemplazar mock)
4. Editor de blog — IMPLEMENTADO (pendiente persistencia Supabase)
5. Selección de tema / Apariencia
6. Deployment en Vercel
7. Dominios personalizados
