"""
Génère les images responsive du site à partir des photos originales.

Usage :  python3 scripts/optimize-images.py
Prérequis : Python 3 + Pillow (pip install pillow) avec prise en charge AVIF
            (Pillow >= 11.2, sinon installez pillow-avif-plugin).

- Lit les originaux dans  photos-sources/
- Applique l'orientation EXIF, recadre si besoin, supprime toutes les métadonnées
  (EXIF, modèle d'appareil, éventuelles données GPS)
- Écrit AVIF + WebP + JPEG en plusieurs largeurs dans  public/images/
- Écrit  src/data/images.json  (dimensions + largeurs disponibles) utilisé par
  le composant <Photo />.

Pour ajouter une photo : ajoutez une entrée dans PHOTOS, relancez le script,
puis décrivez-la dans src/data/photos.ts.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-sources"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "data" / "images.json"

WIDTHS = [480, 800, 1200, 1800, 2400]

# crop = (gauche, haut, droite, bas) en pixels, après rotation EXIF
PHOTOS = {
    "design-museum": {"file": "20260916_120451.jpg"},
    "vitrahaus": {"file": "20260916_093521.jpg", "crop": (0, 0, 3450, 2252)},  # retire les passants à droite
    "slide-tower": {"file": "20260916_100053.jpg"},
    "dome": {"file": "20260916_113210.jpg"},
    "vitrahaus-detail": {"file": "20260916_093521.jpg", "crop": (1000, 0, 3000, 1300)},
    "dome-detail": {"file": "20260916_113210.jpg", "crop": (900, 543, 2000, 1553)},
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for name, cfg in PHOTOS.items():
        im = ImageOps.exif_transpose(Image.open(SRC / cfg["file"])).convert("RGB")
        if "crop" in cfg:
            im = im.crop(cfg["crop"])
        w, h = im.size
        widths = [x for x in WIDTHS if x < w] + [min(w, WIDTHS[-1])]
        widths = sorted(set(widths))
        for tw in widths:
            th = round(h * tw / w)
            r = im.resize((tw, th), Image.LANCZOS)
            r.save(OUT / f"{name}-{tw}.avif", quality=52, speed=6)
            r.save(OUT / f"{name}-{tw}.webp", quality=74, method=6)
            r.save(OUT / f"{name}-{tw}.jpg", quality=80, optimize=True, progressive=True)
        manifest[name] = {"width": w, "height": h, "widths": widths}
        print(f"{name}: {w}x{h} -> {widths}")
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
