import { access, readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const html = await readFile('index.html', 'utf8');
const css = await readFile('assets/css/styles.css', 'utf8');
const js = await readFile('assets/js/app.js', 'utf8');
const sources = JSON.parse(await readFile('assets/images/sources.json', 'utf8'));
const checks = [];
const check = (name, condition, detail = '') => checks.push({ name, ok: Boolean(condition), detail });

check('HTML5 + idioma', html.startsWith('<!doctype html>') && html.includes('<html lang="es">'));
check('Jerarquía principal', (html.match(/<h1\b/g) || []).length === 1 && (html.match(/<main\b/g) || []).length === 1);
check('Disclosure visible x2', (html.match(/Página web demo no oficial; solicitudes simuladas/g) || []).length >= 2);
check('Sin formularios transmisibles', !/<form[^>]+action=/i.test(html) && js.includes("event.preventDefault()"));
check('Único contacto externo permitido', [...html.matchAll(/href="(https?:\/\/[^\"]+)"/g)].every(m => m[1].startsWith('https://www.instagram.com/construtech_anibaladdesse/')));
check('Sin recursos externos en runtime', !/(src|href)="https?:\/\//i.test(html.replaceAll(/href="https:\/\/www\.instagram\.com\/construtech_anibaladdesse\/[^"]*"/g, '')));
check('Prefix-safe', !/(src|href)="\/(?!\/)/.test(html));
check('Navegación accesible', html.includes('aria-controls="nav-principal"') && html.includes('aria-expanded="false"'));
check('Diálogos nativos', (html.match(/<dialog\b/g) || []).length === 2 && js.includes('.showModal()'));
check('Responsive móvil', css.includes('@media(max-width:680px)'));
check('Movimiento reducido', css.includes('prefers-reduced-motion:reduce'));
check('Focus visible', css.includes(':focus-visible'));
check('Datos no persistidos', !/localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/.test(js));
check('Fuentes oficiales registradas', sources.length === 10 && sources.every(item => /^project-\d{2}\.jpg$/.test(item.file) && item.source.startsWith('https://www.instagram.com/construtech_anibaladdesse/')));

const refs = [...html.matchAll(/(?:src|href)="((?:assets|scripts)\/[^"#?]+)"/g)].map(m => m[1]);
for (const ref of new Set(refs)) {
  try { await access(ref); check(`Activo: ${ref}`, true); }
  catch { check(`Activo: ${ref}`, false, 'no encontrado'); }
}
for (const item of sources) {
  try { await access(`assets/images/${item.file}`); check(`Fuente: ${item.file}`, extname(item.file) === '.jpg'); }
  catch { check(`Fuente: ${item.file}`, false, 'no encontrado'); }
}

const failed = checks.filter(c => !c.ok);
for (const c of checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
console.log(`\n${checks.length - failed.length}/${checks.length} comprobaciones superadas.`);
if (failed.length) process.exit(1);
