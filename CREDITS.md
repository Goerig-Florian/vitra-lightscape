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

## Carte du parcours

- **Fond de carte** (`public/campus-map.svg`, original dans `scripts/source/vitra-campus-map.svg`) : carte interactive du Vitra Campus, https://www.vitra.com/fr-fr/campus, fournie par l'équipe le 30 septembre 2026. Seul le calque de dessin est conservé. **Les droits appartiennent à Vitra : à faire confirmer avant tout usage au-delà de la maquette.**
- **Trajet** : calculé d'après les données © contributeurs OpenStreetMap, sous licence Open Database License (ODbL), https://www.openstreetmap.org/copyright. Extraites avec l'API Overpass le 30 septembre 2026 par `scripts/make-plan.py`. `scripts/data/osm-route.json` est une base dérivée de ces données : elle reste sous ODbL. `src/data/carte.json` en reprend le trajet, transposé dans le repère de la carte Vitra.
- **Positions** : les bâtiments sont repérés sur la carte Vitra par l'équipe, avec une transformation ajustée sur 13 bâtiments sûrs (voir README.md). Quatre étapes sont **approchées** faute d'élément sur la carte : Ring et Ruisseau, Water Garden, Place Jean Prouvé, Álvaro-Siza-Promenade. Leur emplacement suit les descriptions de vitra.com, consultée le 30 septembre 2026. Le site les signale par un repère en pointillé.
- **Barragán Gallery** : placée dans le volume du Vitra Schaudepot, qui l'abrite (vitra.com).
- L'attribution OpenStreetMap figure sous la carte et dans les crédits du pied de page.

## Photos des fiches

- **Photos de jour des bâtiments** (`public/photos/`) : photographies publiées sur la page « Architecture du Vitra Campus » de vitra.com, https://www.vitra.com/fr-fr/campus/architecture, récupérées le 30 septembre 2026 par `scripts/fetch-photos.py` (redimensionnées à 960 px). **Droits : Vitra et leurs photographes.** Usage limité à cette maquette universitaire fictive ; à remplacer ou à faire autoriser avant tout usage réel. Le site les signale par « Photo : vitra.com » et un lien vers la fiche d'origine.
- **Vitra Designweg** : photo de la page de présentation du Designweg, vitra.com.
- **Positions officielles** des points d'intérêt, utilisées pour poser les repères : données de la même page.

## Visualisations de nuit

- **Vues de nuit des fiches** (`public/photos/*-nuit.webp`) : visualisations fournies par l'équipe (vagues 1 à 4, « nuit validée »), au même cadrage que les photos de jour. Originaux dans `photos-nuit/` (non versionnés), préparés par `scripts/prepare-night.py`.
- Ce sont des **visualisations de projet**, pas des photographies d'une installation existante : le site le dit sous la carte et dans l'étiquette de la photo.
- 30 bâtiments sur 31 en ont une. Le **Vitra Designweg** n'a pas de vue de nuit. L'image « showroom Vitra Circle » livrée dans la vague 3 ne correspond à aucune étape et n'est pas utilisée.

## Données provisoires

Les dates, horaires et tarifs de `src/data/billetterie.ts` sont des **propositions** pour l'appel d'offres. Le site les signale comme provisoires.

## Police

Inter, de Rasmus Andersson, sous SIL Open Font License : `src/assets/fonts/Inter-OFL.txt`.
