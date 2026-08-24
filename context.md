# VISORA — CONTEXTO DEL PROYECTO

## 1. Concepto

Visora es una aplicación web/plantilla de portfolios profesionales orientada principalmente a fotógrafos.

La idea comercial es crear sitios web completos y profesionales que puedan venderse rápidamente a fotógrafos y eventualmente a otros profesionales/PYMEs.

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

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM (instalado, todavía no configurado)

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

# 4. Versiones actuales

Actualmente el proyecto fue creado con Vite.

Dependencias comprobadas:

- React 19.2.8
- React DOM 19.2.8
- Vite 8.2.2
- @vitejs/plugin-react 6.1.0

React Router DOM fue instalado recientemente y está listo para configurarse.

El proyecto compila correctamente.

---

# 5. Estado actual del frontend

La aplicación ya tiene una primera versión visual funcional.

Tema actual:

MinimalTheme

La estructura actual aproximada:

src/
├── components/
│ ├── Content.tsx
│ ├── Header.tsx
│ ├── Hero.tsx
│ ├── GalleryCard.tsx
│ ├── MasonryGallery.tsx
│ ├── PhotoViewer.tsx
│ ├── Footer.tsx
│ └── otros componentes
│
├── pages/
│ ├── Home.tsx
│ └── Gallery.tsx
│
├── themes/
│ └── MinimalTheme.tsx
│
├── data/
│ └── portfolio.ts
│
├── types/
│ └── portfolio.ts
│
└── App.tsx

También existe:

public/
└── camera.svg

---

# 6. Arquitectura actual

App.tsx actualmente carga:

DocumentHead

- MinimalTheme

MinimalTheme actualmente utiliza Content.

Content fue convertido en un puente temporal:

import Home from '../pages/Home'

function Content() {
return <Home />
}

export default Content

Esto permite mantener funcionando MinimalTheme mientras migramos correctamente a pages.

En el futuro se puede eliminar Content y hacer que MinimalTheme utilice directamente Home.

---

# 7. DocumentHead

Existe un componente:

src/components/DocumentHead.tsx

Actualmente establece dinámicamente:

document.title = `${photographer.name} - ${photographer.profession}`

Por ejemplo:

Alex Morgan - Fotógrafo

Esto está pensado para que posteriormente el cliente pueda modificar estos valores desde el administrador.

También establece el favicon:

/camera.svg

---

# 8. Favicon

Existe:

public/favicon.svg

Es un icono de cámara utilizado actualmente como favicon.

Actualmente el favicon es fijo.

En el futuro debería poder ser configurable desde la información del sitio si se desea.

---

# 9. Datos actuales

Existe:

src/data/portfolio.ts

Aquí actualmente viven los datos de demostración del fotógrafo.

Entre ellos:

photographer

featuredPhotos

favorites

galleries

La intención es que estos datos actualmente estáticos sean reemplazados progresivamente por datos provenientes de Supabase.

---

# 10. Hero

El Hero ya está terminado visualmente para la primera versión del tema Minimal.

Características:

- Imagen horizontal de fondo.
- Fotógrafo ubicado visualmente hacia la derecha.
- Texto alineado a la izquierda.
- Overlay degradado para facilitar lectura.
- Nombre dinámico.
- Profesión dinámica.
- Descripción dinámica.
- Botón "Ver portfolio".
- Botón "Contacto".
- Indicador de scroll.
- Altura aproximada:
  h-[70vh]
  min-h-[520px]
  max-h-[760px]

El Hero utiliza actualmente una imagen externa.

Para prototipo se decidió utilizar URLs externas en lugar de descargar imágenes al proyecto.

En producción, las imágenes deberán venir desde Supabase Storage o una fuente con licencia apropiada.

---

# 11. Masonry / selección destacada

Existe una sección de selección destacada.

Utiliza:

MasonryGallery

El objetivo fue crear un masonry controlado.

Inicialmente se probaron muchos elementos, pero se decidió limitar la cantidad de imágenes para evitar:

- deformaciones
- espacios vacíos
- alturas exageradas
- apariencia de grid accidental

Actualmente se utiliza una cantidad definida de fotografías.

La sección muestra una selección rápida del trabajo del fotógrafo.

---

# 12. Galerías

Existe una sección:

"Todas mis historias"

Las galerías actualmente se muestran mediante:

GalleryCard

Cada tarjeta contiene:

- imagen de portada
- nombre de la galería
- cantidad de fotografías
- descripción
- enlace visual "Ver galería →"

Actualmente el click de las tarjetas todavía abre directamente el PhotoViewer como solución temporal.

Esto debe cambiarse.

