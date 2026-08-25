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
│   ├── About.tsx              (bloque visual reutilizable, data-driven)
│   ├── BlogCard.tsx           (tarjeta de publicación del blog)
│   ├── DocumentHead.tsx       ( título dinámico + favicon)
│   ├── EmbedBlock.tsx         (renderiza embeds de YouTube/Vimeo/redes)
│   ├── Footer.tsx             (fijo abajo, links reales, admin button)
│   ├── Header.tsx             (sticky, glass, Links, dark mode toggle)
│   ├── Hero.tsx               (imagen fondo, botones Link, scroll glass)
│   ├── MasonryGallery.tsx     (grid masonry con aspect-ratios móviles)
│   ├── PhotoViewer.tsx        (visor fullscreen, click fuera, SVGs)
│   ├── ProjectCard.tsx        (tarjeta de proyecto, sombra en textos)
│   └── ScrollToTop.tsx        (scroll a top en cambio de ruta)
│
├── pages/
│   ├── About.tsx              (página /sobre-mi)
│   ├── AdminLogin.tsx         (página /admin, UI login placeholder)
│   ├── Blog.tsx               (listado /blog)
│   ├── BlogPost.tsx           (artículo individual /blog/:slug)
│   ├── Contact.tsx            (página /contacto)
│   ├── Home.tsx               (secciones: Hero, Featured, Projects)
│   ├── NotFound.tsx           (404 reutilizable con título configurable)
│   └── Project.tsx            (página /proyecto/:slug)
│
├── themes/
│   └── minimal/
│       └── MinimalTheme.tsx   (layout flex, dark mode persistente)
│
├── data/
│   └── portfolio.ts           (datos demo: photographer, projects, blogPosts, siteTexts)
│
├── lib/
│   ├── embeds.ts              (detección de proveedor + URLs embed seguras)
│   └── socials.ts             (utilidades instagramUrl, behanceUrl)
│
├── types/
│   └── portfolio.ts           (Photographer, Photo, Project, BlogPost, SiteTexts, etc.)
│
├── App.tsx                    (BrowserRouter → DocumentHead + MinimalTheme)
├── main.tsx                   (entry point React StrictMode)
├── router.tsx                 (todas las rutas + catch-all 404)
└── index.css                  (Tailwind v4 + font Montserrat + gradientes de fondo)

public/
├── favicon.svg
└── icons.svg

---

# 5. Arquitectura actual

App.tsx:

```
BrowserRouter
├── DocumentHead
└── MinimalTheme
    ├── ScrollToTop
    ├── Header (sticky, glass, Links)
    ├── AppRouter (flex-1)
    │   ├── /              → Home
    │   ├── /proyecto/:slug → Project
    │   ├── /sobre-mi      → AboutPage
    │   ├── /blog          → BlogPage
    │   ├── /blog/:slug    → BlogPostPage
    │   ├── /contacto      → ContactPage
    │   ├── /admin         → AdminLoginPage
    │   └── *              → NotFound (404)
    └── Footer (fijo abajo, mt-auto)
```

El layout de MinimalTheme es flex min-h-screen flex-col, lo que garantiza que el footer siempre quede pegado al fondo de la pantalla (sticky footer).

Los fondos sólidos de las páginas se eliminaron para que se vean los gradientes sutiles del body (§10).

---

# 5. DocumentHead

Existe:

src/components/DocumentHead.tsx

Actualmente establece dinámicamente:

document.title = `${photographer.name} - ${photographer.profession}`

Por ejemplo:

Alex Morgan - Fotógrafo

También establece el favicon:

/favicon.svg

En el futuro debería poder ser configurable desde el administrador.

---

# 6. Favicon

Existe:

public/favicon.svg

Es un icono de cámara utilizado actualmente como favicon.

Actualmente el favicon es fijo.

En el futuro debería poder ser configurable desde la información del sitio si se desea.

---

# 7. Datos actuales

