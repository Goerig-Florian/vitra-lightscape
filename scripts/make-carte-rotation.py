"""
Prépare le dossier exports/carte-rotation/ : UNE carte Lightscape qui tourne sur elle-même (jour -> dos avec le logo -> mapping),
en une page HTML autonome (double-clic pour l'ouvrir, aucune connexion nécessaire) + ses deux images.

  python scripts/make-carte-rotation.py [identifiant-du-bâtiment]     (défaut : design-museum)

Les identifiants disponibles sont les fichiers public/photos/<id>-mapping.png.
"""
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
bid = sys.argv[1] if len(sys.argv) > 1 else "design-museum"
OUT = ROOT / "exports" / "carte-rotation"
OUT.mkdir(parents=True, exist_ok=True)

jour = ROOT / "public" / "photos" / f"{bid}.webp"
mapping = ROOT / "public" / "photos" / f"{bid}-mapping.png"
assert jour.exists() and mapping.exists(), f"il faut {jour.name} et {mapping.name}"
shutil.copy(jour, OUT / "jour.webp")
shutil.copy(mapping, OUT / "mapping.png")
logo = (ROOT / "src" / "assets" / "logo" / "vitra-lightscape.svg").read_text(encoding="utf-8")
logo = logo.replace("<svg", '<svg aria-hidden="true" focusable="false"', 1)

html = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Carte Vitra Lightscape : rotation</title>
<style>
  /* La scène fait 1080 x 1920 (9:16) ; elle est réduite pour tenir dans la fenêtre. Ajouter ?clean à l'adresse pour la voir à 100 % sans interface. */
  html, body { margin: 0; height: 100%; background: #05060b; overflow: hidden; }
  .bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; gap: 1rem; justify-content: center; align-items: center; padding: .8rem; color: #ddd; font: 14px system-ui, sans-serif; }
  .bar button { font: inherit; color: inherit; background: transparent; border: 1px solid #666; border-radius: 99px; padding: .4rem 1rem; cursor: pointer; }
  .clean .bar { display: none; }
  .stage { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; transform-origin: 0 0; background: #000; overflow: hidden;
    background: radial-gradient(60% 40% at 50% 46%, #101a36, #000 70%); }

  /* ---- la carte : 620 x 930 px, ratio 2:3 ---- */
  .scene { position: absolute; left: 230px; top: 495px; width: 620px; height: 930px; perspective: 1700px; }
  .card { position: absolute; inset: 0; transform-style: preserve-3d; }
  .face { position: absolute; inset: 0; overflow: hidden; border-radius: 7% / 4.7%; background: #070a16; backface-visibility: hidden; -webkit-backface-visibility: hidden;
    box-shadow: 0 0 60px rgba(90, 169, 255, .18); }
  .back { transform: rotateY(180deg); background: radial-gradient(120% 80% at 50% 30%, #1a2142, #070a16 70%); }
  .face img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  #map { opacity: 0; }
  /* double filet doré lumineux */
  .frame { position: absolute; inset: 2.6% 3.4%; border-radius: 6% / 4%; border: 3px solid #e8b865;
    box-shadow: 0 0 14px rgba(255, 176, 80, .7), inset 0 0 12px rgba(255, 176, 80, .45), inset 0 0 0 6px rgba(5, 8, 20, .35), inset 0 0 0 8px rgba(232, 184, 101, .4); }
  .logo { position: absolute; color: #fff; filter: drop-shadow(0 2px 8px rgba(0, 0, 0, .6)); }
  .logo svg { display: block; width: 100%; height: auto; }
  .front .logo { top: 6.5%; left: 11%; width: 40%; }
  .back .logo { top: 50%; left: 50%; width: 62%; transform: translate(-50%, -50%); }
  .foil { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: color-dodge; opacity: var(--f, 0);
    background: repeating-linear-gradient(115deg, hsl(calc(var(--h, 0) * 1deg) 95% 60%) 0%, hsl(calc(var(--h, 0) * 1deg + 60deg) 95% 62%) 8%, hsl(calc(var(--h, 0) * 1deg + 120deg) 95% 60%) 16%, hsl(calc(var(--h, 0) * 1deg + 200deg) 95% 64%) 24%, hsl(calc(var(--h, 0) * 1deg + 280deg) 95% 62%) 32%);
    background-size: 220% 220%; background-position: var(--x, 50%) var(--y, 50%); }
  .shine { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light; opacity: var(--s, 0);
    background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, .35), transparent 45%); }
</style>
</head>
<body>
<div class="stage" id="stage">
  <div class="scene">
    <div class="card" id="card">
      <div class="face front">
        <img src="jour.webp" alt="" />
        <img src="mapping.png" alt="" id="map" />
        <div class="foil" id="foilF"></div><div class="shine" id="shineF"></div>
        <div class="frame"></div>
        <div class="logo">__LOGO__</div>
      </div>
      <div class="face back">
        <div class="foil" id="foilB"></div><div class="shine" id="shineB"></div>
        <div class="frame"></div>
        <div class="logo">__LOGO__</div>
      </div>
    </div>
  </div>
</div>
<div class="bar"><button id="replay">Rejouer</button><label><input type="checkbox" id="loop" checked /> Boucle</label></div>

<script>
  // Chronologie (secondes). Pour changer la vitesse : modifier SPIN_START, SPIN_END ou DURATION.
  const DURATION = 6;
  const SPIN_START = 0.7;   // la carte commence à tourner
  const SPIN_END = 3.4;     // un tour complet (360°) est terminé
  const TOURS = 1;          // nombre de tours (1 = 360°, 2 = 720°...)
  const NIGHT_AT = [1.5, 2.6]; // pendant que la carte est de dos, l'image passe du jour au mapping

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const inOut = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  const $ = (id) => document.getElementById(id);
  const card = $('card'), map = $('map');

  function render(t) {
    const spin = inOut(clamp((t - SPIN_START) / (SPIN_END - SPIN_START))) * 360 * TOURS;
    // petit balancement de la carte, plus marqué une fois posée, comme tenue à la main
    const calm = clamp((t - SPIN_END) / 0.6);
    const rx = Math.sin(t * 1.4) * (4 + 5 * calm) + 5 * Math.sin(Math.PI * clamp((t - SPIN_START) / (SPIN_END - SPIN_START)));
    const ry = spin + Math.sin(t * 1.1 + 1) * 6 * calm;
    const scale = 1 + 0.07 * Math.sin(Math.PI * clamp((t - SPIN_START) / (SPIN_END - SPIN_START)));
    card.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
    map.style.opacity = clamp((t - NIGHT_AT[0]) / (NIGHT_AT[1] - NIGHT_AT[0]));
    // reflet irisé : suit l'inclinaison, plus fort pendant le tour
    const moving = Math.sin(Math.PI * clamp((t - SPIN_START) / (SPIN_END - SPIN_START)));
    const f = Math.min(1, 0.25 + 0.75 * moving + 0.25 * calm * (0.5 + 0.5 * Math.sin(t * 2)));
    const x = 50 + 40 * Math.sin(ry * Math.PI / 180), y = 50 + 30 * Math.sin(rx * Math.PI / 90);
    for (const id of ['foilF', 'foilB', 'shineF', 'shineB']) {
      const e = $(id);
      e.style.setProperty('--x', x.toFixed(1) + '%'); e.style.setProperty('--y', y.toFixed(1) + '%');
      e.style.setProperty('--f', (f * 0.3).toFixed(3)); e.style.setProperty('--s', f.toFixed(3));
      e.style.setProperty('--h', Math.round(ry + x * 2).toString());
    }
  }

  function fit() {
    const k = document.documentElement.classList.contains('clean') ? 1 : Math.min(innerWidth / 1080, (innerHeight - 56) / 1920);
    $('stage').style.transform = 'scale(' + k + ') translateX(' + ((innerWidth / k - 1080) / 2) + 'px)';
  }

  let t0 = 0, raf = 0;
  function play() {
    cancelAnimationFrame(raf);
    t0 = performance.now();
    const tick = (now) => {
      let t = (now - t0) / 1000;
      if (t > DURATION + 0.8) { if ($('loop').checked) { t0 = now; t = 0; } else { render(DURATION); return; } }
      render(Math.min(t, DURATION));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  const clean = new URLSearchParams(location.search).has('clean');
  if (clean) document.documentElement.classList.add('clean');
  addEventListener('resize', fit);
  $('replay').addEventListener('click', play);
  // utilisé pour exporter la vidéo image par image (scripts/export-carte.mjs)
  window.__card = { seek: (t) => { cancelAnimationFrame(raf); render(t); }, ready: Promise.all([...document.images].map((i) => i.decode().catch(() => 0))) };
  fit();
  if (clean) render(0); else { render(0); play(); }
</script>
</body>
</html>
""".replace("__LOGO__", logo)
(OUT / "index.html").write_text(html, encoding="utf-8")
print("ok", OUT)
