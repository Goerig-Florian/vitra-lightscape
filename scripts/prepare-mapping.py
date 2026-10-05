"""
Prépare les visualisations de mapping de la landing (aperçu de fin de vidéo, « lampe torche », bloc « Votre soirée »).

Usage :  python3 scripts/prepare-mapping.py     (Python 3 + Pillow + NumPy)

Entrée : mapping-sources/ et photos-nuit/ (originaux fournis par l'équipe, non versionnés).
Sortie : public/mapping/*.webp (le nom change quand l'image change : GitHub Pages garde les fichiers 10 minutes en cache)

On ne garde que trois images, pour ne pas en montrer trop : le projet se découvre sur place.
- fin-video-mapping : la version mapping de la DERNIÈRE IMAGE DE LA VIDÉO d'accueil (même cadrage, 1672 x 941),
  qui apparaît en fondu pendant trois secondes à la fin de la vidéo.
- soiree-musee : le Vitra Design Museum aux faisceaux de lumière blanche (bloc « Votre soirée »), redimensionné.
- torche-nuit / torche-mapping : la caserne de NOTRE site (visualisation de nuit d'origine, pleine résolution
  1448 x 1086, cadrage identique à la photo de jour de vitra.com), seule, puis avec la texture « flammes » du
  mapping fourni par l'équipe projetée sur TOUS les plans de béton de la façade (toit, grand mur, dalle,
  murs bas, mur de gauche, mur de fond). Le mapping n'apparaît que dans le cercle de lumière.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "mapping-sources"
OUT = ROOT / "public" / "mapping"

WIDTH = 1400

# plans de béton de la caserne : coordonnées sur 960 x 720, mises à l'échelle de l'original (1448 x 1086)
PLANS = {
    "toit": [(392, 62), (463, 350), (462, 378), (405, 470), (330, 520), (240, 533), (195, 507)],
    "mur": [(463, 368), (648, 304), (668, 310), (722, 661), (421, 646), (408, 590), (408, 480)],
    "dalle": [(778, 395), (857, 375), (872, 640), (840, 640)],
    "bas": [(50, 570), (205, 545), (215, 637), (55, 625)],
    "gauche": [(272, 522), (336, 506), (342, 640), (268, 640)],
    "fond": [(708, 422), (778, 408), (838, 636), (712, 636)],
}
ECHELLE = 1448 / 960
# zones de flammes du mapping fourni (1448 x 1086) qui servent de texture à chaque plan. Toutes s'arrêtent
# au-dessus de y = 790 : plus bas, l'image d'origine montre des silhouettes de visiteurs.
TEXTURES = {
    "toit": (900, 480, 1290, 790),      # zone dense (comme le grand mur), sans les colonnes de l'image d'origine (x 760 - 890)
    "mur": (900, 470, 1300, 790),
    "dalle": (1020, 500, 1200, 790),
    "bas": (480, 640, 760, 790),
    "gauche": (480, 640, 760, 790),
    "fond": (900, 560, 1250, 790),
}
# les colonnes sont devant le toit : elles restent sans mapping
EXCLUS = [[(336, 360), (402, 356), (406, 652), (338, 652)]]
ORIGINAL_NUIT = ROOT / "photos-nuit" / "vague-1" / "architecture_contemporaine_sous_ciel_étoilé.png"


def apercu():
    im = Image.open(SRC / "musee-fin-video.webp").convert("RGB")
    im.save(OUT / "fin-video-mapping.webp", quality=80, method=6)
    print(f"fin-video-mapping: {im.width}x{im.height}")


def soiree():
    im = Image.open(SRC / "musee-faisceaux.webp").convert("RGB")
    w = min(WIDTH, im.width)
    h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(OUT / "soiree-musee.webp", quality=76, method=6)
    print(f"soiree-musee: {w}x{h}")


def torche():
    # base : l'original de la visualisation de nuit de la caserne, en pleine résolution (1448 x 1086)
    base = Image.open(ORIGINAL_NUIT).convert("RGB")
    base.save(OUT / "torche-nuit.webp", quality=82, method=6)
    flames = Image.open(SRC / "caserne-flammes.webp").convert("RGB")
    b = np.asarray(base, dtype=np.float32) / 255
    light = np.zeros_like(b)
    zone = np.zeros(b.shape[:2], dtype=np.float32)
    for i, (name, pts) in enumerate(PLANS.items()):
        poly = [(round(x * ECHELLE), round(y * ECHELLE)) for x, y in pts]
        x0, y0, x1, y1 = TEXTURES[name]
        xs, ys = [p[0] for p in poly], [p[1] for p in poly]
        bx0, by0, bx1, by1 = min(xs), min(ys), max(xs), max(ys)
        tex = ImageOps.fit(flames.crop((x0, y0, x1, y1)), (bx1 - bx0, by1 - by0), Image.LANCZOS)
        if name == "toit":
            tex = ImageOps.flip(tex)       # même matière que le grand mur, retournée
        elif i % 2:
            tex = ImageOps.mirror(tex)
        full = Image.new("RGB", base.size, (0, 0, 0))
        full.paste(tex, (bx0, by0))
        mask = Image.new("L", base.size, 0)
        ImageDraw.Draw(mask).polygon(poly, fill=255)
        mask = mask.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.6))  # un peu en retrait, bord adouci
        m = np.asarray(mask, dtype=np.float32)[..., None] / 255
        t = np.asarray(full, dtype=np.float32) / 255
        light = np.maximum(light, t * m)
        zone = np.maximum(zone, m[..., 0])
    # retire les colonnes (devant le toit)
    cut = Image.new("L", base.size, 0)
    for poly in EXCLUS:
        ImageDraw.Draw(cut).polygon([(round(x * ECHELLE), round(y * ECHELLE)) for x, y in poly], fill=255)
    keep = 1 - np.asarray(cut.filter(ImageFilter.GaussianBlur(1.6)), dtype=np.float32) / 255
    light *= keep[..., None]
    zone *= keep
    # lumière = flammes sans le fond de béton ; un fond de braise garantit qu'aucune partie du plan reste sans mapping
    ember = zone[..., None] * np.array([0.3, 0.09, 0.015], dtype=np.float32)
    glow = np.clip(np.clip((light - 0.12) / 0.88, 0, 1) * 1.05 + ember, 0, 1)
    dim = b * (1 - 0.5 * zone[..., None])  # le béton s'assombrit sous la projection, le reste de la photo ne change pas
    out = 1 - (1 - dim) * (1 - glow)
    Image.fromarray((np.clip(out, 0, 1) * 255).astype("uint8")).save(OUT / "torche-mapping.webp", quality=82, method=6)
    print("torche-nuit / torche-mapping:", base.size)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    apercu()
    soiree()
    torche()


if __name__ == "__main__":
    main()
