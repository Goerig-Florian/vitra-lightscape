/**
 * Exporte la carte qui tourne (exports/carte-rotation/index.html) en mp4 1080 x 1920, 30 i/s, 6 s.
 *   node scripts/export-carte.mjs [chemin-de-ffmpeg]
 * Sortie : exports/carte-rotation/carte-rotation-1080x1920.mp4 (et une version 720 x 1280).
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const FFMPEG = process.argv[2] ?? 'ffmpeg';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const FPS = 30;
const SECONDS = 6;
const dir = resolve('exports', 'carte-rotation');
const frames = join(tmpdir(), 'vitra-carte-frames');
if (!CHROME) throw new Error('Chrome ou Edge introuvable');
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const chrome = spawn(CHROME, ['--remote-debugging-port=9555', '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', `--user-data-dir=${join(tmpdir(), 'vitra-carte-profile')}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tab;
for (let i = 0; i < 40 && !tab; i++) {
  try {
    tab = (await (await fetch('http://127.0.0.1:9555/json')).json()).find((t) => t.type === 'page');
  } catch {
    await sleep(250);
  }
}
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) pending.get(d.id)(d);
};
const send = (method, params = {}) => new Promise((res) => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });

await send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: `${pathToFileURL(join(dir, 'index.html')).href}?clean` });
await sleep(1500);
await send('Runtime.evaluate', { expression: 'window.__card.ready', awaitPromise: true });
for (let f = 0; f < FPS * SECONDS; f++) {
  await send('Runtime.evaluate', { expression: `window.__card.seek(${f / FPS})` });
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } });
  writeFileSync(join(frames, `f${String(f).padStart(4, '0')}.png`), Buffer.from(shot.result.data, 'base64'));
}
ws.close();
chrome.kill();

const encode = (size, name) => {
  const args = ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(frames, 'f%04d.png'), ...(size ? ['-vf', `scale=${size}:flags=lanczos`] : []), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', join(dir, name)];
  if (spawnSync(FFMPEG, args, { stdio: 'inherit' }).status !== 0) throw new Error('ffmpeg a échoué');
  console.log('écrit', join(dir, name));
};
encode(null, 'carte-rotation-1080x1920.mp4');
encode('720:1280', 'carte-rotation-720x1280.mp4');
rmSync(frames, { recursive: true, force: true });
