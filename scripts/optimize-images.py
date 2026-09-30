"""
Génère les images responsive du site à partir des fichiers de photos-sources/.

Usage :  python3 scripts/optimize-images.py   (ou npm run images)
Prérequis : Python 3 + Pillow avec prise en charge AVIF (Pillow >= 11.2).

- Applique l'orientation EXIF, supprime toutes les métadonnées.
- La vidéo du premier écran est fabriquée à part : scripts/make-video.py.
- Écrit AVIF + WebP + JPEG dans public/images/ et src/data/images.json.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-sources"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "data" / "images.json"

# Visualisations de nuit (galerie « Premières visualisations »)
SINGLES = {
    "vitrahaus-nuit": {"file": "vitrahaus-nuit.png", "widths": [480, 800, 1200, 1672]},
    "dome-nuit": {"file": "dome-nuit.png", "widths": [480, 800, 1200, 1672]},
    "design-museum-nuit": {"file": "design-museum-nuit.png", "widths": [480, 800, 1200, 1672]},
    "slide-tower-nuit": {"file": "slide-tower-nuit.png", "widths": [400, 640, 941]},
}


def load(name):
    return ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGB")


def export(im, name, widths):
    w, h = im.size
    widths = sorted({min(x, w) for x in widths})
    for tw in widths:
        th = round(h * tw / w)
        r = im if tw == w else im.resize((tw, th), Image.LANCZOS)
        r.save(OUT / f"{name}-{tw}.avif", quality=55, speed=6)
        r.save(OUT / f"{name}-{tw}.webp", quality=78, method=6)
        r.save(OUT / f"{name}-{tw}.jpg", quality=82, optimize=True, progressive=True)
    print(f"{name}: {w}x{h} -> {widths}")
    return {"width": w, "height": h, "widths": widths}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*"):
        f.unlink()
    manifest = {}
    for name, cfg in SINGLES.items():
        manifest[name] = export(load(cfg["file"]), name, cfg["widths"])
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
