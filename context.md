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
- browser-image-compression (compresión/redimensión/orientación EXIF en subida, vía src/lib/image.ts)
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
│   ├── FaviconPicker.tsx       (selector de favicon: 10 presets SVG + subida redimensionada a 64×64)
│   ├── Footer.tsx             (sticky, consume usePortfolio, botón logout cuando autenticado)
│   ├── Header.tsx             (sticky, glass, consume usePortfolio, botón logout cuando autenticado)
│   ├── Hero.tsx               (imagen fondo dual desktop/móvil, object-position, consume usePortfolio)
│   ├── ImageCropModal.tsx     (cropper react-easy-crop, focal point como porcentaje)
│   ├── ImageProcessingIndicator.tsx (feedback de subida: original → final, error, spinners)
│   ├── ImageUpload.tsx        (upload con preview, cambiar/eliminar, drag & drop, processImage)
│   ├── MasonryGallery.tsx     (grid masonry dinámico, columnas por count)
│   ├── Modal.tsx              (reutilizable, responsive, Escape, scroll lock)
│   ├── PhotoViewer.tsx        (visor fullscreen, click fuera, SVGs)
│   ├── PostBody.tsx           (renderiza bloques del blog; compartido público + vista previa)
│   ├── ProjectCard.tsx        (tarjeta de proyecto, navega por slug)
│   ├── RichTextEditor.tsx     (TipTap con toolbar: H1-3, negrita, listas, cita, enlace, alineación, deshacer/rehacer)
│   ├── RichTextView.tsx       (renderiza JSON TipTap → elementos estilizados)
│   ├── ScrollToTop.tsx        (scroll a top en cambio de ruta)
│   ├── SiteGate.tsx           (pantalla "Sitio en construcción" compartida por todos los temas)
│   ├── CookieBanner.tsx       (banner de aviso de cookies para visitantes, usa settings.privacy.cookieNotice)
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
│   ├── Contact.tsx            (página /contacto, 3 botones: Instagram/WhatsApp/Email, edit control cuando autenticado)
│   ├── Home.tsx               (Hero + Featured + Projects con edit controls)
│   ├── NotFound.tsx           (404 reutilizable con título configurable)
│   ├── Project.tsx            (página /proyecto/:slug)
│   └── admin/
│       ├── Settings.tsx        (página /configuracion, categorías: General/SEO/Apariencia/Privacidad/Publicación, solo admin)
│       └── edit/
│           ├── EditableSection.tsx    (wrapper con botones [Editar] / [+ Agregar])
│           ├── EditHeroModal.tsx      (imagen desktop + móvil + focal points + botones)
│           ├── EditProfileModal.tsx   (nombre, profesión, descripción, avatar, redes)
│           ├── EditAboutModal.tsx     (título, descripción, imagen)
│           ├── EditFeaturedModal.tsx   (selección proyectos con DnD)
│           ├── EditProjectsModal.tsx   (lista + form, DnD, imágenes)
│           ├── EditContactModal.tsx    (contacto, WhatsApp, redes sociales)
│           └── BlogPostEditor.tsx      (editor inline de publicaciones con bloques y TipTap)
│
├── themes/
│   ├── index.ts             (registro: THEME_OPTIONS + THEMES {minimal, editorial}, themeFor/themeOptionFor)
│   ├── types.ts             (HeaderProps, ProjectPageProps, BlogPostPageProps, NotFoundProps, ThemePages, ThemeDefinition, ThemeOption)
│   ├── ThemeShell.tsx       (shell compartido: useThemeShell + Header/Footer del tema + AppRouter(pages) + CookieBanner + SiteGate)
│   ├── minimal/             (tema minimal = componentes y páginas compartidos de src/components y src/pages)
│   └── editorial/
│       ├── EditorialHeader.tsx   (masthead revista: marca serif, nav uppercase, reglas, dark toggle, sesión admin)
│       ├── EditorialFooter.tsx   (footer editorial: masthead, columnas, redes, logout)
│       └── pages/
│           ├── EditorialHome.tsx       (portada/cover, destacadas numeradas, índice de proyectos)
│           ├── EditorialProject.tsx    (cabecera numerada + galería editorial + visor)
│           ├── EditorialAbout.tsx      (statement + ficha con avatar/ubicación/redes)
│           ├── EditorialBlog.tsx       (índice de publicaciones tipo magacín + autoguardado + editor)
│           ├── EditorialBlogPost.tsx   (artículo de revista con portada y PostBody)
│           ├── EditorialContact.tsx    (canales de contacto como columnas numeradas)
│           └── EditorialNotFound.tsx   (404 editorial)
│
├── data/
│   ├── portfolio.ts           (datos demo: profile, projects, blogPosts, siteTexts)
│   └── settings.ts            (defaultSettings: SiteSettings por defecto)
│
├── lib/
│   ├── auth.ts                (login, logout, isAuthenticated — mock localStorage)
│   ├── blogAutosave.ts        (autoguardado temporal del editor: key, load/save/clear, AutosaveDraft)
│   ├── blogBlocks.ts          (helpers bloques: buildId, toDraft, toBlock + re-export BlockDraft; compartidos editor + BlogBlockEditor)
│   ├── embeds.ts              (detección de proveedor + URLs embed seguras)
│   ├── favicons.ts            (10 presets SVG de favicon por profesión + svgToDataUrl, presetDataUrl, fileToFaviconDataUrl)
│   ├── image.ts               (pipeline central: processImage/processImages, variantes 640/1600/2400, validateImage, formatBytes, releaseObjectURL)
│   ├── useImageDrop.ts        (hook drag & drop de imágenes: useImageDrop -> { isDragging, dragProps })
│   ├── appearance.ts          (presets de apariencia: 6 acentos, colores de fondo, radio, botones, 6 fuentes + loadGoogleFont)
│   ├── PortfolioContext.tsx   (Context + PortfolioContextType)
│   ├── PortfolioProvider.tsx  (Provider con readState, normalizeProjects, refresh, setBlogPosts)
│   ├── richtext.ts            (helpers JSON TipTap: doc vacío, texto plano, isRichTextEmpty)
│   ├── slug.ts                (slugify + uniqueSlug para posts/proyectos)
│   ├── usePortfolio.ts        (hook usePortfolio)
│   ├── useAdmin.ts            (hook sesión admin: polling isAuthenticated cada 500ms)
│   ├── usePhotoViewer.ts      (hook visor: openViewer/closeViewer/prev/next sobre array Photo)
│   ├── useBlogList.ts         (hook listado/blog completo: editor inline lazy, autoguardado, toasts)
│   ├── useThemeShell.ts       (hook compartido de todos los temas: dark mode, CSS vars de apariencia, data-theme, polling admin, publicLocked)
│   ├── socials.ts             (socialUrl(), socialLabel(), nonEmptySocials() genéricos)
│   ├── storage.ts             (loadJSON, saveJSON helpers)
│   ├── platforms.ts           (PLATFORM_OPTIONS compartido)
│   └── watermark.ts           (marca de agua: loadImageWithCors + applyWatermark, quema el nombre en la imagen del visor)
│
├── types/
│   └── portfolio.ts           (PortfolioProfile, Photo, Project, SocialLink, etc.)
│
├── App.tsx                    (BrowserRouter → DocumentHead + ThemeSwitcher por settings.appearance.theme)
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
└── ThemeShell (minimal | editorial según settings.appearance.theme)
    ├── ScrollToTop
    ├── Header del tema (minimal: glass/Links · editorial: masthead revista)
    ├── AppRouter({ pages }) — páginas del tema activo (flex-1)
    │   ├── /                → Home (con edit controls si autenticado)
    │   ├── /proyecto/:slug  → Project (wrapper resuelve slug, pasa prop project)
    │   ├── /sobre-mi        → AboutPage (con edit control si autenticado)
    │   ├── /blog            → BlogPage (con "Nueva publicación" si autenticado)
    │   ├── /blog/:slug      → BlogPost (wrapper resuelve slug publicado, pasa post + onEdit/onDelete)
    │   ├── /contacto        → ContactPage (con edit control si autenticado)
    │   ├── /admin           → AdminLoginPage (standalone)
    │   ├── /configuracion   → SettingsPage (solo admin; redirige a /admin si no hay sesión)
    │   └── *                → NotFound (404)
    └── Footer del tema (fijo abajo, mt-auto, logout cuando autenticado)