Existe:

src/data/portfolio.ts

Contiene los datos de demostración (fotógrafo ficticio "Alex Morgan"):

- photographer — información personal, hero, about, contacto, redes
- siteTexts — textos configurables de secciones + workNoun (sustantivo profesional)
- projects — proyectos con fotos (antes "galleries")
- favorites — fotos favoritas del fotógrafo (datos existentes, sin renderizar aún)
- featuredPhotos — selección destacada para el masonry del Home
- blogPosts — 3 publicaciones demo con bloques mixtos (texto, imágenes, embeds)

siteTexts es clave para la genericidad multi-profesión. Incluye:

- workNounSingular / workNounPlural ("fotografía"/"fotografías")
- textos de secciones: featuredLabel, featuredTitle, featuredDescription, projectsLabel, projectsTitle, projectsDescription

La intención es que estos datos estáticos sean reemplazados progresivamente por datos provenientes de Supabase.

IMPORTANTE:
Los componentes NO deben contener textos ligados a una profesión específica.
Todo texto visible viene de los datos (photographer o siteTexts).

---

# 8. Tipos

Existe:

src/types/portfolio.ts

Tipos principales:

- Photographer — información del profesional (identidad + hero + about + contacto + redes)
- Photo — foto individual (id: number temporal, url, title)
- Project — proyecto con fotos (id: string como slug, title, description, cover, photos[])
- SiteTexts — textos configurables de secciones (workNoun, títulos, descripciones)
- BlogPost — publicación del blog (slug, title, excerpt, cover, date, blocks[])
- BlogBlock — bloque de contenido (type: text|image|embed, payload con url/text/alt/caption/provider)
- EmbedProvider — proveedores soportados: youtube, vimeo, instagram, facebook, behance, flickr

IMPORTANTE:
- Photo.id es number por ahora; cambiará a string (UUID) cuando se conecte Supabase.
- BlogPost.blocks es un array ordenado de bloques. Cada post puede contener: párrafos de texto, imágenes con caption, y embeds de redes/YouTube/Vimeo.

---

# 9. Hero

El Hero ya está terminado visualmente para el tema Minimal.

Características:

- Imagen horizontal de fondo
- Texto alineado a la izquierda
- Overlay degradado para facilitar lectura
- Nombre dinámico (font-extralight Montserrat grande)
- Profesión dinámica
- Descripción dinámica
- Botón "Ver portfolio" (pill blanco sólido, Link a #projects)
- Botón "Contacto" (pill glass, Link a /contacto)
- Indicador de scroll (círculo glass con flecha rebotante)
- Altura aproximada: h-[70vh] min-h-[520px] max-h-[760px]

Las imágenes actualmente son URLs externas (Unsplash).

En producción, las imágenes deberán venir desde Supabase Storage o una fuente con licencia apropiada.

---

# 10. Fondos y estética

El tema Minimal utiliza gradientes sutiles en el body (no fondos sólidos en las páginas).

Light mode:
- Color base: #f7f7fa
- Gradiente radial lavanda sutil arriba-derecha (rgba(124,108,255,0.07))
- Gradiente radial melocotón abajo-izquierda (rgba(255,150,120,0.05))

Dark mode:
- Color base: #0b0a14
- Gradiente radial violeta arriba-derecha (rgba(124,108,255,0.14))
- Gradiente radial índigo abajo-izquierda (rgba(64,60,140,0.20))

Los gradientes están en index.css con background-attachment: fixed.

Las páginas (Home, About, Blog, etc.) NO tienen bg sólido propio — se ven los gradientes a través.

Excepciones que conservan su propio fondo:
- Header (glass con backdrop-blur)
- Hero (imagen de fondo + overlay negro)
- PhotoViewer (bg-black/95)
- Secciones internas de Home (usan solo border-t)

Estilo visual general:
- Glass sutil en header, menú móvil, botones secundarios, PhotoViewer controls, pills de fecha/info
- Esquinas redondeadas: rounded-3xl en portadas, rounded-2xl en imágenes/masonry/embeds, rounded-full en botones
- Tipografía: Montserrat 200–600 (delgada y geométrica), font-extralight para títulos grandes
- Color de acento: #7C6CFF (violeta)
- Selección de texto: rgba(124,108,255,0.25)

---

# 11. Navegación (Header)

El Header es sticky con glass (backdrop-blur-xl/2xl) y se intensifica al hacer scroll.

Enlaces del menú:
- Destacadas → Link a / con state.scrollTo: "featured"
- Proyectos → Link a / con state.scrollTo: "projects"
- Sobre mí → Link a /sobre-mi
- Blog → Link a /blog
- Contacto → Link a /contacto

Los enlaces de ancla (Destacadas, Proyectos) funcionan desde CUALQUIER página gracias al state.scrollTo:
- Si ya estás en Home: hace scroll suave a la sección
- Si estás en otra página: navega a Home y luego hace scroll

El logo (nombre del fotógrafo) es un Link a /, en versalitas con tracking amplio.

Dark mode toggle: pill en desktop, botón en menú móvil.

Menú móvil: panel glass con esquina redondeada (rounded-l-[2rem]) que se desliza desde la derecha.

---

# 12. MasonryGallery / Selección destacada

Existe una sección de selección destacada en Home.

Utiliza:

MasonryGallery

Características:

- Grid controlado: 2 columnas móvil, 4 columnas desktop
- Altura fija en desktop: md:h-[720px] md:grid-rows-3
- Primer tile: col-span-2 aspect-square (móvil) / row-span-2 (desktop)
- Tile ancho (posición 5): col-span-2 aspect-video
- Resto: aspect-[4/3] en móvil, aspect-auto en desktop
- Tiles redondeados (rounded-2xl) con gap-4
- Hover: scale 1.03 + overlay sutil

El componente limita silenciosamente a 8 fotos (slice(0, 8)).

---

# 13. Proyectos (antes "Galerías")

La sección de proyectos en Home se llama "Proyectos" (siteTexts.projectsTitle).

Cada proyecto se muestra mediante:

ProjectCard

Características:
- Tarjeta completa clickeable, navega a /proyecto/:slug
- Imagen de portada con rounded-3xl
- Overlay degradado ascendente (from-black/45)
- Textos con sombra ([text-shadow]) para legibilidad sobre fotos
- Contador usa siteTexts.workNounPlural/Singular (ej: "3 fotografías")
- Hover: scale 1.04 en imagen

El concepto de "galería" fue renombrado a "proyecto" en toda la aplicación.

---

# 14. Página de Proyecto

Existe:

src/pages/Project.tsx

Recibe props:

interface ProjectPageProps {
  project: Project;
  onBack: () => void;
}

Contiene:
- Botón volver (Link a /)
- Encabezado (título, descripción, contador de fotos con workNoun)
- Grid de fotos: 1 columna móvil, 2 tablet, 3 desktop
- PhotosViewer integrado

El router (/proyecto/:slug) busca el proyecto por su id en portfolio.ts.
Si no existe, muestra NotFound con título "Proyecto no encontrado".

---

# 15. PhotoViewer

Existe:

src/components/PhotoViewer.tsx

Su interfaz es:

interface PhotoViewerProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex: number;
  totalPhotos: number;
}

Funciones actuales:
- Imagen en alta resolución (w=2400&q=85)
- Fondo negro con bg-black/95
- Controles circulares glass (cerrar, anterior, siguiente) con SVGs centrados
- Contador/título en pill glass (border-white/10 bg-white/10 backdrop-blur-md)
- Imagen con rounded-xl
- Teclado: Escape, ArrowLeft, ArrowRight
- Bloqueo del scroll del body mientras está abierto
- Click fuera de la imagen cierra el visor (onClick en backdrop + stopPropagation en controles/contenido)
- aria-label genérico ("Visor de imágenes") — sin palabras ligadas a fotografía

