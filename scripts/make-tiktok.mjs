/**
 * Monte la vidéo TikTok à partir d'une vidéo de départ (paysage) : 1080 x 1920, le plan est centré sur un fond flouté de la même image ;
 * à 7 s, fondu au noir, puis le logo Vitra Lightscape et les dates de l'événement apparaissent en fondu.
 *
 *   node scripts/make-tiktok.mjs "<video-source.mp4>" "<chemin-de-ffmpeg>" [secondes-de-coupe=7]
 * Sorties : exports/tiktok/tiktok-1080x1920.mp4 et public/reel/tiktok-720x1280.mp4 (+ affiche).
 * La carte finale (logo + dates) est dessinée par Chrome avec la police Futura du site (aucune image externe).
 */
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const [src, FFMPEG = 'ffmpeg', cutArg = '7'] = process.argv.slice(2);
if (!src) throw new Error('Il faut la vidéo source en premier argument');
const CUT = Number(cutArg); // fin du plan conservé
const FADE = 0.7; // durée du fondu au noir (finit à CUT + 0,3)
const CARD = 2.8; // durée de la carte finale
const out = resolve('exports', 'tiktok');
mkdirSync(out, { recursive: true });

// ---------- carte finale : logo + dates (PNG transparent 1080 x 1920) ----------
const logo = readFileSync('src/assets/logo/vitra-lightscape.svg', 'utf-8').replace('<svg', '<svg fill="none"');
const font = (w, f) => `@font-face{font-family:F;font-weight:${w};src:url('${pathToFileURL(resolve('src/assets/fonts/futura', f)).href}')}`;
const html = `<!doctype html><meta charset="utf-8"><style>
${font(300, 'futura-light.woff')}${font(400, 'futura-regular.woff')}${font(500, 'futura-medium.woff')}
html,body{margin:0;width:1080px;height:1920px;background:transparent;color:#fff;font-family:F,Futura,sans-serif}
.c{position:absolute;left:0;right:0;top:760px;display:grid;justify-items:center;gap:56px;text-align:center}
.l{width:560px;color:#fff}.l svg{display:block;width:100%;height:auto}
.d{font-size:40px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;padding-left:.2em}
.s{font-size:26px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:#d9b26a;padding-left:.3em;margin-top:-26px}
</style><div class="c"><div class="l">${logo}</div><div class="d">3 septembre — 3 octobre 2027</div><div class="s">Vitra Campus</div></div>`;
const page = join(tmpdir(), `vitra-tiktok-${Date.now()}.html`);
writeFileSync(page, html);
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const PORT = 9400 + Math.floor(Math.random() * 400);
const profil = join(tmpdir(), `vitra-tiktok-profil-${Date.now()}`);
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${profil}`, '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tab;
for (let i = 0; i < 40 && !tab; i++) {
  try {
    tab = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page');
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
await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
await send('Page.navigate', { url: pathToFileURL(page).href });
await sleep(1500);
const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
const card = join(out, 'carte-finale.png');
writeFileSync(card, Buffer.from(shot.result.data, 'base64'));
ws.close();
chrome.kill();
await sleep(300);
rmSync(profil, { recursive: true, force: true });

// ---------- montage ----------
const T = CUT + 0.3; // fin de la partie vidéo (le fondu au noir se termine ici)
const total = T + CARD;
const filter = [
  // fond : la même image, agrandie et floutée ; plan : pleine largeur au centre
  `[0:v]trim=0:${T},setpts=PTS-STARTPTS,fps=30,split=2[a][b]`,
  `[a]scale=-2:1920,crop=1080:1920,boxblur=40:6,eq=brightness=-0.12[bg]`,
  `[b]scale=1080:-2[fg]`,
  `[bg][fg]overlay=(W-w)/2:(H-h)/2,fade=t=out:st=${CUT - 0.4}:d=${FADE + 0.4},format=yuv420p[va]`,
  // carte finale : noir + logo et dates en fondu
  `color=c=black:s=1080x1920:r=30:d=${CARD}[k]`,
  `[1:v]format=rgba,loop=loop=-1:size=1:start=0,trim=duration=${CARD},setpts=PTS-STARTPTS,fade=t=in:st=0.3:d=1.0:alpha=1[lg]`,
  `[k][lg]overlay=0:0,format=yuv420p[vb]`,
  `[va][vb]concat=n=2:v=1:a=0[v]`,
  // son : celui de la vidéo jusqu'au fondu, puis silence
  `[0:a]atrim=0:${T},asetpts=PTS-STARTPTS,afade=t=out:st=${CUT - 0.5}:d=0.8,apad=whole_dur=${total}[aud]`,
].join(';');
const run = (args) => {
  const r = spawnSync(FFMPEG, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error('ffmpeg a échoué');
};
const full = join(out, 'tiktok-1080x1920.mp4');
run(['-y', '-v', 'error', '-i', src, '-loop', '1', '-framerate', '30', '-i', card, '-filter_complex', filter, '-map', '[v]', '-map', '[aud]', '-t', String(total), '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', full]);
mkdirSync('public/reel', { recursive: true });
run(['-y', '-v', 'error', '-i', full, '-vf', 'scale=720:1280:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', 'public/reel/tiktok-720x1280.mp4']);
run(['-y', '-v', 'error', '-ss', '3', '-i', 'public/reel/tiktok-720x1280.mp4', '-frames:v', '1', '-q:v', '5', 'public/reel/tiktok-poster.jpg']);
rmSync(page, { force: true });
console.log('écrit', full, 'et public/reel/tiktok-720x1280.mp4', `(durée ${total.toFixed(1)} s)`);