```

Cada tema define su propio `pages` (ThemePages) para todas las rutas públicas. La lógica
de datos/admin está compartida: las páginas del tema consumen `usePortfolio`, `useAdmin`,
`usePhotoViewer`, `useBlogList` y los modales de edición reutilizables. El router
(`src/router.tsx`) recibe `pages` como prop; los wrappers `ProjectRoute`/`BlogPostRoute`
resuelven el slug y pasan las props tipadas a la página del tema.

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
- `visora-admin-about` — sobre mí (title, description, image?, focusX?, focusY?); la imagen también se persiste como `aboutImage` (más `aboutImageFocusX/Y`) en `visora-admin-profile` (fuente única vía `usePortfolio`)
- `visora-admin-contact` — contacto config:
  - title, description
  - email, emailSubject (asunto del mailto)
  - location
  - whatsappPhone: string (formato `+569` + 8 números, prefijo `+56 9` fijo en el form)
  - whatsappMessage: string (mensaje predefinido, máx 100 caracteres)
  - Las redes sociales ya NO viven aquí; se editan vía `settings.socials` en el form "Editar contacto"
- `visora-admin-projects` — array de proyectos con images[], alt text, etc.
  - Importante: usa campo `images` (no `photos`) con estructura { id, url, alt }
- `visora-admin-featured` — array de slugs de proyectos destacados
- `visora-admin-texts` — siteTexts configurables (pendiente de implementar admin)
- `visora-admin-blog-posts` — array de publicaciones del blog (lectura/escritura vía PortfolioProvider + setBlogPosts)
- `visora-admin-settings` — configuración global del sitio (SiteSettings): general, seo, appearance, socials, privacy, site
  - lectura en PortfolioProvider (merge con defaultSettings), escritura vía `setSettings`
  - `general`: brandName (nombre del profesional/marca), profession, language, favicon
    - `siteName` fue ELIMINADO (era redundante con brandName)
    - `language` = idioma del sitio: se aplica al atributo `lang` del `<html>` (accesibilidad/SEO), NO es charset
    - `favicon` = data URL (icono de ejemplo SVG con acento, o PNG 64×64 subido y redimensionado); si está vacío se usa /favicon.svg (la "V" de Visora, color adaptativo claro/oscuro)
    - `siteUrl` fue ELIMINADO: la URL se configura en Vercel; el canonical se deriva automáticamente de window.location (no se emite en localhost)
  - Favicon (FaviconPicker): 10 presets SVG (inicial "V" como primera/por defecto, cámara, pincel, lápiz, objetivo, paleta, cámara de video, arquitectura, diseño web, moda) + subida de imagen redimensionada a 64×64 (src/lib/favicons.ts)
  - `seo`: title, description, ogImage, noindex
  - `appearance`: theme, mode, primaryColor, background (color1/color2 → degradado del fondo), borderRadius, buttonStyle, fontFamily
    - theme: "minimal" | "editorial" — el "Diseño" del sitio (ver sección 15); independiente del modo claro/oscuro y de los colores. `data-theme` en `<html>`, registro en src/themes/index.ts, shell compartida vía src/lib/useThemeShell.ts
    - mode: system | light | dark — se aplica al instante (sin recargar); system sigue a prefers-color-scheme en tiempo real; el toggle del header cambia la config en modos explícitos o un override en system
    - primaryColor: 6 presets (Violeta/Azul/Esmeralda/Ámbar/Rosa/Grafito) en lugar de color picker libre; se propaga a TODO el sitio vía `--visora-accent` (accent presets en src/lib/appearance.ts)
    - background: color base (clara u oscura) + acento del fondo → degradado del body; presets pre-hechos en `src/lib/appearance.ts` (Medianoche·violeta, Negro·azul, Grafito·verde azulado, etc.); elegir un preset oscuro activa el modo oscuro automáticamente para que el texto sea legible; en dark mode el degradado se atenúa con color-mix
    - borderRadius (sm/md/lg) → escala `--visora-radius-scale` que multiplica TODOS los `rounded-sm..3xl` del sitio (Tailwind v4 `@theme`); `rounded-full` (píldoras) no se escala
    - buttonStyle (pill/rounded/square) → `--visora-btn-radius` (pill 9999px, rounded 0.75rem, square 0px) aplicado a los CTAs principales
    - fontFamily: dropdown con 6 Google Fonts (Montserrat, Inter, Poppins, Space Grotesk, Playfair Display, Lora); se carga dinámicamente y aplica `--visora-font` (src/lib/appearance.ts)
  - `socials`: SocialLink[] (fuente única de redes, editada en el form "Editar contacto")
  - `privacy`: showEmail, showLocation, protectImages, notice, cookieNotice, watermarkEnabled, watermarkStyle ("tiling" | "corner"), watermarkOpacity (0.05–0.35), watermarkText
    - Marca de agua (`watermark*`): cuando `watermarkEnabled`, el PhotoViewer quema la imagen ampliada con el texto de `watermarkText` vía canvas (src/lib/watermark.ts); si `watermarkText` está vacío usa el nombre del profesional (brandName). Estilo `tiling` = texto repetido en diagonal, `corner` = texto discreto en la esquina inferior derecha. Opacidad configurable. La imagen mostrada en el visor ES la versión marcada, así que cualquier captura/descarga desde ahí lleva la marca. `loadImageWithCors` distingue URLs locales (`data:`/`blob:`, sin CORS ni params) de remotas (`http(s)` con CORS + `?auto=format&w=2400`). LIMITACIÓN pre-Supabase: los `settings` viven en localStorage por navegador y `watermarkEnabled` por defecto es `false`, así que el admin ve la marca en SU navegador pero un visitante en incógnito/otro navegador tiene su propio localStorage vacío → no la ve. Se resolverá al conectar Supabase (settings + imágenes compartidos).
  - `site`: published (si false, solo el admin ve el sitio; los visitantes ven "Sitio en construcción")
- `visora-cookies-accepted` — aceptación del aviso de cookies ("accepted"/"rejected", evita el banner)
- `visora-blog-draft` — autoguardado temporal del editor (solo en publicaciones nuevas, key separada de la lista definitiva; se borra al Guardar/Publicar/Cancelar)

Credenciales mock: `admin@visora.com` / `admin123`

---

# 8b. Sistema de imágenes (procesamiento centralizado)

Toda subida de imágenes pasa por un pipeline único en **`src/lib/image.ts`**, que usa `browser-image-compression` para corregir orientación EXIF, redimensionar, comprimir y convertir a WebP.

**`processImage(file, opts?)`** — flujo:
1. `validateImage(file, maxSizeMB=90)` — valida MIME (`image/jpeg|png|webp|gif|avif|bmp|tiff|svg+xml`), tamaño (mín > 0, máx 90 MB).
2. Redimensiona + comprime con `browser-image-compression` (`useWebWorker: true`, calidad 0.82, maxWidthOrHeight 2400).
3. Convierte a WebP vía canvas (`toDataURL("image/webp", 0.82)`), con fallback a JPEG si el navegador no lo soporta.
4. Genera las **3 variantes** en paralelo:
   - `thumb` → 640 px
   - `preview` → 1600 px
   - `full` → 2400 px

Devuelve un `ImageProcessResult` con:
- `url` — variante principal optimizada (data URL WebP) — la que se persiste en el estado/localStorage
- `originalSize` / `finalSize` — para el feedback "Original → Final"
- `width` / `height`
- `variants` — `ImageVariant[]` (los 3 blobs, listos para subir a Supabase Storage en el futuro)

Helpers exportados:
- `processImages(files)` — procesa varios archivos en paralelo (conserva el orden)
- `formatBytes(n)` — tamaño legible humano
- `releaseObjectURL(url)` — libera ObjectURLs de forma segura (no-op si no es `blob:`)
- `validateImage(file, maxSizeMB?)`, `isSupportedImage(file)`, `isBlobUrl`, `isDataUrl`
- `VARIANT_SIZES` = `{ thumb: 640, preview: 1600, full: 2400 }`
- `resizeUrl(url, width, quality?)` — añade `?auto=format&w=N&q=Q` SOLO a URLs remotas http(s); devuelve intactas las URLs `data:`/`blob:`. Sustituye a concatenar los parámetros CDN a mano (que rompía las URLs data/blob → imagenes en blanco). Lo usan Project, MasonryGallery, ProjectCard, BlogCard, BlogPost, PostBody, PhotoViewer y watermark.

**Drag & drop**: `src/lib/useImageDrop.ts` exporta `useImageDrop(onFiles)` → `{ isDragging, dragProps }` para hacer zonas de soltar imágenes desde el explorador (no requiere abrir una carpeta).

**Feedback de subida**: `src/components/ImageProcessingIndicator.tsx` muestra "Optimizando…" (spinner), error, o "Original: X → Final: Y".

**Puntos donde se aplica el procesamiento** (ninguna subida lo evita):
- `ImageUpload.tsx` — componente compartido (hero desktop/móvil, about, portada blog, bloques imagen del blog). Soporta drag & drop + procesamiento al subir.
- `EditProfileModal.tsx` — avatar.
- `EditProjectsModal.tsx` — galería + portadas con **compresión al guardar** (ver nota abajo).

**Compresión al guardar en proyectos (flujo del álbum)**:
1. Se seleccionan/arrastran las fotos (se muestran al instante como preview con ObjectURL; NO se comprimen todavía).
2. Al pulsar "Guardar proyecto" se comprimen TODAS las imágenes nuevas (con barra de progreso "Comprimiendo y guardando imágenes…" y contador N/total).
3. Se persisten las variantes optimizadas (data URL WebP) en localStorage y aparecen en el álbum.
4. Al arrastrar una carpeta completa se procesan en paralelo y, si no hay portada definida, **la primera imagen subida se toma como portada por defecto**.
5. Las imágenes ya existentes (sin archivo nuevo) se conservan tal cual.

> Nota fase actual: en esta fase pre-Supabase, las subidas se persisten como data URL WebP de la variante principal en localStorage (los `blob:` URLs no sobreviven recarga). Cuando se conecte Supabase Storage, `ImageProcessResult.variants` (los 3 blobs) se subirán a los buckets y se guardarán las URLs CDN, que es lo que los componentes de consumo ya esperan (con `?auto=format&w=N&q=85`).

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
- EditContactModal — título, descripción, email + asunto, WhatsApp (prefijo `+56 9` + 8 números, mensaje ≤100) y redes sociales (settings.socials)

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
- Modo export opcional: si se pasan `exportSize` + `onExport`, al aplicar genera la imagen recortada redimensionada a ese tamaño como data URL JPEG (via canvas) en lugar de solo el focal point — usado por la ogImage del SEO (1200×630). `onSave` es opcional.

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
- **PhotoViewer**: visor fullscreen, teclado, click fuera, aria-labels genéricos; si está activa la marca de agua (settings.privacy.watermarkEnabled) muestra la imagen con la marca quemada vía canvas (src/lib/watermark.ts)
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

## 15b. Sistema de temas (implementado)

**"Diseño" (theme) vs "Modo claro/oscuro" (mode)**: son independientes (ver Apariencia). El selector "Modo de tema" se renombró a "Modo claro/oscuro"; nuevo selector **"Diseño"** arriba en Apariencia elige el tema gráfico. Ambos se persisten en `visora-admin-settings`.

**Registro** — `src/themes/index.ts`:
- `ThemeId` en `src/types/portfolio.ts`: `"minimal" | "editorial"`.
- `ThemeDefinition` y `ThemePages` en `src/themes/types.ts`: cada tema define su propio `Header`, `Footer` y `pages` (Home, ProjectPage, AboutPage, BlogPage, BlogPostPage, ContactPage, NotFound).
- `THEME_OPTIONS` (para el selector en Apariencia: id, label, descripción, swatches) + `THEMES` (mapa estático id → `ThemeDefinition`, con `minimal` como fallback). `themeOptionFor(id)` / `themeFor(id)`.
- `appearance.theme` en `data/settings.ts` (default `"minimal"`); el merge de PortfolioProvider rellena `theme` con el default si el localStorage previo no lo tiene.
- **Tema minimal**: reutiliza el scaffold compartido (`components/Header` + `components/Footer`) y las páginas compartidas (`src/pages/Home`, `Project`, `About`, `Blog`, `BlogPost`, `Contact`, `NotFound`). Cero duplicación.
- **Tema editorial**: tiene su propio `EditorialHeader` (masthead), `EditorialFooter` y sus propias páginas bajo `src/themes/editorial/pages/` para un rediseño visual completo (revista).

**Shell compartida** — `src/lib/useThemeShell.ts` + `src/themes/ThemeShell.tsx`:
- `useThemeShell()` encapsula la lógica común de TODOS los temas: dark mode (override manual + sistema en tiempo real), aplicación de CSS vars de apariencia (acento, fondo claro/oscuro, tipografía/radio/botones con loadGoogleFont), `data-theme` en `<html>` (y carga de Playfair Display cuando el tema es editorial), polling de sesión admin (500ms) y `publicLocked` (sitio no publicado + visitante).
- Devuelve `{ theme, effectiveDark, admin, publicLocked, onToggleDarkMode }`.
- `ThemeShell` (src/themes/ThemeShell.tsx) compone el scaffold: ScrollToTop + `theme.Header` + `AppRouter({ pages })` + `theme.Footer` + CookieBanner, y `SiteGate` cuando `publicLocked`. Aplica `data-theme={theme.id}` en el wrapper raíz.

**Páginas del tema**:
- Las páginas del tema consumen la lógica admin compartida: `usePortfolio`, `useAdmin` (polling de sesión), `usePhotoViewer` (open/close/prev/next sobre un array Photo), `useBlogList` (estado completo del listado/blog: editor inline lazy `BlogPostEditor`, autoguardado recuperable, toasts) y los modales de edición (`EditHeroModal`, `EditFeaturedModal`, `EditProjectsModal`, `EditAboutModal`, `EditContactModal`) + `EditableSection` para los botones [✏ Editar].
- El look del tema se define con tokens CSS scoped en `src/index.css` bajo `[data-theme="editorial"]` (display serif en h1-h3, reglas finas en headers/bordes, `--visora-font-display`, esquinas más rectas, fondo de papel uniforme en light/dark). La apariencia (acento, fondo, font de cuerpo, radio, botones) se respeta por completo encima del tema.

**Gate compartido** — `src/components/SiteGate.tsx`: pantalla "Sitio en construcción" reutilizable, usada por todos los temas.

**App.tsx**: `ThemeSwitcher` interno (dentro del Provider) lee `settings.appearance.theme`, hace lookup en `THEMES` y renderiza `<ThemeShell theme={...} />` (lookup de mapa estático, no creado "in render" — requisito del lint react-hooks).

**Editorial (v2 — rediseño visual completo)**: ahora sí es un tema propio, no solo tokens:
- Header masthead de revista: marca serif capitular, nav uppercase con separadores, regla con `border-top`, toggle claro/oscuro y sesión admin; menú móvil fullscreen.
- Portada (cover) en la Home: mancheta con profesión, `brand` serif grande uppercase, regla doble, CTAs, imagen desktop/móvil con focal points y pie de foto (masthead figure).
- Destacadas: grid de fotos sin huecos (gap-px) con numeración editorial `01..08`.
- Proyectos: **índice numerado** con filas 01/02/…, portada flotante al hacer hover y conteo de obras.
- Blog: **índice tipo magacín** (fecha + título serif + extracto + portada en la columna derecha), aviso de autoguardado, toasts y editor inline lazy compartido.
- Artículo de blog: cabecera de revista con fecha/kicker, título serif grande, extracto como lead; portada; PostBody.
- Contacto: canales (Instagram/WhatsApp/Email) como **columnas numeradas 01/02/03** con "Ir →".
- 404 editorial con `404` serif gigante y reglas.
- El tema carga Playfair Display (Google Fonts) dinámicamente y el fondo pasa a ser papel uniforme (`#f6f2e9` / `#0e0c1a`) en lugar de degradados.

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

