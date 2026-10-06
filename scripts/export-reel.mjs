/**
 * Exporte le teaser du Reel en mp4 (1080 x 1920 et 720 x 1280, 30 i/s) à partir de la page /reel/?clean.
 * La page est pilotée image par image (window.__reel.seek) : le rendu est exactement celui de la page.
 *
 * Prérequis : le site tourne (npm run dev, port 4321 par défaut), Chrome et ffmpeg installés.
 *   node scripts/export-reel.mjs [adresse-du-site] [chemin-de-ffmpeg]
 * Sortie : public/reel/vitra-lightscape-teaser-1080x1920.mp4 et ...-720x1280.mp4
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const BASE = (process.argv[2] ?? 'http://localhost:4321').replace(/\/$/, '');
const FFMPEG = process.argv[3] ?? 'ffmpeg';
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
const FPS = 30;
let SECONDS = 6;
const PORT = 9333;
const out = join('public', 'reel');
const frames = join(tmpdir(), 'vitra-reel-frames');

if (!CHROME) throw new Error('Chrome ou Edge introuvable');
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });
mkdirSync(out, { recursive: true });

// profil Chrome neuf à chaque lancement : jamais de CSS ou d'images périmés en cache
const profil = join(tmpdir(), `vitra-profil-${Date.now()}`);
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${profil}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let tab;
for (let i = 0; i < 40 && !tab; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    tab = list.find((t) => t.type === 'page');
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
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d);
    pending.delete(d.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, (d) => (d.error ? reject(new Error(JSON.stringify(d.error))) : resolve(d.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: `${BASE}/reel/?clean&view=video` });
for (let i = 0; i < 80; i++) {
  const r = await send('Runtime.evaluate', { expression: "document.documentElement.dataset.reelReady === '1'", returnByValue: true });
  if (r.result.value) break;
  await sleep(250);
}

SECONDS = (await send('Runtime.evaluate', { expression: 'window.__reel.duration', returnByValue: true })).result.value;
const total = Math.round(FPS * SECONDS);
for (let f = 0; f < total; f++) {
  await send('Runtime.evaluate', { expression: `window.__reel.seek(${f / FPS})` });
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
  writeFileSync(join(frames, `f${String(f).padStart(4, '0')}.png`), Buffer.from(shot.data, 'base64'));
  if (f % 30 === 0) console.log(`image ${f}/${total}`);
}
ws.close();
chrome.kill();

const encode = (size, name) => {
  const args = ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), ...(size ? ['-vf', `scale=${size}:flags=lanczos`] : []), '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(out, name)];
  const r = spawnSync(FFMPEG, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg a échoué pour ${name}`);
  console.log('écrit', join(out, name));
};
encode(null, 'vitra-lightscape-teaser-1080x1920.mp4');
encode('720:1280', 'vitra-lightscape-teaser-720x1280.mp4');
rmSync(frames, { recursive: true, force: true });
rmSync(profil, { recursive: true, force: true });
