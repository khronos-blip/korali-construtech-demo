# Auditoría del paquete social — CONSTRUTECH

**Resultado: APROBADO**  
**Fecha:** 2026-09-23  
**Alcance:** archivos dentro de `social/`; sin despliegue, contacto ni publicación.

## Evidencia usada

- Activos visuales locales: `assets/images/project-01.jpg` a `project-10.jpg`.
- Registro local: `assets/images/sources.json`.
- Captura local de QA: `.qa/desktop-1440.png`.
- Hechos y límites: `README.md`, `index.html` y `assets/js/app.js`.
- No se navegó ni se incorporaron fuentes externas nuevas.

## Comprobaciones automáticas

Ejecutadas con:

```bash
node social/sources/audit.mjs
```

- 6/6 posts presentes y en **1080×1080 px**.
- Avatar: **1080×1080 px**.
- Mockup de perfil: **1400×1380 px**.
- Comparación: **1600×1000 px**.
- Cero tokens de placeholder detectados.
- **Message** confirmado como único contacto.
- Cero números telefónicos, emails o afirmaciones de WhatsApp detectados.
- Etiquetado conceptual/no oficial confirmado.
- Sintaxis de `generate.mjs` y `audit.mjs`: válida con `node --check`.

## Revisión visual

Se inspeccionaron individualmente los seis posts, avatar, mockup y comparación a resolución final. No se observaron textos cortados, solapamientos de interfaz, elementos sin terminar ni problemas materiales de contraste. En la revisión se sustituyó el fondo del post de contacto por un gráfico técnico abstracto para evitar que texto promocional embebido en una imagen fuente pudiera leerse como una afirmación vigente. También se reposicionó el pie del mockup para evitar superposición con la cuadrícula.

## Límites editoriales verificados

- **Message** es el único contacto mostrado.
- No se afirma teléfono, email, dirección, ciudad, precio, marca, garantía, años de experiencia ni plazo de entrega.
- Operadores, controles y motores se presentan como soluciones/contenido oficial, no como obras ejecutadas.
- El proceso se etiqueta como propuesta sujeta a confirmación.
- La comparación dice “presencia actual · documentada” y “propuesta web · conceptual no oficial”; además aclara que la síntesis actual no es una captura de perfil y que no implica un rediseño oficial.