Modelo **mono-tenant por cliente**: cada cliente tiene su propio proyecto Supabase (tablas + storage) y su propia DB. Un único perfil por proyecto. La autenticación real (reemplaza el mock de `localStorage`) usa Supabase Auth.

## Tabla `profiles` (datos del profesional + config hero / about / contacto)

- `id` UUID PK — coincide con `auth.users.id` (el admin dueño del sitio)
- `name` text — nombre del profesional/marca (fuente única con `site_settings.general.brandName`)
- `profession` text
- `description` text
- `avatar` text — URL CDN del avatar
- `hero_image` text — URL CDN
- `hero_image_mobile` text (nullable)
- `hero_image_focus_x` int2 (0–100, default 50)
- `hero_image_focus_y` int2 (0–100, default 50)
- `hero_image_mobile_focus_x` int2 (0–100, default 50)
- `hero_image_mobile_focus_y` int2 (0–100, default 50)
- `hero_primary_button` text
- `hero_secondary_button` text
- `about_title` text
- `about_description` text
- `about_image` text (nullable) — retrato opcional; se sube vía "Editar sobre mí" y se renderiza en público (minimal: retrato con marco en el grid; editorial: retrato en la ficha lateral). Fallback al `avatar` si no hay imagen propia. Almacenado en `Profile.aboutImage` (localStorage `visora-admin-about.image` + `visora-admin-profile.aboutImage`)
- `about_image_focus_x` int2 (0–100, default 50), `about_image_focus_y` int2 (0–100, default 50) — focal point del retrato (GUI: botón "Ajustar posición" en "Editar sobre mí"); si en su lugar el usuario usa "Recortar (retrato 4:5)", el crop se exporta a 800×1000 JPEG y el foco se resetea a 50/50
- `contact_title` text (nullable)
- `contact_description` text (nullable)
- `email` text
- `location` text
- `created_at` timestamptz default now()
- `updated_at` timestamptz

