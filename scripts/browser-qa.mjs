import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = '/tmp/construtech-chrome-qa';
const port = 9333;
await rm(profile, { recursive: true, force: true });
await mkdir('.qa', { recursive: true });
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'
], { stdio: 'ignore' });

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let version;
for (let i = 0; i < 30; i++) {
  try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); break; }
  catch { await pause(100); }
}
if (!version) throw new Error('Chrome DevTools no inició');

const page = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let id = 0;
const pending = new Map();
const events = new Map();
ws.onmessage = event => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) { const { resolve, reject } = pending.get(msg.id); pending.delete(msg.id); msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result); }
  if (msg.method && events.has(msg.method)) { events.get(msg.method).forEach(fn => fn(msg.params)); events.delete(msg.method); }
};
const send = (method, params = {}) => new Promise((resolve, reject) => { const callId = ++id; pending.set(callId, { resolve, reject }); ws.send(JSON.stringify({ id: callId, method, params })); });
const once = method => new Promise(resolve => { const list = events.get(method) || []; list.push(resolve); events.set(method, list); });
const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;
const load = async (width, height) => {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/demos/construtech/' });
  await loaded; await pause(250);
};
const screenshot = async path => {
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await import('node:fs/promises').then(fs => fs.writeFile(path, Buffer.from(data, 'base64')));
};
const checks = [];
const check = (name, ok, detail = '') => { checks.push({ name, ok: Boolean(ok), detail }); };

try {
  await send('Page.enable'); await send('Runtime.enable');
  await load(1440, 1000);
  await evaluate(`(async()=>{for(const image of document.images){image.scrollIntoView({block:'center'});await new Promise(r=>setTimeout(r,80));}scrollTo(0,0);await new Promise(r=>setTimeout(r,200));return true})()`);
  const desktop = await evaluate(`({
    title: document.title,
    disclosure: document.querySelector('.demo-notice').textContent.includes('Página web demo no oficial'),
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
    imageComplete: [...document.images].every(i => i.complete && i.naturalWidth > 0),
    sections: document.querySelectorAll('main section').length
  })`);
  check('Desktop carga con título', desktop.title.includes('CONSTRUTECH'));
  check('Desktop sin overflow horizontal', desktop.width <= desktop.viewport, `${desktop.width}/${desktop.viewport}`);
  check('Disclosure visible en DOM', desktop.disclosure);
  check('Imágenes cargadas', desktop.imageComplete);
  check('Secciones principales', desktop.sections >= 5, String(desktop.sections));
  await screenshot('.qa/desktop-1440.png');

  const modal = await evaluate(`(() => { document.querySelector('[data-project="gate"]').click(); const d=document.querySelector('[data-project-dialog]'); return {open:d.open,title:d.querySelector('[data-dialog-title]').textContent,source:d.querySelector('[data-dialog-source]').href}; })()`);
  check('Modal de proyecto abre', modal.open && modal.title === 'Portón metálico');
  check('Modal conserva fuente oficial', modal.source.includes('/construtech_anibaladdesse/p/'));
  await evaluate(`document.querySelector('[data-project-dialog]').close()`);

  const quote = await evaluate(`(() => {
    document.querySelector('[data-open-quote]').click();
    document.querySelector('input[name="service"]').click();
    document.querySelector('[data-step="1"] [data-next]').click();
    const note=document.querySelector('#project-note'); note.value='Automatizar un portón existente'; note.dispatchEvent(new Event('input',{bubbles:true}));
    document.querySelector('[data-step="2"] [data-next]').click();
    return {open:document.querySelector('[data-quote-dialog]').open, step3:document.querySelector('[data-step="3"]').classList.contains('is-active'), review:document.querySelector('[data-review-note]').textContent, external:document.querySelector('[data-step="3"] a').href};
  })()`);
  check('Simulador completa 3 pasos', quote.open && quote.step3);
  check('Resumen local coincide', quote.review === 'Automatizar un portón existente');
  check('CTA final solo abre Instagram', quote.external === 'https://www.instagram.com/construtech_anibaladdesse/');
  await evaluate(`document.querySelector('[data-quote-dialog]').close()`);

  await load(390, 844);
  const mobileBase = await evaluate(`({width:document.documentElement.scrollWidth,viewport:innerWidth,hero:document.querySelector('h1').innerText})`);
  check('Móvil sin overflow horizontal', mobileBase.width <= mobileBase.viewport, `${mobileBase.width}/${mobileBase.viewport}`);
  check('Hero visible en móvil', mobileBase.hero.includes('SOLUCIONES'));
  await screenshot('.qa/mobile-390.png');
  const mobileMenu = await evaluate(`(() => {
    const button=document.querySelector('.menu-toggle'); button.click();
    return {menuOpen:button.getAttribute('aria-expanded'),navVisible:getComputedStyle(document.querySelector('.main-nav')).display};
  })()`);
  check('Menú móvil abre', mobileMenu.menuOpen === 'true' && mobileMenu.navVisible !== 'none');
  await send('Page.captureScreenshot', { format: 'png' }).then(({data}) => import('node:fs/promises').then(fs => fs.writeFile('.qa/mobile-menu.png', Buffer.from(data, 'base64'))));

  const failed = checks.filter(item => !item.ok);
  checks.forEach(item => console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${item.detail ? ` — ${item.detail}` : ''}`));
  console.log(`\n${checks.length - failed.length}/${checks.length} pruebas de navegador superadas.`);
  if (failed.length) process.exitCode = 1;
} finally {
  ws.close(); chrome.kill('SIGTERM');
}
