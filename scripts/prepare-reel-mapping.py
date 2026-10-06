"""
Prépare la texture de mapping du Reel : uniquement les formes de lumière (flammes), sans bâtiment.
Source : mapping mapping-sources/caserne-flammes.webp (fournie par l'équipe, non versionnée), fenêtre prise sur le grand mur
éclairé de la caserne, où il n'y a ni colonne, ni ciel, ni personnage. Sortie : public/reel/mapping-flammes.webp.
"""
from pathlib import Path
from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "mapping-sources" / "caserne-flammes.webp"
OUT = ROOT / "public" / "reel"
OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert("RGB").crop((905, 450, 1245, 830))
im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
im = ImageEnhance.Contrast(im).enhance(1.18)
im = ImageEnhance.Color(im).enhance(1.12)
im.save(OUT / "mapping-flammes.webp", quality=88, method=6)
print("mapping-flammes.webp", im.size)