## Tabla `social_links` (redes sociales del perfil)

- `id` UUID PK
- `profile_id` UUID FK → `profiles.id`
- `platform` text — "instagram" | "behance" | "linkedin" | "twitter" | "youtube" | "facebook" | "vimeo" | "flickr" (extensible)
- `handle` text
- `position` int2 (orden de visualización)
- UNIQUE (`profile_id`, `platform`) o UNIQUE (`profile_id`, `position`)

## Tabla `site_settings` (configuración global del sitio — una fila por perfil)

- `id` UUID PK (o `profile_id` como PK)
- `profile_id` UUID FK → `profiles.id`
- `brand_name` text — fuente única del nombre de marca
- `language` text (idioma del sitio, aplica al `<html lang>`; NO es charset)
- `favicon` text (nullable) — data URL de preset SVG o PNG 64×64
- **SEO**: `seo_title`, `seo_description`, `seo_og_image` text, `seo_noindex` bool
- **Apariencia**:
  - `appearance_mode` text — "system" | "light" | "dark"
  - `appearance_primary_color` text — 1 de 6 presets (Violeta/Azul/Esmeralda/Ámbar/Rosa/Grafito)
  - `appearance_bg_color1` text, `appearance_bg_color2` text — degradado del fondo
  - `appearance_font_family` text — 1 de 6 Google Fonts
  - `appearance_border_radius` text — "sm" | "md" | "lg"
  - `appearance_button_style` text — "pill" | "rounded" | "square"
