"""
Prépare les visualisations de mapping de la landing (aperçu de fin de vidéo, « lampe torche », bloc « Votre soirée »).

Usage :  python3 scripts/prepare-mapping.py     (Python 3 + Pillow + NumPy)

Entrée : mapping-sources/ (originaux fournis par l'équipe, non versionnés) et public/photos/caserne-nuit.webp.
Sortie : public/mapping/*.webp

On ne garde que trois images, pour ne pas en montrer trop : le projet se découvre sur place.
- apercu-musee : la version mapping de la DERNIÈRE IMAGE DE LA VIDÉO d'accueil (même cadrage, 1672 x 941),
  qui apparaît en fondu pendant trois secondes à la fin de la vidéo.
- soiree-musee : le Vitra Design Museum aux faisceaux de lumière blanche (bloc « Votre soirée »), redimensionné.
- torche-reveal : la caserne de NOTRE site (visualisation de nuit, cadrage identique à la photo de jour de
  vitra.com) sur laquelle on projette la texture « flammes » du mapping fourni par l'équipe, uniquement sur
  les plans de béton de la façade. La base de la torche est la visualisation de nuit seule (sans mapping),
  au même cadrage : le mapping n'apparaît donc que dans le cercle de lumière.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "mapping-sources"
OUT = ROOT / "public" / "mapping"

WIDTH = 1400

# plans de béton de la caserne (coordonnées de la visualisation de nuit, 960 x 720)
PLANS = {
    "toit": [(392, 62), (463, 350), (462, 378), (405, 470), (330, 520), (240, 533), (195, 507)],
    "mur": [(407, 438), (648, 304), (667, 312), (722, 662), (540, 652), (420, 646), (407, 560)],
    "dalle": [(778, 395), (857, 375), (872, 640), (840, 640)],
    "bas": [(50, 570), (205, 545), (215, 637), (55, 625)],
}
# zones de flammes du mapping fourni (1448 x 1086) qui servent de texture à chaque plan
TEXTURES = {
    "toit": (700, 160, 1240, 640),
    "mur": (900, 440, 1290, 770),      # au-dessus des silhouettes du bas de l'image d'origine
    "dalle": (950, 520, 1200, 770),
    "bas": (900, 480, 1290, 640),
}


def apercu():
    im = Image.open(SRC / "musee-fin-video.webp").convert("RGB")
    im.save(OUT / "apercu-musee.webp", quality=80, method=6)
    print(f"apercu-musee: {im.width}x{im.height}")


def soiree():
    im = Image.open(SRC / "musee-faisceaux.webp").convert("RGB")
    w = min(WIDTH, im.width)
    h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(OUT / "soiree-musee.webp", quality=76, method=6)
    print(f"soiree-musee: {w}x{h}")


def torche():
    base = Image.open(ROOT / "public" / "photos" / "caserne-nuit.webp").convert("RGB")
    flames = Image.open(SRC / "caserne-flammes.webp").convert("RGB")
    b = np.asarray(base, dtype=np.float32) / 255
    light = np.zeros_like(b)
    zone = np.zeros(b.shape[:2], dtype=np.float32)  # là où la façade reçoit le mapping
    for name, poly in PLANS.items():
        x0, y0, x1, y1 = TEXTURES[name]
        xs, ys = [p[0] for p in poly], [p[1] for p in poly]
        bx0, by0, bx1, by1 = min(xs), min(ys), max(xs), max(ys)
        tex = ImageOps.fit(flames.crop((x0, y0, x1, y1)), (bx1 - bx0, by1 - by0), Image.LANCZOS)
        full = Image.new("RGB", base.size, (0, 0, 0))
        full.paste(tex, (bx0, by0))
        mask = Image.new("L", base.size, 0)
        ImageDraw.Draw(mask).polygon(poly, fill=255)
        mask = mask.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.4))  # un peu en retrait, bord adouci
        m = np.asarray(mask, dtype=np.float32)[..., None] / 255
        t = np.asarray(full, dtype=np.float32) / 255
        light = np.maximum(light, t * m)
        zone = np.maximum(zone, m[..., 0])
    # lumière = flammes sans le fond de béton, puis fusion « écran » sur la façade
    glow = np.clip((light - 0.16) / 0.84, 0, 1) * 1.15
    dim = b * (1 - 0.5 * zone[..., None])  # le béton s'assombrit sous la projection, le reste de la photo ne change pas
    out = 1 - (1 - dim) * (1 - np.clip(glow, 0, 1))
    Image.fromarray((np.clip(out, 0, 1) * 255).astype("uint8")).save(OUT / "torche-reveal.webp", quality=80, method=6)
    print("torche-reveal:", base.size)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    apercu()
    soiree()
    torche()


if __name__ == "__main__":
    main()
