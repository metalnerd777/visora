Hay una decisión importante que voy a dejar explícita: cada cliente tendrá su propia cuenta/proyecto de Vercel y Supabase, mientras que tú mantendrás un único código fuente/plantilla base desde el cual crearás las instalaciones de cada cliente.

PhotoFolio — Especificación general
1. Concepto

PhotoFolio será un sistema de portafolio web profesional destinado principalmente a fotógrafos independientes.

El producto se venderá mediante pago único, sin suscripción obligatoria.

Cada fotógrafo recibirá una instalación independiente de PhotoFolio:

                    PHOTO FOLIO
                  CÓDIGO BASE ÚNICO
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      Cliente A      Cliente B      Cliente C
          │              │              │
       Vercel         Vercel         Vercel
       Supabase       Supabase       Supabase
          │              │              │
       dominio        dominio        dominio

Cada instalación tendrá sus propios:

usuarios;
datos;
fotografías;
almacenamiento;
proyecto Supabase;
proyecto Vercel;
dominio;
configuración.

Esto permite que el cliente sea propietario de su infraestructura y evita que tú tengas costos permanentes de almacenamiento por cada fotógrafo.

2. Objetivo del producto

El fotógrafo debe poder tener una web profesional sin saber programar.

La experiencia final debe ser:

Fotógrafo
    ↓
Compra PhotoFolio
    ↓
Crea/proporciona sus cuentas
    ↓
Se instala PhotoFolio
    ↓
Configura su información
    ↓
Sube sus fotografías
    ↓
Elige diseño
    ↓
Publica
    ↓
fotografo.cl
3. Estructura general de la aplicación

Habrá dos partes principales.

Sitio público

Es lo que verá cualquier visitante.

/
├── Inicio
├── Portafolio
├── Galerías
├── Proyectos
├── Favoritas
├── Sobre mí
└── Contacto
Panel administrativo

Solo accesible para el fotógrafo.

/admin
├── Dashboard
├── Perfil
├── Galerías
├── Proyectos
├── Fotografías
├── Favoritas
├── Apariencia
├── Contacto
├── Redes sociales
└── Configuración
4. Autenticación

Cada instalación tendrá su propio Supabase.

El fotógrafo podrá iniciar sesión mediante:

email;
contraseña;
recuperación de contraseña.

Opcionalmente podremos dejar preparada la arquitectura para:

magic link;
Google;
otros proveedores.

Pero no son necesarios para la primera versión.

Seguridad

El usuario autenticado solamente podrá acceder a los datos de su propia instalación.

Utilizaremos:

Supabase Auth;
PostgreSQL;
Row Level Security;
políticas de Storage.
5. Perfil del fotógrafo

El fotógrafo podrá configurar:

Información
nombre;
nombre artístico;
descripción;
biografía;
ubicación;
email;
teléfono;
WhatsApp.
Imagen
fotografía de perfil;
logo;
favicon.
Información profesional
especialidades;
servicios;
experiencia;
premios/reconocimientos opcionales.
6. Página de inicio

La página de inicio será configurable dependiendo del tema.

Podrá incluir:

fotografía principal;
presentación;
nombre;
profesión;
descripción corta;
botón "Ver portafolio";
botón "Contactar";
fotografías destacadas;
proyectos destacados;
selección del fotógrafo.
7. Sistema de galerías

El fotógrafo podrá crear galerías.

Ejemplo:

Galerías


├── Bodas
├── Retratos
├── Paisajes
├── Eventos
├── Moda
└── Fotografía artística

Cada galería tendrá:

nombre;
descripción;
imagen de portada;
fotografías;
orden;
estado publicado/no publicado.

Funciones:

crear;
editar;
eliminar;
duplicar;
cambiar portada;
cambiar orden;
publicar/despublicar.
8. Sistema de proyectos

Además de galerías, habrá proyectos individuales.

Ejemplo:

Boda de María & Juan


Santiago
Octubre 2026


[foto]
[foto]
[foto]
[foto]