- **Privacidad**:
  - `privacy_show_email` bool (default true)
  - `privacy_show_location` bool (default true)
  - `privacy_notice` text
  - `privacy_protect_images` bool
  - `privacy_cookie_notice` text
  - `privacy_watermark_enabled` bool (default false)
  - `privacy_watermark_style` text — "tiling" | "corner"
  - `privacy_watermark_opacity` float (0.05–0.35, default 0.18)
  - `privacy_watermark_text` text (si vacío usa `brand_name`)
- **Publicación**: `site_published` bool (default true)
- `created_at`, `updated_at` timestamptz

> Nota: las redes sociales NO viven en `site_settings`; se leen en `social_links` (con `brandName`/`profession` unificados en `profiles`+`site_settings`).

## Tabla `site_texts` (textos configurables de secciones) — una fila por perfil

- `profile_id` UUID PK/FK → `profiles.id`
- `work_noun_singular`, `work_noun_plural` text
- `featured_label`, `featured_title`, `featured_description` text
- `projects_label`, `projects_title`, `projects_description` text

## Tabla `projects` (álbumes)

- `id` UUID PK
- `profile_id` UUID FK → `profiles.id`
- `slug` text UNIQUE
- `title` text
- `description` text
- `cover` text — URL CDN (la imagen de portada; puede ser la 1ª subida si no se define)
- `position` int2 (orden del listado / drag & drop)
- `created_at`, `updated_at` timestamptz