El comportamiento definitivo será:

GalleryCard
→ ruta /galeria/:slug
→ Gallery.tsx
→ fotografías de la galería
→ click en fotografía
→ PhotoViewer

---

# 13. Gallery.tsx

Ya existe:

src/pages/Gallery.tsx

Es una página independiente que recibe:

gallery
onBack

Actualmente contiene:

- botón volver
- título
- descripción
- cantidad de fotografías
- grid de fotografías
- PhotoViewer
- navegación anterior/siguiente

Actualmente NO está conectada al router.

El siguiente paso es conectarla a React Router.

---

# 14. PhotoViewer

Existe:

src/components/PhotoViewer.tsx

Su interfaz REAL es:

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

- imagen en alta resolución
- fondo negro
- botón cerrar
- fotografía anterior
- fotografía siguiente
- contador
- teclado:
  - Escape
  - ArrowLeft
  - ArrowRight
- bloqueo del scroll del body mientras está abierto

IMPORTANTE:

NO modificar la API del PhotoViewer sin necesidad.

Home.tsx y Gallery.tsx fueron adaptados a esta interfaz.

---

# 15. Home.tsx

Existe:

src/pages/Home.tsx

Actualmente contiene:

- Hero
- Selección destacada
- MasonryGallery
- sección de galerías
- GalleryCard
- sección de favoritas
- MasonryGallery
- PhotoViewer

Home maneja el estado del PhotoViewer:

viewerPhotos
viewerIndex

También tiene navegación anterior/siguiente.

El proyecto compila correctamente después de esta reorganización.

---

# 16. Gallery.tsx

Gallery maneja su propio:

viewerIndex

Y abre PhotoViewer utilizando:

imageUrl
title
currentIndex
totalPhotos
hasPrevious
hasNext
onPrevious
onNext
onClose

El layout actual de Gallery es un grid:

1 columna móvil
2 columnas tablet
3 columnas escritorio

Esto es provisional.

En el futuro cada Theme podrá tener su propio layout.

---

# 17. Filosofía de temas

Una de las ideas principales del producto es que los clientes NO puedan modificar libremente el diseño.

En cambio:

El cliente elige un tema.

Por ejemplo:

Minimal
Editorial
Cinematic
etc.

Los temas pueden tener distintos niveles de trabajo/diseño y por tanto distintos precios.

Los datos son los mismos.

El diseño cambia.

Ejemplo:

Minimal:

- blanco
- espacios amplios
- tipografía limpia
- grid/masonry controlado

Editorial:

- composición más artística
- tipografía más elaborada
- layouts asimétricos

Cinematic:

- fondos oscuros
- imágenes grandes
- transiciones
- estética más inmersiva

La arquitectura debe favorecer esta separación.

---

# 18. Futuras páginas

La estructura prevista:

/
→ Home

/galeria/:slug
→ Gallery

/blog
→ Blog

/blog/:slug
→ BlogPost

/contacto
→ Contact

Posiblemente:

/sobre-mi
→ About

Aunque algunas de estas secciones podrían permanecer dentro de Home dependiendo del tema.

---

# 19. Blog

Se decidió agregar una sección Blog.

El fotógrafo podrá escribir:

- experiencias
- historias
- sesiones
- viajes
- detrás de cámaras
- reflexiones
- artículos
- contenido relacionado con su trabajo

Posteriormente esto será administrable desde un panel.

---

# 20. Favoritas del fotógrafo

Existe una sección:

"Mis favoritas"

Su propósito es que el fotógrafo pueda seleccionar manualmente algunas fotografías que considere especialmente representativas.

Posteriormente deberá ser administrable.

---

# 21. Funciones futuras del producto

El sitio completo debería eventualmente incluir:

## Portfolio

- fotografías destacadas
- múltiples galerías
- galerías individuales
- fotografías en alta resolución
- visor de fotografías
- navegación anterior/siguiente
- favoritos del fotógrafo
- masonry/grid según tema

## Protección de fotografías

Se planea:

- bloquear descarga directa tanto como sea razonable
- deshabilitar ciertas acciones del navegador
- usar imágenes optimizadas para web
- aplicar marca de agua cuando corresponda
- posibilidad de entregar versiones con watermark
- evitar servir archivos originales directamente

IMPORTANTE:
No existe protección absoluta contra guardar una imagen que se muestra en un navegador.
El objetivo es dificultar la descarga casual y proteger los originales.

## Contacto

- formulario de contacto
- email
- redes sociales
- teléfono/WhatsApp opcional
- ubicación opcional

## Blog

- listado de artículos
- artículo individual
- imágenes
- título
- fecha
- contenido

