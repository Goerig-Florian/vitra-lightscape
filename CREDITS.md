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

## Visualisations de mapping de la landing

- **Aperçu de fin de vidéo** (`public/mapping/fin-video-mapping.webp`) : version mapping de la dernière image de la vidéo d'accueil, fournie par l'équipe, au même cadrage que la vidéo (1672 x 941). Elle apparaît en fondu à la fin de la vidéo et reste affichée.
- **Lampe torche** (`public/mapping/torche-nuit.webp`, `torche-mapping.webp`) : la **visualisation de nuit de la caserne de notre site**, en pleine résolution (1448 x 1086, même cadrage que la photo de jour de vitra.com), seule puis avec la texture « flammes » d'une visualisation de mapping fournie par l'équipe, projetée sur tous les plans de béton de la façade (toit, grand mur, dalle, murs bas, mur de gauche, mur de fond ; les colonnes restent intactes). Composition faite par `scripts/prepare-mapping.py` (originaux dans `mapping-sources/` et `photos-nuit/`, non versionnés). La base de la torche est la visualisation de nuit seule, sans mapping.
- **Musée aux faisceaux de lumière blanche** (`public/mapping/soiree-musee.webp`) : visualisation de projet fournie par l'équipe, bloc « Votre soirée ».
- Ce sont des **visualisations de projet**, pas des photographies d'une installation existante : le site le dit à chaque endroit. Les autres visualisations livrées ne sont volontairement pas publiées : le projet se découvre sur place.

## Données provisoires

Les dates, horaires et tarifs de `src/data/billetterie.ts` sont des **propositions** pour l'appel d'offres. Le site les signale comme provisoires.

## Police

- **Futura** (ParaType, graisses Light, Book, Medium et Heavy de « Futura Cyrillic »), fournie par l'équipe, dans `src/assets/fonts/futura/`. C'est la famille de vitra.com (`vitraFuturaV2`, quatre graisses : 300, 400, 500, 600).
- **Licence** : police commerciale (EULA ParaType, https://www.paratype.com/eula). Les fichiers n'autorisent pas l'intégration web (réglage « aperçu et impression »). Usage limité à cette maquette fictive ; une licence web est à acquérir avant tout usage réel.
- **Accents** : cette version ne contient que l'ASCII et le cyrillique, sans lettres accentuées. Pour que tout le texte reste en Futura, `scripts/prepare-font.py` ajoute à la table de caractères des renvois vers des glyphes déjà présents : « é » s'affiche comme « e », « « » comme « “ », etc. **Aucun contour n'est dessiné ni modifié**, mais le fichier de police est bien modifié (table `cmap`) : à signaler pour la licence. Le texte garde ses accents dans la page (lecteurs d'écran, copier-coller). Dans les textes eux-mêmes, œ devient « oe », ß « ss », © « (c) », et les flèches sont des icônes SVG. La Futura PT complète rendrait les accents (changer les fichiers de `src/assets/fonts/futura/`).
- **Hiérarchie** (relevée sur les feuilles de style de vitra.com) : grands titres en Regular 400, titres de bloc et libellés en Medium 500, emphases en Heavy 600, petites étiquettes en majuscules espacées ; Light 300 réservé aux grands chiffres.

## Textes d'architecture du livre de cartes

Les courtes notes sur l'architecture des 10 bâtiments (page de présentation, `src/data/lightscape-cards.ts`) sont une première rédaction de l'équipe, à partir des noms, architectes et dates de vitra.com et de connaissances publiques. **À relire et à valider avant toute diffusion.**

## Reel teaser (page interne /reel/)

- Logos : le SVG original du projet (`src/assets/logo/vitra-lightscape.svg`), sans aucune modification des tracés. Le « vitra. » seul sert de logo classique ; la barre et « Lightscape » s'y ajoutent.
- Mapping : `public/reel/mapping-flammes.webp`, uniquement les formes de lumière (flammes) prises sur le grand mur de la visualisation de la caserne fournie par l'équipe, sans bâtiment (`scripts/prepare-reel-mapping.py`). Il n'existe que dans les lettres du logo, dans la zone du balayage.
- Mockup Instagram : interface dessinée en code, compte @vitra de démonstration, **chiffres (mentions J'aime, commentaires, partages) fictifs**. Mockup destiné à la présentation de l'appel d'offres, pas à une publication. L'avatar est composé avec le logo « vitra. » du projet (pas d'avatar officiel dans le dépôt).
- Export : `node scripts/export-reel.mjs` produit les deux mp4 (1080 x 1920 et 720 x 1280, 30 i/s, 6 s) dans `public/reel/`.
- Cadres de téléphone (Instagram et TikTok) : dessinés en code, d'après le style d'un Samsung Galaxy S26 (cadre plat, poinçon central, boutons latéraux). Ce sont des **illustrations inspirées**, pas des visuels officiels Samsung, Instagram ou TikTok. Aucun logo de ces marques n'est utilisé.
