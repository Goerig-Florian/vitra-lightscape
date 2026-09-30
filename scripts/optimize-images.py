"""
Génère les images responsive du site à partir des fichiers de photos-sources/.

Usage :  python3 scripts/optimize-images.py   (ou npm run images)
Prérequis : Python 3 + Pillow avec prise en charge AVIF (Pillow >= 11.2).

- Applique l'orientation EXIF, supprime toutes les métadonnées.
- Paires jour / nuit : la photo de jour est ramenée exactement au cadrage et à la
  taille de la visualisation de nuit, pour que le fondu au défilement soit calé.
- Écrit AVIF + WebP + JPEG dans public/images/ et src/data/images.json.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-sources"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "data" / "images.json"

# Photos simples
SINGLES = {
    "design-museum": {"file": "20260916_120451.jpg", "widths": [640, 1024, 1600, 2400]},
}

# Paires jour / nuit (clé -> photo de jour, visualisation de nuit)
PAIRS = {
    "vitrahaus": ("20260916_093521.jpg", "vitrahaus-nuit.png"),
    "dome": ("20260916_113210.jpg", "dome-nuit.png"),
    "design-museum": ("20260916_120451.jpg", "design-museum-nuit.png"),
    "slide-tower": ("20260916_100053.jpg", "slide-tower-nuit.png"),
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
    for key, (day_file, night_file) in PAIRS.items():
        night = load(night_file)
        day = load(day_file).resize(night.size, Image.LANCZOS)
        portrait = night.height > night.width
        widths = [480, 720, 941] if portrait else [640, 1024, 1672]
        manifest[f"{key}-jour"] = export(day, f"{key}-jour", widths)
        manifest[f"{key}-nuit"] = export(night, f"{key}-nuit", widths)
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
