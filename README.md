# CONSTRUTECH — demo web no oficial

Demo local, responsive y sin dependencias de runtime para presentar los servicios y contenido visual de **CONSTRUTECH**. No se creó repositorio, no se publicó y no se configuró ningún envío de datos.

## Alcance verificado

El contenido se limita a datos suministrados y material público del perfil oficial:

- Automatización de portones.
- Visita → asesoría → presupuesto.
- Herrería, obras civiles, remodelación, trabajo eléctrico, albañilería y pintura.
- Motores, controles, accesorios y operadores eléctricos.
- Contacto único: [Instagram oficial](https://www.instagram.com/construtech_anibaladdesse/).

No se afirman ciudad, teléfono, WhatsApp, email, precios, marcas, garantías, años de experiencia, testimonios ni tiempos de entrega.

## Fuentes

- Perfil: `https://www.instagram.com/construtech_anibaladdesse/`
- Registro por imagen: [`assets/images/sources.json`](assets/images/sources.json)
- Imágenes: portadas oficiales guardadas localmente como `assets/images/project-01.jpg` a `project-10.jpg`.

Las tarjetas de “operadores”, “controles” y “motores” se presentan como **soluciones/contenido oficial**, no como obras ejecutadas. La fotografía `project-10.jpg` se describe únicamente por lo visible: un portón metálico.

## Estructura

```text
index.html                 Sitio completo
assets/css/styles.css      Sistema visual responsive
assets/js/app.js           Menú, modal y simulador local
assets/images/             Portadas y sources.json
scripts/build.mjs          Build estático a dist/
scripts/qa.mjs             QA estructural, activos y privacidad
wrangler.toml              Configuración preparada; no desplegada
```

## Uso local

```bash
npm run qa
npm run build
npm run serve
```

Abrir `http://localhost:4173/`. Para comprobar el prefijo de producción localmente, servir la carpeta que contenga `demos/construtech/` o montar `dist/` en esa ruta. Todos los recursos usan referencias relativas y funcionan bajo `/demos/construtech/`.

El QA de navegador usa Chrome instalado y espera el sitio en `http://127.0.0.1:4173/demos/construtech/`:

```bash
npm run qa:browser
```

## QA

`npm run qa` comprueba:

- HTML semántico y disclosure visible.
- Único destino externo permitido: el perfil/publicaciones oficiales de Instagram.
- Ausencia de recursos, llamadas de red y persistencia en runtime.
- Rutas relativas prefix-safe.
- Diálogos, navegación, foco, reducción de movimiento y breakpoint móvil.
- Existencia de todos los activos y de las 10 fuentes oficiales.
- Sintaxis JavaScript con `node --check`.

`npm run qa:browser` prueba desktop 1440 px y móvil 390 px: carga de imágenes, overflow, menú, modal de proyecto, fuentes oficiales y los tres pasos del simulador sin envío. Genera evidencia en `.qa/desktop-1440.png`, `.qa/mobile-390.png` y `.qa/mobile-menu.png`.

## Cloudflare (preparado, no desplegado)

`wrangler.toml` apunta a `dist/` y declara estas rutas:

- `koralidigital.com/demos/construtech/*`
- `www.koralidigital.com/demos/construtech/*`

Antes de cualquier despliegue autorizado: ejecutar `npm run build`, revisar la cuenta/zona activa y validar que el Worker/asset routing preserve el prefijo. Este proyecto no ejecuta ni solicita un despliegue.

## Demo pública

- [https://koralidigital.com/demos/construtech/](https://koralidigital.com/demos/construtech/)
- Demo conceptual no oficial; no procesa compras, pagos ni formularios reales.