## Tabla `project_photos` (fotos dentro de un álbum)

- `id` UUID PK
- `project_id` UUID FK → `projects.id` (ON DELETE CASCADE)
- `url` text (URL CDN) y, opcionalmente, las variantes por bucket en lugar de URL única:
  - `url_thumb` text (640px), `url_preview` text (1600px), `url_full` text (2400px) — variantes generadas por `processImage`
- `alt` text (descripción opcional de la foto, vacía por defecto; sustituye al antiguo `title` igual a nombre de archivo)
- `position` int2 (orden del drag & drop en el álbum)
- `is_cover` bool — marca cuál es la portada (alternativa a `projects.cover`)
- `is_featured` bool — seleccionada para las "Destacadas" del Home
- `is_favorite` bool (datos existentes, aún sin UI)
- `created_at` timestamptz

> La lista `featuredPhotos` de la Home se compone de proyectos/álbumes "destacados" (slugs en `visora-admin-featured`). Puede expresarse como `projects.is_featured` (bool) o una tabla de relación de orden.

## Tabla `blog_posts`

- `id` UUID PK
- `profile_id` UUID FK → `profiles.id`
- `slug` text UNIQUE
- `title` text
- `excerpt` text (nullable)
- `cover` text (URL CDN) + `cover_focus_x`, `cover_focus_y` int2 (0–100)
- `date` timestamptz
- `status` text — "draft" | "published"
- `position` int2 (orden en /blog)
- `created_at`, `updated_at` timestamptz

