"""
Récupère les photos et les liens des fiches de la page « Architecture du Vitra Campus » (vitra.com).

Usage :  python3 scripts/fetch-photos.py     (Python 3 + Pillow, et curl ; si vitra.com répond 403, CURL=\"chemin/vers/un/autre/curl\")

Les images appartiennent à Vitra et à leurs photographes : projet étudiant fictif, usage de
maquette. À remplacer ou à faire autoriser avant tout usage réel (voir CREDITS.md).

Écrit public/photos/<id>.webp (960 px de large) et src/data/fiches.json.
"""
import io
import json
import os
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "photos"
JSON = ROOT / "src" / "data" / "fiches.json"
BASE = "https://www.vitra.com"
PAGE = BASE + "/fr-fr/campus/architecture"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"

# identifiant Vitra -> identifiant du site (src/data/batiments.ts)
IDS = {
    "vitrahaus": "vitrahaus", "rinruisseau": "ring-ruisseau", "silver": "airstream", "morrison": "arret-bus",
    "vdm1": "campus-gallery", "water-garden": "water-garden", "vdm2": "design-museum",
    "tools": "balancing-tools", "ando": "pavillon-ando", "doshi_retreat": "doshi",
    "frank-ghery-2": "halle-gehry", "frank-ghery-1": "halle-grimshaw-1981", "saana": "halle-sanaa",
    "grimshaw": "halle-grimshaw-1983", "schaulager": "schaudepot", "barregan-gallery": "barragan",
    "place-jean-prouve": "place-prouve", "firestation": "caserne", "designweg1": "designweg",
    "torre-numero-due": "torre", "siza": "halle-siza", "promenade": "promenade-siza",
    "rutsche": "tour-toboggan", "khudi_bari": "khudi-bari", "diogenes": "diogene",
    "umbrella-house": "umbrella", "tankstelle": "station-service", "dome": "dome",
    "tane_house": "tane", "garden": "oudolf", "blockhouse": "blockhaus",
}
# Le Designweg n'a pas de photo dans la carte : image de sa page de présentation
DESIGNWEG = (
    "/fr-fr/campus/news/details/the-vitra-designweg",
    "https://static.vitra.com/media/asset/5325034/storage/v_fullbleed_1440x/58806427.jpg",
)


def get(url):
    # vitra.com refuse les requêtes urllib (403) : on passe par curl, qui est accepté
    return subprocess.run([os.environ.get("CURL", "curl"), "-s", "-L", "-f", "-m", "60", "-A", UA, "-H", "Accept-Language: fr-FR,fr;q=0.9", url], check=True, capture_output=True).stdout


def main():
    html = get(PAGE).decode("utf-8")
    start = html.index("[", html.index('"pois":['))
    pois, _ = json.JSONDecoder().raw_decode(html[start:])
    OUT.mkdir(parents=True, exist_ok=True)
    fiches = {}
    for p in pois:
        sid = IDS.get(p["id"])
        if not sid:
            continue
        info = p.get("info", {})
        src = (info.get("image") or {}).get("src")
        href = (info.get("link") or {}).get("href")
        if sid == "designweg":
            href, src = DESIGNWEG
        if not src:
            print("pas de photo :", sid)
            continue
        im = Image.open(io.BytesIO(get(src))).convert("RGB")
        w = 960
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{sid}.webp", quality=78, method=6)
        fiches[sid] = {"w": w, "h": h, "href": BASE + href}
        print(sid, f"{w}x{h}")
    missing = set(IDS.values()) - set(fiches)
    print("sans fiche :", sorted(missing))
    JSON.write_text(json.dumps(fiches, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
