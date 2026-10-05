"""
Prépare la police du site (Futura, ParaType) à partir des fichiers TTF fournis par l'équipe.

Usage :  python3 scripts/prepare-font.py     (Python 3 + fontTools)

Entrée : polices-sources/FuturaCyrillic{Light,Book,Medium,Heavy}.ttf (non versionnés).
Sortie : src/assets/fonts/futura/futura-{light,regular,medium,heavy}.woff

La police fournie est une « Futura Cyrillic » : ASCII et cyrillique seulement, sans lettres accentuées.
Pour que tout le texte reste en Futura (aucune police de secours), on ajoute à la table de caractères
(cmap) des renvois vers des glyphes DÉJÀ présents : « é » s'affiche comme « e », « à » comme « a »,
« » comme “ ”, etc. Aucun contour n'est dessiné ni modifié. Le texte du site garde ses accents
(lecteurs d'écran, copier-coller, référencement). À remplacer par la Futura PT complète pour avoir les accents.

Restent à traiter dans les textes eux-mêmes (pas de glyphe équivalent) : œ → oe, ß → ss, © → (c).
"""
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "polices-sources"
OUT = ROOT / "src" / "assets" / "fonts" / "futura"

FILES = {"Light": "light", "Book": "regular", "Medium": "medium", "Heavy": "heavy"}

# caractère de remplacement -> lettres qui s'affichent comme lui
BASE = {
    "a": "àáâãäåāăą",
    "c": "çćĉċč",
    "e": "èéêëēĕėęě",
    "i": "ìíîïĩīĭį",
    "n": "ñńņň",
    "o": "òóôõöōŏő",
    "s": "śŝşš",
    "u": "ùúûüũūŭůűų",
    "y": "ýÿ",
    "z": "źżž",
    "A": "ÀÁÂÃÄÅĀĂĄ",
    "C": "ÇĆĈĊČ",
    "E": "ÈÉÊËĒĔĖĘĚ",
    "I": "ÌÍÎÏĨĪĬĮ",
    "N": "ÑŃŅŇ",
    "O": "ÒÓÔÕÖŌŎŐ",
    "S": "ŚŜŞŠ",
    "U": "ÙÚÛÜŨŪŬŮŰŲ",
    "Y": "ÝŸ",
    "Z": "ŹŻŽ",
    "x": "×",
    "“": "«",       # « -> “
    "”": "»",       # » -> ”
    "⋅": "·",       # point médian -> opérateur point
    " ": "    ",  # espaces insécables et fines -> espace
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, out in FILES.items():
        t = TTFont(SRC / f"FuturaCyrillic{name}.ttf")
        best = t.getBestCmap()
        added = 0
        for target, chars in BASE.items():
            glyph = best[ord(target)]
            for ch in chars:
                if ord(ch) in best:
                    continue
                for sub in t["cmap"].tables:
                    if sub.isUnicode() and (sub.format != 4 or ord(ch) <= 0xFFFF):
                        sub.cmap[ord(ch)] = glyph
                added += 1
        t.flavor = "woff"
        t.save(OUT / f"futura-{out}.woff")
        print(f"{name}: {added} renvois ajoutés -> futura-{out}.woff")


if __name__ == "__main__":
    main()
