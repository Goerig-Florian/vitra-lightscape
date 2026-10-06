/**
 * Exporte le clip /promo-tcg/ en mp4 vertical 1080 x 1920, 30 images par seconde, sans son, à partir de la page /promo-tcg/?clean.
 * La page est pilotée image par image (window.__promo.seek) : le rendu est exactement celui de la page, sans interface, curseur ni barre.
 *
 * Prérequis : le site tourne (npm run dev, port 4321), Chrome ou Edge et ffmpeg installés.
 *   node scripts/export-promo.mjs [adresse-du-site] [chemin-de-ffmpeg] [images-par-seconde] [--wide]
 * Sortie : exports/promo-tcg/promo-tcg-1080x1920.mp4 (vertical) ou, avec --wide, promo-tcg-wide-1920x1080.mp4 (horizontal 16:9, cadré sur le booster et le book)
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const WIDE = process.argv.includes('--wide');
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const BASE = (args[0] ?? 'http://localhost:4321').replace(/\/$/, '');
const FFMPEG = args[1] ?? 'ffmpeg';
const FPS = Number(args[2] ?? 30);
const W = WIDE ? 1920 : 1080;
const H = WIDE ? 1080 : 1920;
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!CHROME) throw new Error('Chrome ou Edge introuvable');
const PORT = 9333 + Math.floor(Math.random() * 400);
const dir = resolve('exports', 'promo-tcg');
const frames = join(tmpdir(), `vitra-promo-frames-${Date.now()}`);
const profil = join(tmpdir(), `vitra-promo-profil-${Date.now()}`); // profil neuf à chaque lancement : jamais de CSS périmé en cache
mkdirSync(dir, { recursive: true });
mkdirSync(frames, { recursive: true });

const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${profil}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tab;
for (let i = 0; i < 40 && !tab; i++) {
  try {
    tab = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page');
  } catch {
    await sleep(250);
  }
}
if (!tab) throw new Error('Chrome ne répond pas');
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) pending.get(d.id)(d);
};
const send = (method, params = {}) => new Promise((res) => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });

await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: `${BASE}/promo-tcg/?clean${WIDE ? '&wide' : ''}&t=0` });
for (let i = 0; i < 160; i++) {
  const r = await send('Runtime.evaluate', { expression: "document.documentElement.dataset.promoReady === '1'", returnByValue: true });
  if (r.result.result.value) break;
  await sleep(250);
}
const seconds = (await send('Runtime.evaluate', { expression: 'window.__promo.duration', returnByValue: true })).result.result.value;
const total = Math.round(FPS * seconds);
for (let f = 0; f < total; f++) {
  const r = await send('Runtime.evaluate', { expression: `window.__promo.seek(${f / FPS}); 'ok'`, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(`erreur de rendu à ${(f / FPS).toFixed(2)} s`);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  writeFileSync(join(frames, `f${String(f).padStart(4, '0')}.png`), Buffer.from(shot.result.data, 'base64'));
  if (f % 30 === 0) console.log(`image ${f}/${total}`);
}
ws.close();
chrome.kill();

const sortie = join(dir, WIDE ? 'promo-tcg-wide-1920x1080.mp4' : 'promo-tcg-1080x1920.mp4');
const r = spawnSync(FFMPEG, ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', sortie], { stdio: 'inherit' });
if (r.status !== 0) throw new Error('ffmpeg a échoué');
console.log('écrit', sortie);
await sleep(300);
rmSync(frames, { recursive: true, force: true });
rmSync(profil, { recursive: true, force: true });