Un proyecto podrá tener:

título;
descripción;
fecha;
ubicación;
portada;
fotografías;
categoría;
etiquetas;
estado publicado/no publicado.

Esto permite mostrar trabajos completos y no solamente una colección de fotografías.

9. Gestión de fotografías

El administrador podrá:

subir fotografías;
eliminar fotografías;
reemplazarlas;
ordenar fotografías;
seleccionar portada;
mover fotografías;
asociarlas a galerías;
asociarlas a proyectos;
marcar como favorita;
quitar de favoritas.

También debería existir carga múltiple.

Por ejemplo:

Seleccionar 50 fotografías
            ↓
       Subir todas
            ↓
       Procesamiento
            ↓
         Publicar
10. Procesamiento de imágenes

Este será un componente importante.

Cuando el fotógrafo suba una fotografía original:

Original
6000 × 4000
15 MB

el sistema debería generar versiones optimizadas.

Por ejemplo:

Original
   │
   ├── Web
   │    2400 px
   │
   ├── Thumbnail
   │    600 px
   │
   └── Download
        versión con watermark

El objetivo es evitar utilizar fotografías gigantes directamente en el sitio.

Los formatos a considerar:

WebP;
AVIF cuando sea conveniente;
JPEG como fallback.
11. Watermark

El fotógrafo podrá configurar su marca de agua.

Opciones:

texto;
logo;
posición;
tamaño;
opacidad.

Ejemplo:

JUAN PÉREZ PHOTOGRAPHY

El watermark podrá utilizarse en las versiones descargables.

También podremos ofrecer una opción:

Aplicar watermark a todas las imágenes.

12. Protección de fotografías

El sistema tendrá protección básica.

Podrá:

desactivar menú contextual;
impedir arrastrar imágenes;
evitar enlaces directos obvios;
no mostrar archivos originales;
utilizar versiones optimizadas;
controlar las descargas;
utilizar versiones con watermark para descarga.

No se debe prometer protección absoluta.

Una imagen que puede verse en una pantalla siempre puede ser capturada.

13. Visor de fotografías

Al hacer clic en una fotografía:

┌──────────────────────────────────────┐
│                                      │
│             FOTOGRAFÍA               │
│                                      │
│                                      │
│   ←                            →     │
│                                      │
└──────────────────────────────────────┘

Funciones:

pantalla completa;
siguiente;
anterior;
cerrar;
zoom;
navegación mediante teclado;
navegación táctil en móvil.

Opcional:

información de fotografía;
título;
ubicación;
fecha.
14. Favoritas del fotógrafo

Habrá una sección especial:

Favoritas

El fotógrafo podrá marcar determinadas fotografías.

Ejemplo:

Mi selección


[foto] [foto] [foto]
[foto] [foto] [foto]

Estas fotografías podrán aparecer:

en la página de inicio;
en una sección independiente;
dentro de algunos temas.
15. Contacto

La página tendrá un formulario.

Campos:

nombre;
email;
teléfono opcional;
mensaje.

También:

email directo;
WhatsApp;
ubicación;
redes sociales.

Los mensajes podrán almacenarse en Supabase.

Opcionalmente podremos enviarlos también por email.

16. Redes sociales

Configurables:

Instagram;
Facebook;
TikTok;
YouTube;
Behance;
Flickr;
LinkedIn;
X;
WhatsApp.

El fotógrafo podrá activar/desactivar cada red.

17. Sistema de temas

El corazón visual de PhotoFolio será un sistema de temas.

Todos utilizarán los mismos datos.

                    DATOS
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
     Minimal      Editorial     Cinematic
        │             │             │
        └─────────────┼─────────────┘
                      ↓
                   PORTFOLIO

Los cinco temas iniciales:

Tema 1 — Minimal
limpio;
elegante;
mucho espacio;
fotografía protagonista.
Tema 2 — Editorial
composición tipo revista;
tipografía marcada;
layouts asimétricos.
Tema 3 — Cinematic
fotografías grandes;
pantalla completa;
transiciones suaves;
apariencia cinematográfica.
Tema 4 — Gallery
grid fotográfico;
mínimo texto;
máxima cantidad de fotografías visibles.
Tema 5 — Dark
fondo oscuro;
imágenes grandes;
estética premium.
18. Personalización visual

Independientemente del tema, el fotógrafo podrá configurar:

color principal;
color secundario;
fondo;
color de texto;
tipografía disponible;
logo;
favicon.

El objetivo es que dos fotógrafos puedan utilizar el mismo tema sin que sus páginas parezcan exactamente iguales.

19. Responsive

La página deberá funcionar correctamente en:

teléfonos;
tablets;
notebooks;
monitores grandes.

Especial atención a:

galerías;
imágenes;
menú;
visor;
navegación;
formularios.

La experiencia móvil será prioritaria porque muchas visitas llegarán desde Instagram.

20. SEO

Configuración básica:

título;
descripción;
URL;
favicon;
Open Graph;
imagen de compartir;
etiquetas relevantes;
sitemap;
robots.txt.

Cada fotógrafo podrá configurar:

Título:
Juan Pérez | Fotógrafo


Descripción:
Fotógrafo especializado en bodas y retratos...
21. Compartir en redes sociales

Cuando alguien comparta:

https://juanperez.cl

debería aparecer:

nombre;
descripción;
imagen;
título.

Utilizando Open Graph.

Esto es especialmente importante para fotógrafos que consiguen tráfico desde Instagram, Facebook, WhatsApp, etc.

22. Dominio personalizado

Cada instalación podrá utilizar un dominio propio.

Ejemplo:

juanperez.cl
mariafotografia.cl
fotografiapablo.com

El dominio será propiedad del cliente.

La configuración será:

Dominio
   ↓
Vercel
   ↓
PhotoFolio
   ↓
Supabase

El cliente será responsable del registro y renovación del dominio.

23. Infraestructura por cliente

Cada cliente tendrá:

Vercel

Un proyecto independiente.

Supabase

Un proyecto independiente.

Dominio

Uno propio.

Storage

Su propio almacenamiento.

Base de datos

Su propia base de datos.

Por lo tanto:

CLIENTE A


Vercel A
Supabase A
Dominio A
Storage A

y:

CLIENTE B


Vercel B
Supabase B
Dominio B
Storage B

No se mezclan sus datos.

24. Instalación

Debemos crear un proceso repetible para instalar el producto.

Conceptualmente:

Código PhotoFolio
       ↓
Crear proyecto Supabase
       ↓
Ejecutar SQL
       ↓
Crear tablas
       ↓
Crear RLS
       ↓
Crear Storage
       ↓
Configurar variables de entorno
       ↓
Crear proyecto Vercel
       ↓
Conectar repositorio
       ↓
Configurar variables
       ↓
Deploy
       ↓
Conectar dominio

La idea es que después podamos automatizar una buena parte de este proceso.

25. Configuración inicial

Después de instalarlo, el fotógrafo deberá poder configurar:

Información personal
↓
Tema
↓
Colores
↓
Redes
↓
Galerías
↓
Fotografías
↓
Favoritas
↓
Contacto
↓
Publicar
26. Dashboard

El panel principal podría mostrar:

Bienvenido, Juan


┌───────────────────────────┐
│ Fotografías       247     │
├───────────────────────────┤
│ Galerías           8      │
├───────────────────────────┤
│ Proyectos          12     │
├───────────────────────────┤
│ Favoritas          24     │
└───────────────────────────┘

También:

acceso rápido para subir fotos;
crear galería;
editar perfil;
cambiar diseño;
visitar sitio.
27. Configuración

Opciones:

General
nombre;
email;
idioma;
zona horaria.
Apariencia
tema;
colores;
tipografía.
Fotografías
tamaño máximo;
calidad;
watermark;
descarga;
protección.
SEO
título;
descripción;
imagen social.
Dominio
dominio actual;
instrucciones de configuración.
28. Arquitectura técnica

