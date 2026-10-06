"""
Prépare les mappings d'arrière-plan du Reel à partir de VOS visualisations de mapping (originaux dans mapping-sources/, non versionnés).

On ne garde que des zones où il n'y a que de la lumière projetée (aucun bâtiment, ciel ou personnage), à leur résolution
d'origine, puis on les prolonge par symétrie jusqu'à la taille de la scène (1296 x 2304, soit 1,2 fois 1080 x 1920 : marge pour la dérive).
La symétrie prolonge les lignes sans coupure : les vagues et les arcs continuent de couler.

  mapping-interieur-a.webp  volutes et points bleus / violets sur le mur de l'intérieur   (mapping-sources/interieur-volutes.webp)
  mapping-interieur-b.webp  reflets de ces volutes au sol                                  (idem)
  mapping-orange.webp       vagues de lignes orange sur la brique                          (mapping-sources/halle-ondes-orange.webp)
  mapping-blanc.webp        faisceaux blancs qui rayonnent sur le mur en béton             (mapping-sources/caserne-faisceaux.webp)
  mapping-violet.webp       arcs concentriques violets de la halle ronde                   (mapping-sources/halle-cercles-violets.webp)

Usage : python scripts/prepare-reel-mapping.py     Sortie : public/reel/
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "mapping-sources"
OUT = ROOT / "public" / "reel"
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1296, 2304


def etendre(fichier, boite, nom, decalage=0.0, nettete=70):
    im = Image.open(SRC / fichier).convert("RGB").crop(boite)
    k = W / im.width
    im = im.resize((W, round(im.height * k)), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=nettete, threshold=2))
    # prolongement par symétrie, vers le haut et le bas : aucune coupure
    haut = np.asarray(im)
    mir = haut[::-1]
    bande = np.concatenate([haut, mir], axis=0)  # période : 2 x la hauteur de la zone
    reps = int(np.ceil((H + bande.shape[0]) / bande.shape[0])) + 1
    long = np.concatenate([bande] * reps, axis=0)
    y0 = int(decalage * bande.shape[0])
    out = long[y0 : y0 + H]
    Image.fromarray(out).save(OUT / nom, quality=90, method=6)
    print(nom, im.size, "->", (W, H))


if __name__ == "__main__":
    etendre("interieur-volutes.webp", (10, 300, 470, 610), "mapping-interieur-a.webp", 0.12)
    etendre("interieur-volutes.webp", (250, 810, 1350, 1086), "mapping-interieur-b.webp", 0.35)
    etendre("halle-ondes-orange.webp", (211, 380, 1207, 560), "mapping-orange.webp", 0.2)
    etendre("caserne-faisceaux.webp", (930, 440, 1280, 750), "mapping-blanc.webp", 0.0)
    etendre("halle-cercles-violets.webp", (330, 410, 1130, 580), "mapping-violet.webp", 0.3)
