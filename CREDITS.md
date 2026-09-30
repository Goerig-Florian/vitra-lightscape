# Sources et crédits

## Vidéo et images

- **Vidéo du premier écran** (`public/video/`) : montage fabriqué par `scripts/make-video.py`.
  - Photo de visite 20260916_120451.jpg (Vitra Design Museum, 16 septembre 2026).
  - Sa visualisation de nuit.
  - Le coucher de soleil est un étalonnage numérique.
  - La lumière douce sur le musée est un SVG superposé.
  - C'est une **simulation** : le site l'indique sous la vidéo.
- **Image de partage** (`og:image`) : `public/video/musee-affiche-nuit.jpg`, dernière image de la vidéo.
- Les « Premières visualisations » (vues de nuit de la VitraHaus, du Dôme, de la Tour-Toboggan et du musée) ont été **retirées du site** et du dépôt le 30 septembre 2026.
- Droits : conservés par l'équipe. Métadonnées retirées des fichiers publiés.

## Informations sur les bâtiments

- **Liste des 31 bâtiments et œuvres, auteurs et dates** : page « Architecture du Vitra Campus », https://www.vitra.com/fr-fr/campus/architecture, consultée le 30 septembre 2026.
- **Mode de mise en lumière** (façade, intérieur, interactif) : **proposition de l'équipe**, à affiner dans `src/data/batiments.ts`.
- **Ordre du parcours** : proposition de l'équipe (voir README.md, « Le parcours : ordre et sources »).

## Plan du parcours

- **Fond de plan, emprises des bâtiments, allées, parking et positions** : données © contributeurs OpenStreetMap, sous licence Open Database License (ODbL), https://www.openstreetmap.org/copyright. Extraites avec l'API Overpass le 30 septembre 2026 par `scripts/make-plan.py`. `src/data/plan.json` est une base dérivée de ces données : elle reste sous ODbL.
- **Barragán Gallery** : placée dans le bâtiment OSM du Vitra Schaudepot, qui l'abrite (vitra.com).
- **Positions approchées** : cinq œuvres absentes d'OpenStreetMap sont placées d'après leur description sur vitra.com, consultée le 30 septembre 2026.
  - Ring et Ruisseau.
  - Water Garden : voir aussi Wallpaper*, « Bas Smets' Water Garden ».
  - Place Jean Prouvé.
  - Vitra Designweg.
  - Torre Numero Due.

  Le README détaille la règle suivie pour chacune. Le site les signale par un repère en pointillé.
- L'attribution OpenStreetMap figure sous le plan et dans les crédits du pied de page.

## Données provisoires

Les dates, horaires et tarifs de `src/data/billetterie.ts` sont des **propositions** pour l'appel d'offres. Le site les signale comme provisoires.

## Police

Inter, de Rasmus Andersson, sous SIL Open Font License : `src/assets/fonts/Inter-OFL.txt`.
