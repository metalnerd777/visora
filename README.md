# Visora

Plantilla de portfolios profesionales para fotógrafos, diseñadores e ilustradores.
Cada cliente recibe su propio sitio con Supabase, Vercel y dominio, bajo un modelo
de pago único (sin suscripción).

La documentación funcional y técnica completa vive en [`context.md`](./context.md).

## Stack

- React 19 + TypeScript 6 + Vite 8
- Tailwind CSS 4
- React Router 7
- TipTap 3 (editor del blog, carga diferida)
- dnd-kit (reordenación en el admin)
- react-easy-crop + browser-image-compression (pipeline de imágenes)

## Desarrollo

```bash
npm install
npm run dev
```

Acceso al admin (mock local): `admin@visora.com` / `admin123` en `/admin`.

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # typecheck + build de producción
npm run lint     # ESLint
npm run preview  # previsualizar el build
```

## Estado

- Sitio público + edición inline completados.
- Temas: `minimal` y `editorial`.
- Blog con bloques, borradores, autoguardado y 4 diseños de entrada.
- Persistencia actual en `localStorage` (fase previa a Supabase).
- Próximo paso: conectar Supabase (datos, Storage y Auth real).

## Estructura

```
src/
├── components/      componentes públicos y compartidos
├── pages/           páginas del tema minimal + admin inline
├── themes/          registro, shell y páginas por tema
├── blogDesigns/     diseños de entrada del blog
├── lib/             hooks, contexto, pipeline de imágenes y utilidades
├── data/            datos demo y configuración por defecto
└── types/           tipos del dominio
```

## Convenciones

- Copy de interfaz en español neutro (sin voseo).
- Los componentes no contienen textos ligados a una profesión: todo sale de los datos.
- Toda subida de imágenes pasa por `src/lib/image.ts`.
- Ejecutar `npm run build` y `npm run lint` antes de cerrar un cambio.