## Tabla `blog_post_blocks` (bloques de contenido enriquecido)

- `id` UUID PK
- `post_id` UUID FK → `blog_posts.id` (ON DELETE CASCADE)
- `position` int2 (orden de bloques)
- `type` text — "text" | "image" | "embed" | "separator"
- `content` jsonb (nullable) — JSON TipTap para bloques `text`
- `text` text (nullable) — legacy texto plano
- `url` text (nullable) — imagen o embed
- `alt` text (nullable) — descripción de imagen
- `caption` text (nullable)
- `provider` text (nullable) — "youtube" | "vimeo" | "instagram" | "facebook" | "behance" | "flickr" (detectado automáticamente)

## Storage buckets (Supabase Storage)

Clientes y carpetas (paths) sugeridos por tipo de contenido:

**Bucket `portfolio-images`** — fotos de proyectos, avatar, hero y about:
- `portfolio-images/avatars/*` — avatar del perfil
- `portfolio-images/hero/*` — hero desktop/móvil
- `portfolio-images/about/*` — imagen "sobre mí"
- `portfolio-images/projects/{project_id}/*.webp` — fotos de álbumes (3 variantes por foto: `_thumb` 640 / `_preview` 1600 / `_full` 2400)

**Bucket `blog-images`** — portadas e imágenes inline del blog:
- `blog-images/covers/{post_id}/*.webp`
- `blog-images/inline/{post_id}/*.webp`

