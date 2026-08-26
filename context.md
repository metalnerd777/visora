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
│   ├── About.tsx              (bloque visual reutilizable, importa profile)
│   ├── BlogCard.tsx           (tarjeta de publicación del blog)
│   ├── DocumentHead.tsx       (título dinámico + favicon, importa profile)
│   ├── EmbedBlock.tsx         (renderiza embeds de YouTube/Vimeo/redes)
│   ├── Footer.tsx             (fijo abajo, socialLinks[], admin button)
│   ├── Header.tsx             (sticky, glass, Links, dark mode toggle)
│   ├── Hero.tsx               (imagen fondo, botones Link, scroll glass)
│   ├── MasonryGallery.tsx     (grid masonry dinámico, columnas por count)
│   ├── PhotoViewer.tsx        (visor fullscreen, click fuera, SVGs)
│   ├── ProjectCard.tsx        (tarjeta de proyecto, navega por slug)
│   └── ScrollToTop.tsx        (scroll a top en cambio de ruta)
│
├── pages/
│   ├── About.tsx              (página /sobre-mi)
│   ├── AdminLogin.tsx         (página /admin, UI login mock)
│   ├── Blog.tsx               (listado /blog)
│   ├── BlogPost.tsx           (artículo individual /blog/:slug)
│   ├── Contact.tsx            (página /contacto, lee WhatsApp de localStorage)
│   ├── Home.tsx               (secciones: Hero, Featured, Projects)
│   ├── NotFound.tsx           (404 reutilizable con título configurable)
│   ├── Project.tsx            (página /proyecto/:slug)
│   └── admin/
│       ├── AdminLayout.tsx    (sidebar + auth guard + Outlet)
│       ├── Dashboard.tsx      (stats + quick actions)
│       ├── Profile.tsx        (nombre, profesión, avatar, redes)
│       ├── HeroAdmin.tsx      (imagen, título, botones)
│       ├── AboutAdmin.tsx     (título, descripción, imagen)
│       ├── ContactAdmin.tsx   (contenido, contacto, redes, WhatsApp, formulario)
│       ├── Featured.tsx       (selector de proyectos destacados con DnD)
│       └── projects/
│           ├── ProjectList.tsx    (lista con DnD reorder)
│           └── ProjectForm.tsx    (crear/editar proyecto + fotos)
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
│   ├── embeds.ts              (detección de proveedor + URLs embed seguras)
│   └── socials.ts             (socialUrl(), socialLabel() genéricos)
│
├── types/
│   └── portfolio.ts           (PortfolioProfile, Photo, Project, SocialLink, etc.)
│
├── App.tsx                    (BrowserRouter → DocumentHead + MinimalTheme)
├── main.tsx                   (entry point React StrictMode)
├── router.tsx                 (todas las rutas + catch-all 404)
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
    ├── Header (sticky, glass, Links)
    ├── AppRouter (flex-1)
    │   ├── /                → Home
    │   ├── /proyecto/:slug  → Project
    │   ├── /sobre-mi        → AboutPage
    │   ├── /blog            → BlogPage
    │   ├── /blog/:slug      → BlogPostPage
    │   ├── /contacto        → ContactPage
    │   ├── /admin           → AdminLoginPage (standalone)
    │   ├── /admin           → AdminLayout (protegido)
    │   │   ├── /dashboard   → Dashboard
    │   │   ├── /perfil      → Profile
    │   │   ├── /hero        → HeroAdmin
    │   │   ├── /sobre-mi    → AboutAdmin
    │   │   ├── /proyectos   → ProjectList
    │   │   ├── /proyectos/nuevo        → ProjectForm
    │   │   ├── /proyectos/:slug/editar → ProjectForm
    │   │   ├── /destacadas  → Featured
    │   │   ├── /blog        → AdminPlaceholder
    │   │   ├── /contacto    → ContactAdmin
    │   │   └── /apariencia  → AdminPlaceholder
    │   └── *                → NotFound (404)
    └── Footer (fijo abajo, mt-auto)
