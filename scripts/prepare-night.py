"""
Prépare les visualisations de nuit des fiches (fondu jour → nuit).

Usage :  python3 scripts/prepare-night.py     (Python 3 + Pillow)

Entrée : photos-nuit/ (originaux fournis par l'équipe, non versionnés : vagues 1 à 4 validées).
Sortie : public/photos/<id>-nuit.webp (même taille que la photo de jour) et src/data/nuit.json.

Chaque image de nuit reprend le cadrage de la photo de jour. Les appariements ont été établis en
comparant les contours des images, puis contrôlés à l'œil (planche jour / nuit).
Le Vitra Designweg n'a pas de vue de nuit : l'image « showroom Vitra Circle » n'est pas une étape.
"""
import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "photos-nuit"
OUT = ROOT / "public" / "photos"
FICHES = json.loads((ROOT / "src" / "data" / "fiches.json").read_text(encoding="utf-8"))

# identifiant de l'étape -> image de nuit (chemin relatif à photos-nuit/)
NUIT = {
    "airstream": "vague-2/remorque_glacier_sous_les_étoiles.png",
    "arret-bus": "vague-2/abri_bus_lumineux_sous_ciel_nocturne.png",
    "balancing-tools": "vague-2/sculpture_monumentale_sous_ciel_nocturne.png",
    "barragan": "vague-3/cour_minimaliste_sous_ciel_indigo.png",
    "blockhaus": "vague-3/pavillon_rustique_illuminé_dans_la_nuit.png",
    "campus-gallery": "vague-1/bâtiment_moderne_illuminé_sous_ciel_bleu_nuit.png",
    "caserne": "vague-1/architecture_contemporaine_sous_ciel_étoilé.png",
    "design-museum": "vague-1/musée_contemporain_illuminé_au_crépuscule.png",
    "diogene": "vague-2/cabane_moderne_sous_les_étoiles.png",
    "dome": "vague-1/dôme_géodésique_sous_ciel_nocturne.png",
    "doshi": "vague-4/87695146.jpg",
    "halle-gehry": "vague-1/architecture_moderne_illuminée_de_nuit.png",
    "halle-grimshaw-1981": "vague-2/élévation_moderne_illuminée_sous_ciel_indigo.png",
    "halle-grimshaw-1983": "vague-2/façade_industrielle_sous_un_ciel_bleu_nuit.png",
    "halle-sanaa": "vague-1/entrepôt_circulaire_illuminé_sous_ciel_nocturne.png",
    "halle-siza": "vague-1/entrepôt_industriel_sous_les_lumières_ambrées.png",
    "khudi-bari": "vague-3/pavillon_a_frame_illuminé_au_crépuscule.png",
    "oudolf": "vague-1/campus_paysager_illuminé_sous_le_ciel_nocturne.png",
    "pavillon-ando": "vague-2/architecture_moderne_illuminée_sous_ciel_nocturne.png",
    "place-prouve": "vague-3/ateliers_jean_prouvé_sous_les_arbres.png",
    "promenade-siza": "vague-3/entrée_moderne_sous_ciel_indigo.png",
    "ring-ruisseau": "vague-3/parc_nocturne_au_dôme_illuminé.png",
    "schaudepot": "vague-2/architecture_contemporaine_en_briques_sous_ciel_no.png",
    "station-service": "vague-2/pavillon_moderniste_illuminé_sous_ciel_indigo.png",
    "tane": "vague-3/pavillon_de_chaume_illuminé_sous_le_ciel_nocturne.png",
    "torre": "vague-3/colonne_lumineuse_dans_la_nuit_moderne.png",
    "tour-toboggan": "vague-1/tour_d_observation_illuminée_sous_ciel_indigo.png",
    "umbrella": "vague-3/pavillon_moderne_illuminé_dans_un_jardin_nocturne.png",
    "vitrahaus": "vague-2/vitrahaus_café_sous_les_étoiles.png",
    "water-garden": "vague-1/musée_contemporain_illuminé_au_bord_de_l_eau.png"
}


def main():
    done = []
    for sid, rel in NUIT.items():
        w, h = FICHES[sid]["w"], FICHES[sid]["h"]
        im = Image.open(SRC / rel).convert("RGB")
        # même cadrage que le jour : recadrage centré au même ratio, puis même taille
        im = ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(0.5, 0.5))
        im.save(OUT / f"{sid}-nuit.webp", quality=80, method=6)
        done.append(sid)
        print(sid, f"{w}x{h}")
    (ROOT / "src" / "data" / "nuit.json").write_text(json.dumps(sorted(done), ensure_ascii=False, indent=1), encoding="utf-8")
    print("sans nuit :", sorted(set(FICHES) - set(done)))


if __name__ == "__main__":
    main()
