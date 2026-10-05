"""
Prépare les visualisations de mapping de la landing (aperçu de fin de vidéo, effet « lampe torche »,
bloc « Votre soirée »).

Usage :  python3 scripts/prepare-mapping.py     (Python 3 + Pillow)

Entrée : mapping-sources/ (originaux fournis par l'équipe, non versionnés).
Sortie : public/mapping/*.webp (1400 px de large)

On ne garde que quatre images, pour ne pas en montrer trop : le projet se découvre sur place.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "mapping-sources"
OUT = ROOT / "public" / "mapping"

IMAGES = {
    "musee-faisceaux": "apercu-musee",        # aperçu de trois secondes à la fin de la vidéo d'accueil
    "caserne-faisceaux": "torche-base",       # façade calme, sous la torche
    "caserne-flammes": "torche-reveal",       # même cadrage : ce que la torche révèle
    "campus-vue-aerienne": "soiree-campus",   # le Campus de nuit vu d'en haut
}
WIDTH = 1400


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for src, out in IMAGES.items():
        im = Image.open(SRC / f"{src}.webp").convert("RGB")
        w = min(WIDTH, im.width)
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{out}.webp", quality=76, method=6)
        print(f"{out}: {w}x{h}")


if __name__ == "__main__":
    main()