IMPORTANTE:
NO modificar la API del PhotoViewer sin necesidad.
Home.tsx, Project.tsx y BlogPost.tsx se adaptan a esta interfaz.

---

# 16. Home.tsx

Existe:

src/pages/Home.tsx

Actualmente contiene:
- Hero
- Sección "Destacadas" (siteTexts.featuredLabel/Title/Description)
  - MasonryGallery con featuredPhotos
- Sección "Proyectos" (siteTexts.projectsLabel/Title/Description)
  - Grid con ProjectCard por cada proyecto
- PhotoViewer (estado compartido: viewerPhotos, viewerIndex)

Home maneja el estado del PhotoViewer:
- viewerPhotos: Photo[]
- viewerIndex: number | null
- openViewer, closeViewer, showPrevious, showNext

Home tiene scrollTo por state:
- useLocation lee location.state.scrollTo
- useEffect hace scroll suave al elemento por id
- Esto permite que los enlaces de ancla del Header funcionen desde cualquier página

NO contiene: sección favoritas (datos existen en portfolio.ts pero no se renderizan).

---

# 17. About

Existe como doble uso:

1. Componente: src/components/About.tsx
   - Bloque visual reutilizable
   - Importa photographer directamente de data/portfolio.ts
   - Muestra: label "Sobre mí", aboutTitle, aboutDescription, ubicación, Instagram
   - Genérico: sin palabras ligadas a una profesión

2. Página: src/pages/About.tsx
   - Ruta: /sobre-mi
   - Envuelve el componente About con espaciado propio

El componente About está diseñado para poder ser incrustado también dentro de Home si un tema lo desea (misma data, layout diferente).

---

# 18. Blog

El blog está implementado con arquitectura por bloques.

Rutas:
- /blog → listado de publicaciones
- /blog/:slug → artículo individual

Tipos:
- BlogPost: slug, title, excerpt, cover, date, blocks[]
- BlogBlock: type (text|image|embed) + payload

Tipos de bloques:
- text: párrafo de texto libre
- image: imagen con URL, alt y caption opcional
- embed: URL de redes + caption; proveedor detectado automáticamente

Soporte de embeds (src/lib/embeds.ts):
- YouTube → iframe seguro (youtube-nocookie.com, sin cookies)
- Vimeo → iframe seguro (player.vimeo.com)
- Instagram, Facebook, Behance, Flickr → tarjeta-enlace elegante (upgrade a oEmbed futuro)

Componentes:
- BlogCard: tarjeta con portada rounded-3xl, fecha en pill glass sobre imagen
- EmbedBlock: renderiza iframe (YouTube/Vimeo) o tarjeta-enlace (otras redes)
- BlogPostPage: renderiza bloques secuencialmente

Los 3 posts de demostración incluyen: historia con fotos+captions, video YouTube, embeds de Instagram y Behance.

---

# 19. Contacto

Ruta: /contacto
Página: src/pages/Contact.tsx

Contiene:
- Encabezado: label "Contacto", contactTitle/description del fotógrafo
- Botón mailto grande (rounded-full, con sombra)
- Email visible
- Ubicación
- Instagram (link real a instagram.com/handle)
- Behance (link real a behance.net/user)

contactTitle y contactDescription son campos opcionales en Photographer.
Si no existen, usa defaults: "Hablemos." y descripción genérica.

Las URLs de redes se construyen desde los handles usando src/lib/socials.ts.

---

# 20. Página 404

Existe:

src/pages/NotFound.tsx

Componente reutilizable con prop title opcional (default: "Página no encontrada").

Se usa en 3 situaciones:
1. Ruta catch-all (*): "Página no encontrada"
2. Proyecto inexistente: "Proyecto no encontrado"
3. Artículo inexistente: "Artículo no encontrado"