La base debería estar pensada para reutilización.

PhotoFolio/
│
├── components/
├── pages/
├── layouts/
├── themes/
│   ├── minimal/
│   ├── editorial/
│   ├── cinematic/
│   ├── gallery/
│   └── dark/
│
├── hooks/
├── services/
├── types/
├── utils/
└── database/

Los temas no deberían contener lógica de negocio propia.

Reciben datos y los presentan.

Eso permitirá modificar o crear nuevos temas sin romper el sistema.

29. Tecnologías

Para mantenerlo cercano a lo que ya conoces:

Frontend

React + TypeScript + Vite

Backend

Supabase

Base de datos

PostgreSQL

Autenticación

Supabase Auth

Storage

Supabase Storage

Hosting

Vercel

Control de versiones

GitHub

30. Funciones que NO incluiría inicialmente

Para evitar convertir un producto de US$50 en un proyecto interminable:

tienda de fotografías;
venta de fotografías;
reservas;
calendario;
pagos;
facturación;
blog;
newsletter;
estadísticas avanzadas;
cuentas para clientes;
comentarios sobre fotografías;
galerías privadas;
aplicación móvil;
integración compleja con Instagram;
inteligencia artificial;
edición fotográfica.

Todas pueden quedar como ideas futuras.

31. Funciones futuras potenciales

Una vez que el producto básico funcione, podríamos agregar:

Galerías privadas

El fotógrafo manda:

juanperez.cl/clientes/boda-maria

y el cliente accede con contraseña.

Selección de fotografías

El cliente puede marcar:

❤️ Fotografías favoritas

para que el fotógrafo sepa cuáles eligió.

Descargas

Permitir:

descargar originales;
descargar optimizadas;
descargar con watermark.
Clientes

Un pequeño CRM para fotógrafos.

Estadísticas
visitas;
páginas vistas;
galerías más visitadas;
fotografías más vistas.
32. Modelo comercial

El producto se venderá como:

Pago único.

El precio inicial podría mantenerse deliberadamente bajo.

Por ejemplo:

PhotoFolio — US$40–80

El precio definitivo lo decidiremos después de tener el producto funcionando y comprobar cuánto trabajo requiere instalarlo.

El cliente paga:

software;
instalación/personalización, según el paquete.

El cliente paga directamente:

dominio;
infraestructura;
cualquier servicio externo que utilice.

No prometemos hosting gratuito indefinido.

33. La regla más importante del proyecto

Tenemos que evitar convertir PhotoFolio en un SaaS gigante.

El objetivo es:

"Crear una instalación profesional rápidamente, personalizarla y entregarla."

No:

"Construir la plataforma definitiva para fotógrafos."

El producto debe ser simple, bonito, rápido y fácil de instalar.

34. Flujo completo del cliente

Finalmente, todo debería funcionar así:

                    CLIENTE
                       │
                       ↓
              Compra PhotoFolio
                       │
                       ↓
          Crea cuentas Vercel/Supabase
                       │
                       ↓
             Instalamos PhotoFolio
                       │
                       ↓
              Configura su perfil
                       │
                       ↓
               Elige uno de 5 temas
                       │
                       ↓
                Sube fotografías
                       │
                       ↓
                 Crea galerías
                       │
                       ↓
                Selecciona favoritas
                       │
                       ↓
               Configura contacto
                       │
                       ↓
               Configura dominio
                       │
                       ↓
                    PUBLICA
                       │
                       ↓
              www.fotografo.cl

Esta sería la especificación que yo usaría como contexto maestro para el agente de IA.

Y una decisión que dejaría grabada desde el principio: el agente no debería empezar a generar código todavía. Primero debería implementar la arquitectura, esquema de datos, seguridad/RLS y estructura de temas; después vamos construyendo las funciones una por una. Así evitamos que la IA termine creando una aplicación enorme y difícil de mantener.