## SEO

- title dinámico
- description
- Open Graph
- favicon
- URLs amigables
- metadata por galería
- metadata por artículo
- sitemap
- robots.txt

## Responsive

- móvil
- tablet
- desktop

---

# 22. Futuro administrador

Más adelante se desarrollará un panel de administración.

El cliente debería poder cambiar:

## Identidad

- nombre
- profesión
- descripción
- favicon
- título del sitio
- SEO

## Hero

- imagen
- texto
- botones

## Galerías

- crear
- editar
- eliminar
- cambiar nombre
- cambiar descripción
- cambiar portada
- ordenar fotografías
- subir fotografías

## Fotografías

- subir
- eliminar
- ordenar
- título
- descripción
- alt text
- marcar como favorita
- watermark

## Blog

- crear artículo
- editar
- publicar
- eliminar
- imagen destacada

## Contacto

- email
- teléfono
- WhatsApp
- redes
- ubicación

## Tema

El cliente podrá elegir entre los temas disponibles.

No podrá editar directamente el diseño.

---

# 23. Supabase futuro

Cada cliente tendrá inicialmente su propio proyecto Supabase.

Posibles tablas:

photographer/profile
site_settings
galleries
photos
favorites
blog_posts
contact_settings
social_links

Storage:

portfolio-images
blog-images
possibly avatars

La estructura exacta todavía NO está definida.

No crear todavía las tablas definitivas hasta definir correctamente el modelo de datos.

---

# 24. Vercel futuro

Cada cliente tendrá su propio proyecto/deployment.

El sitio podrá utilizar:

- dominio personalizado
- variables de entorno
- Supabase URL
- Supabase anon key

La configuración será específica por cliente.

---

# 25. Modelo de datos futuro

La aplicación actualmente usa datos estáticos.

Objetivo:

ANTES:

portfolio.ts
↓
React

DESPUÉS:

Supabase
↓
servicios/API
↓
datos
↓
Theme
↓
componentes

Los componentes visuales no deberían depender directamente de Supabase.

---

# 26. Estado actual del desarrollo

COMPLETADO:

- proyecto Vite
- React + TypeScript
- Tailwind
- GitHub
- estructura inicial
- Header
- Hero
- favicon
- título dinámico
- Masonry controlado
- selección destacada
- favoritas
- GalleryCard
- PhotoViewer
- navegación del PhotoViewer
- Home.tsx
- Gallery.tsx
- Content como puente
- React Router DOM instalado

EN PROGRESO:

- reorganización de páginas
- configuración de React Router
- rutas dinámicas para galerías

PRÓXIMO PASO INMEDIATO:

Configurar React Router.

Objetivo:

/
→ Home

/galeria/:slug
→ Gallery

El slug debe buscar la galería correspondiente desde portfolio.ts.

Ejemplo:

/galeria/bodas

busca:

galleries.find(
gallery => gallery.slug === "bodas"
)

y entrega esa galería a:

Gallery.tsx

Después se reemplazará portfolio.ts por Supabase.

---

# 27. Arquitectura objetivo

La arquitectura final debería parecerse a:

App
│
├── DocumentHead
│
└── Theme
│
├── Header
│
├── Router
│ ├── Home
│ ├── Gallery
│ ├── Blog
│ └── BlogPost
│
└── Footer

Datos:

Supabase
↓
services
↓
pages
↓
theme components

Tema:

MinimalTheme
EditorialTheme
CinematicTheme
...

Los temas deberían compartir la misma estructura de datos.

---

# 28. Principio de desarrollo

El usuario necesita instrucciones claras y paso a paso.

Evitar cambiar muchos archivos simultáneamente sin explicar qué cambia.

Preferir:

1. crear archivo
2. copiar contenido completo
3. comprobar compilación
4. continuar

Cuando sea posible, entregar archivos completos en lugar de fragmentos ambiguos.

No asumir interfaces de componentes existentes: revisar el código actual antes de cambiar cómo se comunican.

El usuario utiliza un agente IA para acelerar el desarrollo, por lo que el código debe mantenerse suficientemente estructurado y claro para que otros agentes puedan entenderlo.

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

Configurar React Router DOM.

Después:

1. rutas
2. slug de galerías
3. navegación Home → Gallery
4. botón volver
5. probar URLs directas
6. mejorar diseño de Gallery
7. crear página Blog
8. crear Contact
9. completar Home
10. definir modelo de datos Supabase
11. conectar Supabase
12. Storage
13. autenticación
14. administrador
15. selección de tema
16. deployment en Vercel
17. dominios personalizados