---

# 21. Administrador

Existe:

src/pages/AdminLogin.tsx

Ruta: /admin

Es una UI placeholder para el futuro login con Supabase Authentication.

Contiene:
- Formulario de email/contraseña
- Botón "Entrar"
- Nota: "El acceso se activará al conectar Supabase Authentication"
- Diseño glass card (rounded-3xl, border, backdrop-blur-xl)

Accesible desde el botón "Administrador" en el Footer (pill con ícono de candado SVG).

---

# 22. Footer

El Footer es fijo abajo de la pantalla (mt-auto en layout flex de MinimalTheme).

Contenido:
- Columna izquierda: nombre (Link, versalitas), profesión, redes sociales (pills con links reales)
- Columna central: "Explora" con links internos (Inicio, Sobre mí, Blog, Contacto)
- Columna derecha: botón "Administrador" (pill con candado SVG → /admin)
- Barra inferior: © año + nombre · "Impulsado por Visora"

Border-t con opacidad reducida para integrarse con los gradientes de fondo.

---

# 23. Filosofía de temas

Una de las ideas principales del producto es que los clientes NO puedan modificar libremente el diseño.

En cambio:

El cliente elige un tema.

Por ejemplo:

- Minimal (actual)
- Editorial
- Cinematic
- etc.

Los temas pueden tener distintos niveles de trabajo/diseño y por tanto distintos precios.

Los datos son los mismos.

El diseño cambia.

La arquitectura actual favorece esta separación:
- Los datos (portfolio.ts) son independientes del tema
- El tema (MinimalTheme) decide layout, colores, componentes
- Los componentes (About, ProjectCard, etc.) pueden reutilizarse entre temas
- SiteTexts contiene los textos UI configurables por tema

---

# 24. Funciones completadas

La estructura pública de Visora está terminada:

Rutas funcionales:
- / → Home (Hero + Destacadas + Proyectos)
- /proyecto/:slug → Página de proyecto con fotos
- /sobre-mi → Sobre mí
- /blog → Listado de publicaciones
- /blog/:slug → Artículo individual con bloques
- /contacto → Contacto con email/redes
- /admin → Login placeholder
- * → 404

Componentes funcionales:
- Header con Links, glass, dark mode toggle, menú móvil
- Hero con Links, glass scroll indicator
- PhotoViewer con click fuera, SVGs, aria-labels genéricos
- MasonryGallery responsive con aspect-ratios estables
- ProjectCard con sombras de texto y gradiente
- BlogCard con fecha pill glass
- EmbedBlock con iframe seguro
- Footer fijo con admin button
- About reutilizable (componente + página)
- NotFound reutilizable

Estética:
- Montserrat 200–600
- Glass sutil (header, menú, controles, pills)
- Esquinas redondeadas (3xl/2xl/full)
- Gradientes sutiles en body
- Dark mode persistente (localStorage)
- lang="es" en index.html

---

# 25. Pendientes conocidos

Falta para completar la estructura pública:

- Sección favoritas en Home (datos existen, no se renderizan)
- Footer con enlaces sociales a href="#" placeholders (Instagram/Behance en About y Footer usan links reales, pero otros/socials adicionales quedan pendientes)
- Vercel.json: rewrite para SPA routing (todas las rutas → index.html) — necesario antes de deploy
- SEO: metadata por página (title, description, Open Graph) — puede usar react-helmet-async o efectos manuales
- index.html: título estático "visora" — DocumentHead lo sobreescribe al montar

Pendientes técnicos:

- Photo.id cambiará de number a string (UUID) cuando se conecte Supabase
- SiteTexts será editable desde el administrador
- Blog con oEmbed completo para Instagram/Facebook (requiere tokens o scripts externos)
- Dark mode flash en carga (estado leído de localStorage, pero un frame de light antes de aplicar clase .dark)
- MasonryGallery limita a 8 fotos silenciosamente — documentar o hacer configurable