```

El layout de MinimalTheme es flex min-h-screen flex-col, lo que garantiza que el footer siempre quede pegado al fondo de la pantalla (sticky footer).

Los fondos sólidos de las páginas se eliminaron para que se vean los gradientes sutiles del body (§10).

---

# 6. Tipos principales

src/types/portfolio.ts

- **PortfolioProfile** — información del profesional:
  - name, profession, description
  - avatar? (string URL)
  - heroImage?, heroPrimaryButton?, heroSecondaryButton?
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
  - slug, title, excerpt, cover, date
  - blocks: BlogBlock[]

- **BlogBlock** — bloque de contenido:
  - type: "text" | "image" | "embed"
  - text?, url?, alt?, caption?, provider?

---

# 7. Datos actuales

src/data/portfolio.ts

Exporta `profile` (antes era `photographer`):

- profile — información personal, hero, about, contacto, socialLinks[]
- siteTexts — textos configurables de secciones + workNoun
- projects — proyectos con fotos (slug como id)
- favorites — fotos favoritas (datos existentes, sin renderizar aún)
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
- `visora-admin-auth` — estado de autenticación mock
- `visora-admin-profile` — perfil completo (name, profession, description, avatar, email, location, socialLinks)
- `visora-admin-hero` — hero config (heroImage, title, description, primaryText/Link, secondaryText/Link, showSecondary)
- `visora-admin-about` — sobre mí (title, description, image?)
- `visora-admin-contact` — contacto config:
  - title, description
  - email, location
  - socialLinks: SocialLink[]
  - whatsappPhone: string (número con código de país)
  - whatsappMessage: string (mensaje predefinido)
  - formEnabled: boolean
  - formEmail: string
- `visora-admin-projects` — array de proyectos con fotos, alt text, etc.
- `visora-admin-featured` — array de slugs de proyectos destacados

Credenciales mock: `admin@visora.com` / `admin123`

---

# 9. Administrador — Login y Auth

**Login:** src/pages/AdminLogin.tsx
- Ruta: /admin (standalone, sin AdminLayout)
- Formulario email/contraseña
- Usa `login()` de src/lib/auth.ts
- Redirige a /admin/dashboard al autenticarse

**Auth:** src/lib/auth.ts
- `login(email, password)` — valida credenciales mock, guarda en localStorage
- `logout()` — limpia localStorage
- `isAuthenticated()` — verifica estado en localStorage

---

# 10. Administrador — Layout y Sidebar

**Layout:** src/pages/admin/AdminLayout.tsx
- Auth guard: si no está autenticado, renderiza solo el Outlet (login)
- Sidebar fijo en desktop, overlay en móvil
- Barra superior móvil con hamburguesa
- Botón cerrar sesión en footer del sidebar

**Nav items (en orden):**
1. Dashboard → /admin/dashboard (ícono casa)
2. Perfil → /admin/perfil (ícono usuario)
3. Hero → /admin/hero (ícono monitor)
4. Sobre mí → /admin/sobre-mi (ícono usuario+)
5. Proyectos → /admin/proyectos (ícono grid)
6. Destacadas → /admin/destacadas (ícono estrella)
7. Blog → /admin/blog (ícono plumilla)
8. Contacto → /admin/contacto (ícono sobre)
9. Apariencia → /admin/apariencia (ícono engranaje)

---

# 11. Administrador — Módulos completados

## Dashboard
- 4 stat cards (Proyectos, Fotos, Entradas blog, Destacadas)
- 4 quick actions (nuevo proyecto, ver sitio, editar perfil, ver blog)

## Perfil
- Sección información principal: Nombre, Profesión, Descripción, Ubicación, Email
- Sección imagen de perfil: upload con preview, cambiar/eliminar
- Sección redes sociales: selector de plataforma + handle, agregar/eliminar

## Hero
- Sección imagen de fondo: upload con preview, cambiar/eliminar
- Sección contenido: Título, Descripción
- Sección botones: Principal (texto+enlace), Secundario (texto+enlace + toggle show/hide)

## Sobre mí
- Sección imagen: upload con preview, cambiar/eliminar (opcional)
- Sección contenido: Título (input), Descripción (textarea)

## Proyectos
- **ProjectList:** lista con drag-and-drop (@dnd-kit), editar/eliminar por proyecto, empty state
- **ProjectForm:** formulario compartido crear/editar:
  - Título (auto-genera slug), Descripción
  - Imagen de portada (upload preview)
  - Grid de imágenes con drag reorder, alt text, set-as-cover, agregar/eliminar

## Destacadas
- Seleccionar/deseleccionar proyectos (checkboxes)
- Lista de proyectos seleccionados con drag reorder
- Guarda array de slugs en localStorage

## Contacto
- Sección contenido: Título, Descripción
- Sección información de contacto: Email, Ubicación
- Sección redes sociales: mismos PLATFORM_OPTIONS que Perfil
- Sección WhatsApp: número de teléfono + mensaje predefinido
- Sección formulario de contacto: toggle on/off + email de destino (solo config, sin envío real)

---

# 12. Componente público — Contacto

src/pages/Contact.tsx

- Lee `visora-admin-contact` de localStorage para WhatsApp
- Si hay `whatsappPhone` configurado, muestra botón WhatsApp (ícono SVG + link wa.me)
- Link format: `https://wa.me/{phone}?text={encodedMessage}`
- Botón WhatsApp: estilo outlined, hover verde #25D366
- Se apila verticalmente con el botón de email
- Si no hay teléfono, el botón WhatsApp no se muestra