Las URLs guardadas en BD son las URLs CDN públicas de estos objetos; los componentes ya esperan el formato `?auto=format&w=N&q=85` (via `resizeUrl`).

## Seguridad / RLS

- Todos los `SELECT` públicos: permitidos (el sitio es público salvo `site_published=false`).
- Insert/Update/Delete: solo el admin autenticado (ROL `authenticated` con `uid() = profile_id`, o `owner` RLS por id de perfil).
- Storage: políticas de lectura pública; escritura solo para el owner.
- Imágenes subidas que requieran CORS en el bucket para que la marca de agua funcionen en remoto (`crossOrigin="anonymous"`).

---

# 18. Pendientes conocidos

Estructura pública:
- Sección favoritas en Home (datos existen, no se renderizan)
- Vercel.json: rewrite para SPA routing + header X-Robots-Tag (`index, follow`) — IMPLEMENTADO (vercel.json)
- SEO: metadata por página (title, description, Open Graph) — DocumentHead aplica el SEO base global desde Configuración; falta metadata por página (sobre-mi, blog, etc.)
- index.html: título estático "visora" — DocumentHead lo sobreescribe

Administrador:
- Configuración global (/configuracion) — IMPLEMENTADO: categorías General/SEO/Apariencia/Privacidad/Publicación (la categoría "Redes" fue ELIMINADA: las redes se editan solo en el form "Editar contacto" de /contacto via `settings.socials`; las categorías "Sitio/Mantenimiento" y "Dominio" fueron ELIMINADAS: se configuran en Vercel, no en la app)
  - General: brandName, profession, language, favicon (brand/profession como fuente única); favicon con 10 presets SVG (inicial "V" por defecto, cámara, pincel, lápiz, objetivo, paleta, cámara de video, arquitectura, diseño web, moda) o subida (redimensionada a 64×64)
  - Contacto: botones con iconos — "Envíame un mensaje" (Instagram, principal, abre el perfil), "Escríbeme por WhatsApp" (wa.me con mensaje) y "Escríbeme un correo" (mailto con asunto predefinido)
  - Apariencia: selector "Diseño" (tema gráfico, independiente) + "Modo claro/oscuro" + 6 colores de acento + degradado de fondo (2 colores) + tipografía/radio/botones. Se propaga a TODO el sitio en real (sin recargar) vía CSS vars: `--visora-accent`, `--visora-bg-1/2`, `--visora-font`, `--visora-radius-scale`, `--visora-btn-radius`. El color de acento reemplaza los `#7C6CFF` hardcodeados de todos los componentes. Vista previa en la propia página (botones + tipografía + fondo). Presets en `src/lib/appearance.ts`. El dark/flash es instantáneo y "seguir al sistema" responde en tiempo real (`useThemeShell`).
  - SEO: title + meta description + ogImage (recortada a 1200×630 vía `ImageCropModal` con modo export, guardada como data URL JPEG) + toggle noindex. `DocumentHead` emite `canonical` (derivado de la URL real, omitido en localhost) y `meta robots`: `index, follow` por defecto, o `noindex, nofollow` si noindex está activo. El `X-Robots-Tag` (header HTTP) se configura en `vercel.json`. `meta keywords` y `rel=precursor`/`publisher` no se implementan (obsoletos).
  - Privacidad: showEmail/showLocation/protectImages + notice + cookieNotice (banner de cookies `CookieBanner` para visitantes) + marca de agua en el visor (watermarkEnabled/style/opacity, ver sección 8)
  - Publicación: published (la web SIEMPRE inicia publicado: default true + migración de versión de settings a v2 que fuerza published=true en datos existentes; solo si el usuario lo desactiva explícitamente los visitantes ven "Sitio en construcción", únicamente el admin ve el sitio)
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
5. Selección de tema / Apariencia — Configuración de Apariencia IMPLEMENTADA (modo claro/oscuro instantáneo, 6 acentos, degradado de fondo, radio, botones, 6 fuentes Google); SISTEMA DE TEMAS IMPLEMENTADO (selector "Diseño", Minimal + Editorial, registro THEME_OPTIONS/THEMES, ThemeShell, useThemeShell, SiteGate); Editorial con rediseño visual completo (Header/Footer/páginas propias); falta añadir otros temas premium (Cinematic, etc.)
6. Deployment en Vercel
7. Dominios personalizados