---

# 26. Modelo de datos Supabase

La estructura que emergió del frontend (estática por ahora) confirma estas tablas necesarias:

photographer/profile
- name, profession, description
- heroImage, heroPrimaryButton, heroSecondaryButton
- aboutTitle, aboutDescription
- contactTitle, contactDescription
- email, location, instagram, behance

site_settings
- workNounSingular, workNounPlural
- featuredLabel, featuredTitle, featuredDescription
- projectsLabel, projectsTitle, projectsDescription
- theme, primaryColor, secondaryColor
- watermarkEnabled, downloadsEnabled

projects (antes "galleries")
- id (slug string), title, description, cover

photos
- id (UUID), project_id (FK), url, title, position
- is_featured (boolean), is_favorite (boolean)

blog_posts
- slug, title, excerpt, cover, date

blog_post_blocks
- id, post_id (FK), position (integer)
- type: text | image | embed
- payload: jsonb (text, url, alt, caption, provider)

Storage:
- portfolio-images (fotos de proyectos)
- blog-images (portadas e imágenes inline del blog)

La estructura exacta debe definirse con cuidado antes de crear las tablas.
Los componentes NO dependen directamente de Supabase — usan interfaces TypeScript que serán alimentadas por servicios.

---

# 27. Arquitectura objetivo

La arquitectura actual:

```
App
├── BrowserRouter
├── DocumentHead
└── MinimalTheme (o cualquier otro tema)
    ├── ScrollToTop
    ├── Header (Links, glass, dark mode)
    ├── Router
    │   ├── Home (Hero, Destacadas, Proyectos)
    │   ├── Project (/proyecto/:slug)
    │   ├── About (/sobre-mi)
    │   ├── Blog (/blog)
    │   ├── BlogPost (/blog/:slug)
    │   ├── Contact (/contacto)
    │   ├── AdminLogin (/admin)
    │   └── NotFound (*)
    └── Footer (fijo, admin button)
```

Flujo de datos futuro:

```
Supabase
↓
services (fetch, transform)
↓
pages (reciben props)
↓
components (reutilizables por tema)
↓
Theme (layout, colores, estética)
```

---

# 28. Principio de desarrollo

El usuario necesita instrucciones claras y paso a paso.

Preferir:

1. crear archivo
2. copiar contenido completo
3. comprobar compilación
4. continuar

Cuando sea posible, entregar archivos completos en lugar de fragmentos ambiguos.

No asumir interfaces de componentes existentes: revisar el código actual antes de cambiar cómo se comunican.

El usuario utiliza un agente IA para acelerar el desarrollo, por lo que el código debe mantenerse suficientemente estructurado y claro para que otros agentes puedan entenderlo.

IMPORTANTE: El agente debe ejecutar npm run build y npm run lint después de cada cambio significativo para verificar que todo compila correctamente.

---

# 29. Estado de negocio

La idea original era vender portfolios alrededor de USD 80, pero se considera que incluso USD 80 podría ser alto para algunos clientes.

Se está buscando mantener el producto extremadamente eficiente de producir.

La estrategia es:

- plantilla reutilizable
- pago único
- infraestructura separada por cliente
- varios temas
- diferentes niveles de precio según diseño
- instalación/configuración como parte del servicio

No se busca construir inicialmente un SaaS masivo.

Se busca crear sitios profesionales que puedan venderse individualmente de forma rápida.

---

# 30. Próximo objetivo técnico

ESTADO ACTUAL: La estructura pública está terminada. La estructura de datos está definida por los tipos TypeScript.

PRÓXIMO PASO: Definir y crear el modelo de datos en Supabase.

Después:

1. Conectar Supabase (lectura de datos)
2. Storage (subida de imágenes)
3. Autenticación (login del administrador)
4. Panel de administrador (CRUD de contenido)
5. Selección de tema
6. Deployment en Vercel
7. Dominios personalizados