---

# 13. MasonryGallery — Grid dinámico

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

# 14. Hero

Características:
- Imagen horizontal de fondo
- Texto alineado a la izquierda
- Overlay degradado para facilitar lectura
- Nombre dinámico (font-extralight Montserrat grande)
- Profesión dinámica
- Descripción dinámica
- Botón "Ver portfolio" (pill blanco sólido, Link a #projects)
- Botón "Contacto" (pill glass, Link a /contacto) — toggle show/hide desde admin
- Indicador de scroll (círculo glass con flecha rebotante)
- Altura aproximada: h-[70vh] min-h-[520px] max-h-[760px]

---

# 15. Fondos y estética

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

# 16. Navegación (Header)

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

---

# 17. Componentes públicos reutilizables

- **About** (componente + página): label, aboutTitle, aboutDescription, ubicación, socialLinks
- **PhotoViewer**: visor fullscreen, teclado, click fuera, aria-labels genéricos
- **ProjectCard**: tarjeta clickeable, navega por slug, sombras, gradiente
- **BlogCard**: tarjeta con portada rounded-3xl, fecha pill glass
- **EmbedBlock**: iframe YouTube/Vimeo, tarjeta-enlace para otras redes
- **DocumentHead**: título dinámico `profile.name - profile.profession`, favicon
- **Footer**: sticky, socialLinks[], links internos, admin button, copyright

---

# 18. Blog

Arquitectura por bloques:
- /blog → listado de publicaciones
- /blog/:slug → artículo individual

Tipos de bloques:
- text: párrafo de texto libre
- image: imagen con URL, alt y caption opcional
- embed: URL de redes + caption; proveedor detectado automáticamente

Soporte de embeds (src/lib/embeds.ts):
- YouTube → iframe seguro (youtube-nocookie.com, sin cookies)
- Vimeo → iframe seguro (player.vimeo.com)
- Instagram, Facebook, Behance, Flickr → tarjeta-enlace elegante

Los 3 posts de demo incluyen: historia con fotos, video YouTube, embeds de Instagram y Behance.

---

# 19. Filosofía de temas

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

# 20. Modelo de datos Supabase (futuro)

photographer/profile
- name, profession, description, avatar
- heroImage, heroPrimaryButton, heroSecondaryButton
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

# 21. Pendientes conocidos

Estructura pública:
- Sección favoritas en Home (datos existen, no se renderizan)
- Vercel.json: rewrite para SPA routing — necesario antes de deploy
- SEO: metadata por página (title, description, Open Graph)
- index.html: título estático "visora" — DocumentHead lo sobreescribe

Administrador:
- Blog → placeholder (pendiente de implementar)
- Apariencia → placeholder (pendiente de implementar)
- Conectar datos admin → componente público (actualmente admin guarda en localStorage, público lee datos estáticos de portfolio.ts)

Técnicos:
- Blog con oEmbed completo para Instagram/Facebook
- Dark mode flash en carga
- Photo.id ya es string — listo para UUID de Supabase

---

# 22. Principio de desarrollo

Preferir:
1. crear archivo
2. copiar contenido completo
3. comprobar compilación
4. continuar

No asumir interfaces de componentes existentes: revisar el código actual antes de cambiar.

El usuario utiliza un agente IA para acelerar el desarrollo, por lo que el código debe mantenerse estructurado y claro.

IMPORTANTE: Ejecutar npm run build y npm run lint después de cada cambio significativo.

---

# 23. Estado de negocio

La idea es vender portfolios con pago único, infraestructura separada por cliente, varios temas a diferentes precios.

No se busca construir un SaaS masivo inicialmente.
Se busca crear sitios profesionales que puedan venderse individualmente de forma rápida.

---

# 24. Próximo objetivo técnico

ESTADO: Estructura pública terminada. Admin parcialmente implementado (6 de 9 módulos).
Pendientes admin: Blog, Apariencia, conexión admin→público.

PRÓXIMO PASO: Completar módulos pendientes del admin o conectar Supabase.

Después:
1. Conectar Supabase (lectura de datos)
2. Storage (subida de imágenes)
3. Autenticación real (reemplazar mock)
4. Conectar admin → componente público
5. Selección de tema
6. Deployment en Vercel
7. Dominios personalizados
